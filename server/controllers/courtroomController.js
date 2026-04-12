const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
const ChatSummary = require('../models/ChatSummary');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper to get consistent chat ID for P2P chats
const getConsolidatedChatId = (id1, id2, type) => {
    if (type === 'room') return id1;
    return [id1, id2].sort().join('_');
};

const getUnreadCount = async (type, from, to) => {
    const filter = type === 'room' ? [to] : [from, to];
    const messageReaders = await Message
        .find({ sender: { $ne: from } }) // sender is not self
        .all('users', filter)
        .select(['readers'])
        .sort({ createdAt: -1 })
        .lean();

    // count messages where user is NOT in readers
    return messageReaders.filter(({ readers }) => readers.indexOf(from) === -1).length || 0;
};

const getMessageInfo = async (type, from, to) => {
    const filter = type === 'room' ? [to] : [from, to];
    const message = await Message
        .findOne()
        .all('users', filter)
        .select(['message', 'sender', 'updatedAt', 'readers'])
        .sort({ createdAt: -1 })
        .lean();

    const unreadCount = await getUnreadCount(type, from, to);

    return {
        latestMessage: message?.message || null,
        latestMessageSender: message?.sender || null,
        latestMessageUpdatedAt: message?.updatedAt || null,
        unreadCount
    };
};

exports.getUserContacts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({ message: 'Missing required information.' });

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Role-based filtering
        let targetRoles = [];
        if (currentUser.role === 'user' || currentUser.role === 'civilian') {
            targetRoles = ['lawyer'];
        } else {
            targetRoles = ['user', 'civilian'];
        }

        const users = await User
            .find({ _id: { $ne: userId }, role: { $in: targetRoles } })
            .select(['name', 'role', 'profilePicture', 'email', 'phone'])
            .sort({ updatedAt: -1 })
            .lean();

        // Deduplicate by name
        const uniqueUsers = [];
        const seenNames = new Set();
        users.forEach(u => {
            if (!seenNames.has(u.name)) {
                seenNames.add(u.name);
                uniqueUsers.push(u);
            }
        });

        const formattedUsers = uniqueUsers.map(u => ({
            ...u,
            avatarImage: u.profilePicture || '',
            chatType: 'user'
        }));

        // Get unread counts for these users
        const contactWithMessages = await Promise.all(
            formattedUsers.map(async (contact) => {
                const { _id, chatType: type } = contact;
                const messageInfo = await getMessageInfo(type, userId, _id.toString());

                return {
                    ...contact,
                    ...messageInfo
                };
            })
        );

        // Sort by latest activity
        contactWithMessages.sort((a, b) => {
            const timeA = new Date(a.latestMessageUpdatedAt || 0).getTime();
            const timeB = new Date(b.latestMessageUpdatedAt || 0).getTime();
            return timeB - timeA;
        });

        return res.status(200).json({ data: contactWithMessages });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

exports.getUserMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, chatId } = req.query;

        if (!userId || !type || !chatId) {
            return res.status(400).json({ message: 'Missing required information.' });
        }

        const filter = type === 'room' ? [chatId] : [userId, chatId];
        const messages = await Message
            .find()
            .all('users', filter)
            .sort({ createdAt: 1 })
            .lean();

        const messagesWithData = await Promise.all(
            messages.map(async (msg) => {
                const senderId = msg.sender;
                const user = await User.findById(senderId).select('profilePicture role').lean();
                return {
                    ...msg,
                    avatarImage: user?.profilePicture || '',
                    role: user?.role || 'civilian'
                };
            })
        );

        return res.status(200).json({ data: messagesWithData });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

// CREATE
exports.postUserMessage = async (req, res) => {
    try {
        const { userId } = req.params;
        const { chatId } = req.query;
        const { message } = req.body;

        if (!userId || !chatId || !message) {
            return res.status(400).json({ message: 'Missing required information.' });
        }

        const newMessage = await Message.create({
            message,
            users: [userId, chatId],
            sender: userId,
            readers: []
        });

        return res.status(200).json({ data: newMessage });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.postRoom = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, users, avatarImage } = req.body;

        if (!userId || !name || !users || !avatarImage) {
            return res.status(400).json({ message: 'Missing required information.' });
        }

        const data = await Room.create({
            name,
            users: [...users, userId],
            avatarImage,
            chatType: 'room'
        });

        return res.json({ data, messages: 'Successfully created a room.' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE
exports.updateMessageReadStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, chatId } = req.query;

        if (!userId || !type || !chatId) {
            return res.status(400).json({ message: 'Missing required information.' });
        }

        const filter = type === 'room' ? [chatId] : [userId, chatId];

        // Find all messages where sender is NOT userId
        const messages = await Message
            .find({ sender: { $ne: userId } })
            .all('users', filter);

        await Promise.all(messages.map(msg => {
            if (!msg.readers.includes(userId)) {
                msg.readers.push(userId);
                return msg.save();
            }
            return null;
        }));

        return res.status(200).json({ data: null, message: 'Successfully updated.' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PINNING
exports.toggleMessagePin = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        message.isPinned = !message.isPinned;
        await message.save();

        res.json({ status: 'success', data: message });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message: newMessage } = req.body;
        const { userId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        message.message = newMessage;
        await message.save();

        res.json({ status: 'success', data: message });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Message.findByIdAndDelete(messageId);
        res.json({ status: 'success', message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// AI SUMMARY
exports.generateChatSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, chatId } = req.body;

        const filter = type === 'room' ? [chatId] : [userId, chatId];
        const messages = await Message.find().all('users', filter).sort({ createdAt: 1 }).lean();

        if (messages.length < 2) {
            return res.status(400).json({ message: 'Not enough conversation to summarize.' });
        }

        // Format chat for AI
        const chatText = messages.map(m => `Sender(${m.sender}): ${m.message}`).join('\n');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Analyze the following legal conversation between a user and a legal expert. 
        Provide a JSON response with the following fields:
        1. legalIssue: A short title of the main legal problem.
        2. summary: A 2-3 sentence summary of the discussion.
        3. keyArguments: An array of 2-3 key points discussed.
        4. ipcSections: An array of mentioned or highly relevant IPC sections (e.g., ["IPC 302", "IPC 323"]).

        Conversation:
        ${chatText}

        Return only valid JSON.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json|```/g, '').trim();
        const aiData = JSON.parse(responseText);

        const consId = getConsolidatedChatId(userId, chatId, type);

        const summary = await ChatSummary.findOneAndUpdate(
            { chatId: consId },
            {
                ...aiData,
                chatId: consId,
                users: type === 'room' ? [] : [userId, chatId],
                lastUpdated: Date.now()
            },
            { upsert: true, new: true }
        );

        res.json({ status: 'success', data: summary });
    } catch (err) {
        console.error("Summary Error:", err);
        res.status(500).json({ message: 'Failed to generate summary' });
    }
};

exports.getChatSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, chatId } = req.query;
        const consId = getConsolidatedChatId(userId, chatId, type);

        const summary = await ChatSummary.findOne({ chatId: consId });
        res.json({ status: 'success', data: summary });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// AI SUGGESTIONS
exports.getLegalSuggestions = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.length < 5) return res.json({ data: [] });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Analyze this message and suggest up to 3 relevant Indian Penal Code (IPC) sections if any crime or legal issue is mentioned. 
        Return an array of objects with 'section' and 'reason'. 
        If no legal issue, return an empty array [].
        Message: "${message}"`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json|```/g, '').trim();

        // Basic fallback if Gemini returns non-json
        if (!text.startsWith('[')) text = "[]";

        const suggestions = JSON.parse(text);
        res.json({ status: 'success', data: suggestions });
    } catch (err) {
        res.json({ data: [] });
    }
};
