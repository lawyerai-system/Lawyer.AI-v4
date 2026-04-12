const { GoogleGenerativeAI } = require("@google/generative-ai");
const Case = require("../models/Case");
const logAIUsage = require('../utils/aiLogger');

exports.predictOutcome = async (req, res) => {
    const startTime = Date.now();
    try {
        const { caseType, description, evidence, ipcSections, jurisdiction } = req.body;

        if (!caseType || !description) {
            return res.status(400).json({ status: 'fail', message: 'Case type and description are required.' });
        }

        // 1. Fetch potentially similar cases from the Case Library (simple keyword/topic match for context)
        const searchTerms = description.split(' ').slice(0, 3)
            .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex characters
            .join('|');

        const similarCases = await Case.find({
            $or: [
                { legalTopic: caseType },
                { title: { $regex: searchTerms, $options: 'i' } }
            ]
        }).limit(3).select('title year summary judgementOutcome aiSummary');

        const contextCases = similarCases.map(c => `
            Case: ${c.title} (${c.year})
            Summary: ${c.aiSummary || c.summary}
            Outcome: ${c.judgementOutcome}
        `).join('\n---\n');

        // 2. Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are a high-level Legal Outcome Predictor AI for the Indian Judicial System.
        Your goal is to estimate the possible outcome of a case based on given details and similar past judgments.

        USER CASE DETAILS:
        Type: ${caseType}
        Jurisdiction: ${jurisdiction}
        Description: ${description}
        Evidence: ${evidence}
        IPC Sections: ${ipcSections}

        SIMILAR REFERENCE CASES FROM OUR LIBRARY:
        ${contextCases || "No specific direct matches found in local library, rely on your broad legal training."}

        Please perform a deep legal reasoning analysis and return the result in EXACTLY this JSON format:
        {
            "prediction": "Main predicted outcome (e.g. Likely Acquittal, Conviction, Settlement)",
            "probability": (Number between 0 and 100 representing confidence),
            "reasoning": "Detailed legal reasoning behind this prediction.",
            "possibleOutcomes": [
                { "scenario": "Scenario name", "likelihood": "Percentage string", "description": "Brief description" }
            ],
            "legalConsequences": ["Consequence 1", "Consequence 2"],
            "suggestedPastCases": [
                { "title": "Case Name", "relevance": "Why it is relevant to this specific case" }
            ],
            "disclaimer": "Standard legal AI disclaimer."
        }
        Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json|```/g, '').trim();

        // Cleanup JSON
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        const predictionData = JSON.parse(responseText);

        // LOG SUCCESS
        await logAIUsage('Case Outcome Predictor', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: predictionData
        });

    } catch (err) {
        // LOG ERROR
        await logAIUsage('Case Outcome Predictor', req.user?.id || 'anonymous', startTime, false, err.message);

        console.error("Prediction Error:", err);
        res.status(500).json({ status: 'error', message: 'Failed to generate prediction: ' + err.message });
    }
};
