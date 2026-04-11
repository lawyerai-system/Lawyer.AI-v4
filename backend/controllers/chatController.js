const ChatSession = require('../models/ChatSession');
const legalService = require('../services/legalService');
const logAIUsage = require('../utils/aiLogger');
const axios = require('axios');

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper function to get answer from Python ML Service
const getMLAnswer = async (question) => {
    try {
        const response = await axios.post('http://localhost:5001/api/get-answer', { question });
        if (response.data && response.data.status === 'success') {
            return { answer: response.data.answer, confidence: response.data.confidence };
        }
        return null;
    } catch (error) {
        return null;
    }
};

// Helper function to get answer from Google Gemini
const getGeminiAnswer = async (question) => {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing in .env");
        return null;
    }
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using correct stable model name
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log(`[Gemini] Processing query: "${question.substring(0, 50)}..."`);

        // Fetch local database context
        let contextText = "";
        try {
            const legalResults = await legalService.searchLegalData(question);
            console.log(`[LegalService] Found ${legalResults ? legalResults.length : 0} context items`);

            if (legalResults && legalResults.length > 0) {
                // Take top 3 most relevant results
                const topResults = legalResults.slice(0, 3);
                contextText = "===== KNOWLEDGE BASE CONTEXT =====\n" +
                    topResults.map(r => `Source: ${r.source}\nSection: ${r.section}\nTitle: ${r.title}\nDescription: ${r.description}`).join("\n\n") +
                    "\n==================================\n\n";
            }
        } catch (e) {
            console.error("Failed to fetch legal context for Gemini", e);
        }

        const prompt = `You are LawAI, an expert AI Legal Assistant for Indian Law.
You must provide accurate, concise answers utilizing relevant Indian laws, constitutional articles, or acts.

You MUST structure your response EXACTLY with these 4 headings (do not change the headings):

### 1. Relevant Law or Section
List the applicable sections here. IMPORTANT: Always format legal citations as special markdown links so they become clickable badges in our UI. 
Format: [Source Section/Article Number](#section-Source-Number)
Examples:
- [IPC Section 302](#section-IPC-302)
- [Constitution Article 14](#section-Constitution-14)
- [CrPC Section 41](#section-CrPC-41)
If there is no specific law, state "General Legal Principle".

### 2. Explanation
Explain the law or legal concept in simple, easy-to-understand language for a common citizen.

### 3. Possible Punishment or Legal Implication
State the exact punishment, fine, or legal consequence specified by the law. If not applicable, explain the civil/legal implication.

### 4. Example Scenario
Provide a single concrete, hypothetical example to help clarify how this law is applied in the real world.

${contextText}User Query: ${question}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            console.warn("[Gemini] Empty response from API");
            return null;
        }

        console.log("[Gemini] Successfully generated response");
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        if (error.response) console.error("Gemini Data:", error.response.data);
        return null;
    }
};

const sendMessage = async (req, res) => {
    const startTime = Date.now();
    try {
        const { message, sessionId } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ status: 'error', message: 'Message is required' });
        }

        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, userId });
        }

        // If no session exists or ID not found, create one
        if (!session) {
            session = new ChatSession({ userId, messages: [] });
        }

        // Update Title if it's the first message
        if (session.messages.length === 0) {
            session.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
        }

        // Save User Message
        session.messages.push({ role: 'user', content: message });

        let botResponse = null;
        let source = 'none';

        // 1. Try Local ML  (If active)
        const mlResult = await getMLAnswer(message);
        if (mlResult) {
            botResponse = mlResult.answer;
            source = 'ml';
        }

        // 2. Try Gemini with injected legal context (Main Flow)
        if (!botResponse) {
            const aiResponse = await getGeminiAnswer(message);
            if (aiResponse) {
                botResponse = aiResponse;
                source = 'gemini';
            }
        }

        // 3. Final Fallback if ALL fail
        if (!botResponse) {
            botResponse = "I apologize, but I am unable to generate a response at the moment. Please try again later.";
            source = 'fallback';
            // LOG FAILURE
            await logAIUsage('Legal AI', userId, startTime, false, 'AI failed to generate response');
        } else {
            // LOG SUCCESS
            await logAIUsage('Legal AI', userId, startTime, true);
        }

        // Save Bot Message
        session.messages.push({ role: 'bot', content: botResponse });
        await session.save();

        res.status(200).json({
            status: 'success',
            data: {
                response: botResponse,
                sessionId: session._id,
                title: session.title,
                source
            }
        });

    } catch (error) {
        console.error("Chat Error:", error);
        await logAIUsage('Legal AI', req.user?.id || 'anonymous', startTime, false, error.message);

        // RETURN A FRIENDLY ERROR INSTEAD OF 500
        res.status(200).json({
            status: 'success',
            data: {
                response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
                sessionId: req.body.sessionId // Return ID if possible to keep chat alive
            }
        });
    }
};

const createSession = async (req, res) => {
    try {
        const session = new ChatSession({
            userId: req.user.id,
            messages: []
        });
        await session.save();
        res.status(201).json({ status: 'success', data: session });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create session' });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({ userId: req.user.id }).sort({ lastUpdated: -1 });
        res.status(200).json({ status: 'success', data: sessions });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch sessions' });
    }
};

const getSession = async (req, res) => {
    try {
        const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.user.id });
        if (!session) return res.status(404).json({ status: 'error', message: 'Session not found' });
        res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to load session' });
    }
};

const deleteSession = async (req, res) => {
    try {
        await ChatSession.findOneAndDelete({ _id: req.params.sessionId, userId: req.user.id });
        res.status(200).json({ status: 'success', message: 'Session deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete session' });
    }
};

const getSectionDetails = async (req, res) => {
    try {
        const { source, section } = req.query;
        if (!source || !section) {
            return res.status(400).json({ status: 'error', message: 'Source and section are required' });
        }
        const data = await legalService.getLegalSectionDetails(source, section);
        if (data) {
            res.status(200).json({ status: 'success', data });
        } else {
            res.status(404).json({ status: 'error', message: 'Section not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch section details' });
    }
};

module.exports = { createSession, getSessions, getSession, deleteSession, sendMessage, getSectionDetails };
