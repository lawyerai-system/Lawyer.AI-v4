const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testFinal() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const m = "gemini-2.5-flash";
    try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("Hi");
        console.log(`${m}: SUCCESS`);
    } catch (e) {
        console.log(`${m}: FAILED - ${e.message}`);
    }
}
testFinal();
