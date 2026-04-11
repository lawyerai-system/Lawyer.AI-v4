const { GoogleGenerativeAI } = require("@google/generative-ai");
const MootCourtSession = require("../models/MootCourtSession");
const logAIUsage = require('../utils/aiLogger');

exports.startSession = async (req, res) => {
    const startTime = Date.now();
    try {
        const { role, difficulty } = req.body;
        const userId = req.user.id;

        if (!role || !difficulty) {
            return res.status(400).json({ status: 'fail', message: 'Role and difficulty are required.' });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are a legal case generator. Generate a fictional but realistic Indian legal case for a Moot Court session.
        Role of the User: ${role}.
        Difficulty level: ${difficulty}.

        The case should include:
        - A catchy Case Title.
        - Detailed Case Background.
        - Relevant IPC sections or other legal acts.
        - Summary of Evidence.
        - Major Witness Statements.

        Return the response in ONLY this JSON format:
        {
            "title": "Case Title",
            "background": "Complete background story...",
            "relevantSections": ["Sec 1...", "Sec 2..."],
            "evidence": ["Evidence 1...", "Evidence 2..."],
            "witnesses": ["Witness 1 statement...", "Witness 2 statement..."],
            "judgeOpening": "The judge's first statement to open the session."
        }
        Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json|```/g, '').trim();

        // Basic cleanup
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        const caseData = JSON.parse(responseText);

        // Create initial session with judge's opening message
        const newSession = await MootCourtSession.create({
            userId,
            role,
            difficulty,
            caseDetails: {
                title: caseData.title,
                background: caseData.background,
                relevantSections: caseData.relevantSections,
                evidence: caseData.evidence,
                witnesses: caseData.witnesses
            },
            messages: [{
                sender: 'AI Judge',
                content: caseData.judgeOpening
            }]
        });

        await logAIUsage('Moot Court Simulator', userId, startTime, true);

        res.status(201).json({
            status: 'success',
            data: newSession
        });

    } catch (err) {
        await logAIUsage('Moot Court Simulator', req.user?.id || 'anonymous', startTime, false, err.message);
        console.error("Moot Court Start Error:", err);
        res.status(500).json({ status: 'error', message: 'Failed to start moot court session: ' + err.message });
    }
};

exports.sendMessage = async (req, res) => {
    const startTime = Date.now();
    try {
        const { sessionId, message } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({ status: 'fail', message: 'Session ID and message are required.' });
        }

        const session = await MootCourtSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ status: 'fail', message: 'Session not found.' });
        }

        // Add user message to history
        session.messages.push({ sender: 'User', content: message });

        // Get AI responses (Judge + Opposing Counsel)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Build history from session messages
        const chatHistory = session.messages.map(m => `${m.sender}: ${m.content}`).join('\n');

        const prompt = `You are a group of AI participants in a Moot Court simulator. 
        Case: ${session.caseDetails.title}
        Background: ${session.caseDetails.background}
        User's Role: ${session.role}
        Difficulty: ${session.difficulty}

        Current Session History:
        ${chatHistory}

        You must now provide two responses:
        1. As the "AI Opposing Lawyer": Provide a sharp, legal counter-argument to the user's latest message based on the case details.
        2. As the "AI Judge": React to the debate and ask a difficult legal question to the user related to their stance or the IPC sections involved.

        Return ONLY a JSON array with these two responses:
        [
            { "sender": "AI Opposing Lawyer", "content": "Your counter argument..." },
            { "sender": "AI Judge", "content": "The judge's follow-up question..." }
        ]
        Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json|```/g, '').trim();

        // Basic cleanup
        const jsonStart = responseText.indexOf('[');
        const jsonEnd = responseText.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        const aiResponses = JSON.parse(responseText);

        // Add to session
        aiResponses.forEach(msg => session.messages.push(msg));
        await session.save();

        await logAIUsage('Moot Court Simulator', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: aiResponses
        });

    } catch (err) {
        await logAIUsage('Moot Court Simulator', req.user?.id || 'anonymous', startTime, false, err.message);
        console.error("Moot Court Message Error:", err);
        res.status(500).json({ status: 'error', message: 'Failed to continue simulation: ' + err.message });
    }
};

exports.endSession = async (req, res) => {
    const startTime = Date.now();
    try {
        const { sessionId } = req.body;
        const session = await MootCourtSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ status: 'fail', message: 'Session not found.' });
        }

        // Generate Evaluation
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const historyText = session.messages.map(m => `${m.sender}: ${m.content}`).join('\n');

        const prompt = `Evaluate the user's performance in the following Moot Court session.
        User's Role: ${session.role}
        Case: ${session.caseDetails.title}

        Session History:
        ${historyText}

        Provide a detailed evaluation in the following JSON format:
        {
            "score": (A numerical score from 1-100),
            "ipcUse": "Evaluation of how well they used IPC sections or legal acts.",
            "clarity": "Evaluation of their argument clarity and presentation style.",
            "suggestions": "3-4 actionable suggestions for improvement."
        }
        Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json|```/g, '').trim();

        // Basic cleanup
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        const evaluation = JSON.parse(responseText);

        session.evaluation = evaluation;
        session.status = 'completed';
        await session.save();

        await logAIUsage('Moot Court Simulator', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: evaluation
        });

    } catch (err) {
        await logAIUsage('Moot Court Simulator', req.user?.id || 'anonymous', startTime, false, err.message);
        console.error("Moot Court Evaluation Error:", err);
        res.status(500).json({ status: 'error', message: 'Failed to evaluate session: ' + err.message });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const history = await MootCourtSession.find({
            userId: req.user.id,
            status: 'completed'
        })
            .select('caseDetails.title role difficulty createdAt evaluation.score')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: history.length,
            data: history
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getSession = async (req, res) => {
    try {
        const session = await MootCourtSession.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!session) {
            return res.status(404).json({ status: 'fail', message: 'Session not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: session
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.analyzePerformance = async (req, res) => {
    const startTime = Date.now();
    try {
        const history = await MootCourtSession.find({
            userId: req.user.id,
            status: 'completed'
        })
            .sort({ createdAt: -1 })
            .limit(5);

        if (history.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'No completed trials found to analyze.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const historySummary = history.map(h => {
            return `Case: ${h.caseDetails.title}, Role: ${h.role}, Score: ${h.evaluation.score}/100\nFeedback: ${h.evaluation.suggestions}`;
        }).join('\n\n');

        const prompt = `Analyze the following trial history for a law student/lawyer and provide a comprehensive cross-session performance analysis and strategic improvement plan.
        
        Trial History:
        ${historySummary}

        Focus on:
        1. Recurring strengths in their legal arguments.
        2. Persistent weaknesses or logical gaps across different cases.
        3. Strategic advice on how to improve their cross-examination and IPC application.
        4. A personalized learning roadmap.

        Provide the analysis in a professional legal mentor tone.`;

        const result = await model.generateContent(prompt);
        const analysis = result.response.text();

        await logAIUsage('Moot Court Analytics', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: analysis
        });
    } catch (err) {
        await logAIUsage('Moot Court Analytics', req.user.id, startTime, false, err.message);
        res.status(500).json({ status: 'error', message: 'Failed to generate analysis: ' + err.message });
    }
};
