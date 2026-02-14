'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// In-memory cache (Server Action scope - global per instance)
let cachedFact: { fact: string; icon: string } | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

const FALLBACK_FACTS = [
    { fact: "הידעת? קפה הוא המשקה השני הנפוץ ביותר בעולם אחרי מים.", icon: "🌍" },
    { fact: "הידעת? פינלנד היא צרכנית הקפה הגדולה בעולם לנפש.", icon: "🇫🇮" },
    { fact: "הידעת? חתולים ששתו קפה חיו יותר לפי ספר השיאים של גינס (סתם, זה לא באמת, אבל יש סיפור על חתול כזה!).", icon: "🐈" },
    { fact: "הידעת? בטהובן היה סופר בדיוק 60 פולים לכל כוס קפה שהכין.", icon: "🎼" },
    { fact: "הידעת? המילה 'אספרסו' באיטלקית משמעותה 'שהוצא החוצה בכוח'.", icon: "☕" },
    { fact: "הידעת? קפה נאסר לשתייה במכה בשנת 1511 כי האמינו שהוא מעודד מחשבה רדיקלית.", icon: "🚫" },
];

export async function getDailyFact(): Promise<{ success: boolean; data?: { fact: string; icon: string }; error?: string }> {
    // Return cached fact if valid
    if (cachedFact && (Date.now() - lastFetchTime < CACHE_DURATION)) {
        return { success: true, data: cachedFact };
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("No API Key");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = "Generate a single, short, surprising, and interesting fact about coffee in Hebrew. Keep it one sentence. Return JSON: { \"fact\": \"...\", \"icon\": \"emoji\" }";

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response");

        const data = JSON.parse(jsonMatch[0]);

        // Validate data structure
        if (!data.fact || !data.icon) {
            throw new Error("Invalid response format from AI");
        }

        // Update cache
        cachedFact = data;
        lastFetchTime = Date.now();

        return { success: true, data };
    } catch (error) {
        console.error("Daily Fact Error (Using Fallback):", error instanceof Error ? error.message : error);

        // Pick a random fallback
        const randomFact = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];

        // Cache the fallback for 1 hour to prevent retry loops on 429 or errors
        cachedFact = randomFact;
        lastFetchTime = Date.now() - (CACHE_DURATION - 1000 * 60 * 60); // Set time so it expires in 1 hour

        return { success: true, data: randomFact };
    }
}
