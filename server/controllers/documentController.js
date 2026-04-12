const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require('pdf-parse');
const fs = require('fs');
const logAIUsage = require('../utils/aiLogger');

exports.analyzeDocument = async (req, res) => {
    const startTime = Date.now();
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        let extractedText = '';

        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            try {
                // The version of pdf-parse installed (Mehmet Kozan's) uses this API
                const doc = new pdf.PDFParse({ data: new Uint8Array(dataBuffer) });
                await doc.load();
                const result = await doc.getText();
                // Ensure we get a string from whatever the library returns
                extractedText = typeof result === 'string' ? result : (result?.text || '');
            } catch (pdfErr) {
                console.error("PDF Parsing Error:", pdfErr);
                throw new Error("Could not extract text from this PDF. It might be scanned or protected.");
            }
        } else if (req.file.mimetype === 'text/plain') {
            extractedText = fs.readFileSync(filePath, 'utf8');
        } else {
            return res.status(400).json({ status: 'fail', message: 'Unsupported file type. Please upload PDF or TXT.' });
        }

        // Ensure extractedText is a string before calling trim
        const finalContent = String(extractedText || "");

        if (!finalContent.trim()) {
            return res.status(400).json({ status: 'fail', message: 'The uploaded document appears to be empty or unreadable.' });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `You are a legal document analyzer. Analyze the following legal document text and provide a structured JSON response.
        The document could be an FIR, a legal notice, a contract, or an agreement.
        
        Provide the analysis in the following JSON format:
        {
            "docType": "Type of document (e.g., FIR, Lease Agreement, Legal Notice)",
            "simplifiedExplanation": "A 3-4 sentence explanation of the document in plain, simple language for a non-lawyer.",
            "importantClauses": [
                { "title": "Clause Name", "description": "Short explanation of why it matters" }
            ],
            "legalRisks": [
                { "risk": "Description of the risk", "severity": "High/Medium/Low" }
            ],
            "relevantSections": [
                { "section": "IPC Section or Law Reference", "reason": "Why it applies" }
            ]
        }

        If the document is too short or doesn't seem to be a legal document, still try to analyze it or return an error-like structure but as valid JSON.

        Document Text:
        ${finalContent.substring(0, 8000)} // Limiting to stay within token limits for flash

        Return ONLY valid JSON.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        // Basic cleanup if Gemini adds markdown blocks
        if (responseText.includes('```')) {
            responseText = responseText.replace(/```json|```/g, '').trim();
        }

        // Locate JSON if there's surrounding text
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        let analysis;
        try {
            analysis = JSON.parse(responseText);
        } catch (parseErr) {
            console.error("JSON Parse Error:", parseErr, "Response was:", responseText);
            throw new Error("Failed to process the AI analysis. Please try again.");
        }

        // Cleanup: remove temporary file
        fs.unlinkSync(filePath);

        // LOG SUCCESS
        await logAIUsage('Document Analyzer', req.user.id, startTime, true);

        res.status(200).json({
            status: 'success',
            data: analysis
        });

    } catch (err) {
        // LOG ERROR
        await logAIUsage('Document Analyzer', req.user?.id || 'anonymous', startTime, false, err.message);

        console.error("Document Analysis Error:", err);
        // Cleanup on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ status: 'error', message: 'Failed to analyze document: ' + err.message });
    }
};
