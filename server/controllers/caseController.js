const { GoogleGenerativeAI } = require("@google/generative-ai");
const Case = require("../models/Case");

// Helper to get AI insights for a case
const getAIInsights = async (caseData) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `You are a legal expert analyzer. I have a legal case with the following details:
        Title: ${caseData.title}
        Court: ${caseData.court}
        Legal Topic: ${caseData.legalTopic}
        IPC Sections: ${caseData.ipcSections.join(', ')}
        Raw Summary: ${caseData.summary}
        Judgement: ${caseData.judgementOutcome}
        Legal Impact: ${caseData.impact}

        Please provide professional legal insights in ONLY this JSON format:
        {
            "aiSummary": "A concise, professional 2-3 sentence summary for quick reading.",
            "importantPrinciples": ["Principle 1", "Principle 2", "Principle 3"],
            "suggestedReferences": ["Case Name 1 (Year)", "Case Name 2 (Year)"],
            "tags": ["tag1", "tag2", "tag3"]
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

        return JSON.parse(responseText);
    } catch (err) {
        console.error("AI Insights Error:", err);
        return {
            aiSummary: "AI summary generation failed.",
            importantPrinciples: [],
            suggestedReferences: [],
            tags: []
        };
    }
};

exports.createCase = async (req, res) => {
    try {
        const { title, year, court, legalTopic, ipcSections, summary, judgementOutcome, keyArguments, tags, impact, source } = req.body;
        const userId = req.user.id;

        // Get AI insights
        const aiInsights = await getAIInsights({ title, court, legalTopic, ipcSections, summary, judgementOutcome, impact });

        const newCase = await Case.create({
            title,
            year,
            court,
            legalTopic,
            ipcSections,
            summary,
            judgementOutcome,
            keyArguments,
            impact,
            source,
            uploader: userId,
            tags: [...new Set([...(tags || []), ...(aiInsights.tags || [])])], // Merge user and AI tags
            aiSummary: aiInsights.aiSummary,
            importantPrinciples: aiInsights.importantPrinciples,
            suggestedReferences: aiInsights.suggestedReferences,
            status: req.user.role === 'admin' ? 'APPROVED' : 'PENDING'
        });

        res.status(201).json({
            status: 'success',
            data: newCase
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getAllCases = async (req, res) => {
    try {
        const { search, topic, court, year } = req.query;
        let query = {};

        if (search) {
            query.$text = { $search: search };
        }
        if (topic) query.legalTopic = topic;
        if (court) query.court = court;
        if (year) query.year = year;

        // Status filtering: Only show APPROVED cases to public. 
        // Admin sees all. Uploader sees their PENDING cases.
        if (req.user.role !== 'admin') {
            query.$or = [
                { status: 'APPROVED' },
                { uploader: req.user.id }
            ];
        }

        const cases = await Case.find(query)
            .sort({ createdAt: -1 })
            .populate('uploader', 'name profilePicture');

        res.status(200).json({
            status: 'success',
            results: cases.length,
            data: cases
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getCase = async (req, res) => {
    try {
        const caseEntry = await Case.findById(req.params.id)
            .populate('uploader', 'name profilePicture role')
            .populate('comments.user', 'name profilePicture role');

        if (!caseEntry) {
            return res.status(404).json({ status: 'fail', message: 'Case not found' });
        }

        res.status(200).json({
            status: 'success',
            data: caseEntry
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.toggleStar = async (req, res) => {
    try {
        const caseEntry = await Case.findById(req.params.id);
        if (!caseEntry) return res.status(404).json({ status: 'fail', message: 'Case not found' });

        const userId = req.user.id;
        const index = caseEntry.stars.indexOf(userId);

        if (index === -1) {
            caseEntry.stars.push(userId);
        } else {
            caseEntry.stars.splice(index, 1);
        }

        await caseEntry.save();
        res.status(200).json({ status: 'success', data: caseEntry.stars });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ status: 'fail', message: 'Comment content is required' });

        const caseEntry = await Case.findById(req.params.id);
        if (!caseEntry) return res.status(404).json({ status: 'fail', message: 'Case not found' });

        caseEntry.comments.push({
            user: req.user.id,
            content
        });

        await caseEntry.save();

        // Return the newly added comment (last one) populated
        const updatedCase = await Case.findById(req.params.id).populate('comments.user', 'name profilePicture role');
        const newComment = updatedCase.comments[updatedCase.comments.length - 1];

        res.status(201).json({
            status: 'success',
            data: newComment
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
