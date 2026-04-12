const { GoogleGenerativeAI } = require("@google/generative-ai");
const logAIUsage = require('../utils/aiLogger');

exports.generateStrategy = async (req, res) => {
    const startTime = Date.now();
    try {
        const { scenario } = req.body;

        if (!scenario || scenario.trim().length < 10) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a more detailed case scenario.'
            });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are a highly experienced Indian legal strategist. Analyze the following case scenario and provide a comprehensive legal strategy.
        
        Case Scenario:
        "${scenario}"

        Provide the analysis in the following JSON format:
        {
            "caseOverview": "A brief summary of the legal core of the case.",
            "relevantLaws": [
                { "section": "IPC Section or Act Name", "description": "Why it applies to this scenario" }
            ],
            "legalStrategies": [
                { "title": "Strategy Name", "approach": "Step-by-step approach or defense line" }
            ],
            "keyArguments": [
                { "point": "The main argument point", "rationale": "Legal reasoning behind it" }
            ],
            "precedentCases": [
                { "caseName": "Name of the landmark case", "relevance": "How it helps in this specific scenario" }
            ]
        }

        Important: Ensure the legal sections and acts are accurate to Indian Law.
        Return ONLY valid JSON.`;

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
        await logAIUsage('Strategy Generator', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: analysis
        });

    } catch (err) {
        // LOG ERROR
        await logAIUsage('Strategy Generator', req.user?.id || 'anonymous', startTime, false, err.message);

        console.error("Strategy Generation Error:", err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate legal strategy: ' + err.message
        });
    }
};
