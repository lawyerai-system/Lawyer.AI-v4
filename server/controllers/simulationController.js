const { GoogleGenerativeAI } = require("@google/generative-ai");
const logAIUsage = require('../utils/aiLogger');

exports.simulateJudicialProcess = async (req, res) => {
    const startTime = Date.now();
    try {
        const { description, prosecutorArguments, defenseArguments, evidence, laws } = req.body;

        if (!description || !prosecutorArguments || !defenseArguments) {
            return res.status(400).json({ status: 'fail', message: 'Case description and arguments from both sides are required.' });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are an AI Supreme Court Judge of India. Your task is to perform a rigorous judicial simulation of a case.
        Be extremely professional, objective, and follow the standard structure of a high-court judgement.

        CASE DETAILS:
        Description: ${description}
        Relevant Laws/Sections: ${laws}
        Evidence Summary: ${evidence}

        ARGUMENTS PRESENTED:
        Prosecutor/Petitioner: ${prosecutorArguments}
        Defense/Respondent: ${defenseArguments}

        Please simulate the judicial reasoning process and return the result in EXACTLY this JSON format:
        {
            "issues": [
                { "id": 1, "issue": "The core legal question to be decided.", "description": "Context of this issue." }
            ],
            "legalAnalysis": [
                { "section": "e.g. IPC Section 302", "application": "How this section applies to the facts of the case." }
            ],
            "argumentEvaluation": {
                "prosecutor": { "strengths": ["..."], "weaknesses": ["..."] },
                "defense": { "strengths": ["..."], "weaknesses": ["..."] }
            },
            "simulatedJudgement": {
                "decision": "The final order (e.g. Guilty, Acquitted, Petition Dismissed)",
                "reasoning": "The detailed ratio decidendi (reason for the decision).",
                "directions": "Any specific directions or sentencing if applicable."
            }
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

        const simulationData = JSON.parse(responseText);

        // LOG SUCCESS
        await logAIUsage('AI Court Simulation', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: simulationData
        });

    } catch (err) {
        // LOG ERROR
        await logAIUsage('AI Court Simulation', req.user?.id || 'anonymous', startTime, false, err.message);

        console.error("Simulation Error:", err);
        res.status(500).json({ status: 'error', message: 'Judicial simulation failed: ' + err.message });
    }
};
