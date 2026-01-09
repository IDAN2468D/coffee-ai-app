import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                suggestion: prompt + " with beautiful latte art and perfect lighting"
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const enhancementPrompt = `You are an expert coffee art photographer and barista. Take this coffee description and enhance it to create a better, more detailed prompt for AI image generation. Make it vivid, specific, and appealing. Keep it under 100 words.

Original description: "${prompt}"

Enhanced prompt (in English):`;

        const result = await model.generateContent(enhancementPrompt);
        const suggestion = result.response.text();

        return NextResponse.json({ suggestion });

    } catch (error) {
        console.error("AI Enhancement error:", error);
        try {
            const { prompt } = await req.json();
            return NextResponse.json({
                suggestion: prompt + " - beautifully composed, professional coffee photography, high resolution, perfect lighting"
            });
        } catch {
            return NextResponse.json({
                suggestion: "Beautiful coffee with professional photography and perfect lighting"
            });
        }
    }
}
