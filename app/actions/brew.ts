"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getBrewProTips(coffeeName: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a champion barista. Provide exactly 3 short, expert pro-tips (in Hebrew) for brewing this specific coffee variety: "${coffeeName}".
        Return them as a JSON array of strings: ["טיפ 1", "טיפ 2", "טיפ 3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const tips = JSON.parse(text.replace(/```json|```/g, "").trim());

        return { success: true, tips };
    } catch (error) {
        console.error("Brew tips error:", error);
        return { success: false, error: "Failed to fetch tips." };
    }
}
