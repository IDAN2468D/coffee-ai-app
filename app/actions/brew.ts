"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { ServerActionResponse } from "@/src/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const BrewSchema = z.object({
    coffeeName: z.string().min(1).max(100),
});

export async function getBrewProTips(rawName: string): Promise<ServerActionResponse<string[]>> {
    try {
        const { coffeeName } = BrewSchema.parse({ coffeeName: rawName });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a champion barista. Provide exactly 3 short, expert pro-tips (in Hebrew) for brewing this specific coffee variety: "${coffeeName}".
        Return them as a JSON array of strings: ["טיפ 1", "טיפ 2", "טיפ 3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let tips: string[];
        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            tips = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
        } catch (e) {
            tips = ["הקפידו על טמפרטורת מים מדויקת", "השתמשו במים מסוננים", "טחנו את הפולים רגע לפני החליטה"];
        }

        return { success: true, data: tips };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "שם הקפה אינו תקין." };
        }
        console.error("Brew tips error:", error);
        return { success: false, error: "לא ניתן היה לטעון טיפים כרגע." };
    }
}
