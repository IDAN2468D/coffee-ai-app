
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// Models
// Models - Using Flash for everything as requested for speed and efficiency
export const modelFlash = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// modelPro removed to save costs/complexity - Flash is multimodal enough for this app.


// Helper for chat
export async function chatWithBarista(history: any[], message: string) {
    try {
        const chat = modelFlash.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        if (error.message?.includes('429') || error.status === 429) {
            console.warn("⚠️ Gemini quota exceeded (Chat). Returning fallback.");
            return "מצטער, הראש שלי קצת מסתובב מרוב קפאין (עומס על המערכת). אפשר לנסות שוב עוד דקה? ☕";
        }
        console.error("Gemini Chat Error:", error);
        throw error; // Rethrow other errors
    }
}

// Helper for vision (Bean Rater)
export async function analyzeImage(base64Image: string, prompt: string) {
    try {
        // Remove header if present (data:image/jpeg;base64,)
        const imagePart = {
            inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: "image/jpeg",
            },
        };

        const result = await modelFlash.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        if (error.message?.includes('429') || error.status === 429) {
            console.warn("⚠️ Gemini quota exceeded (Vision). Returning fallback.");
            return JSON.stringify({
                roastLevel: "Unknown",
                qualityScore: 0,
                tastingNotes: ["System Overload"],
                advice: "המערכת בעומס כרגע. נסה שוב מאוחר יותר."
            });
        }
        console.error("Gemini Vision Error:", error);
        throw error;
    }
}
