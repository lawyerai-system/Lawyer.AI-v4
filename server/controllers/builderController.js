const { GoogleGenerativeAI } = require("@google/generative-ai");
const logAIUsage = require('../utils/aiLogger');

exports.buildCase = async (req, res) => {
    const startTime = Date.now();
    try {
        const { description } = req.body;

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a more detailed description of your legal problem.'
            });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are a high-level Indian legal consultant. Analyze the legal problem described by the user and convert it into a structured legal case analysis.
        
        System Context:
        This is an tool for "AI Case Builder" on the Lawyer.AI platform.
        
        User Problem Description:
        "${description}"

        Provide the analysis in the following JSON format:
        {
            "legalArea": "High-level legal domain (e.g., Contract Law, Property Law, Criminal Law)",
            "legalIssues": ["Issue 1", "Issue 2", "..."],
            "relevantLaws": [
                { "statute": "Name of Act/Section", "relevance": "Concise explanation of why it applies" }
            ],
            "legalSteps": ["Step 1: Action item", "Step 2: Action item", "..."],
            "recommendedEvidence": ["Evidence Item 1", "Evidence Item 2", "..."]
        }

        Important Guidelines:
        1. Ensure the laws and sections are accurate to the Indian Legal System.
        2. Keep the analysis structured and professional.
        3. Do NOT provide specific legal advice, act as an informational tool.
        4. Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json|```/g, '').trim();

        // Basic cleanup if Gemini adds prose around JSON
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        const analysis = JSON.parse(responseText);

        // LOG SUCCESS
        await logAIUsage('Case Builder', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: analysis
        });

    } catch (err) {
        // LOG ERROR
        await logAIUsage('Case Builder', req.user?.id || 'anonymous', startTime, false, err.message);

        console.error("Case Builder Error:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to build case analysis: ' + err.message
        });
    }
};
