import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                fact: "הידעת? קפה הוא המשקה השני הנפוץ ביותר בעולם אחרי מים.",
                icon: "🌍"
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Generate a single, short, surprising, and interesting fact about coffee in Hebrew. Keep it one sentence. Return JSON: { \"fact\": \"...\", \"icon\": \"emoji\" }";

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response");

        const data = JSON.parse(jsonMatch[0]);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Daily Fact Error:", error);
        return NextResponse.json({
            fact: "הידעת? פינלנד היא צרכנית הקפה הגדולה בעולם לנפש.",
            icon: "🇫🇮"
        });
    }
}
