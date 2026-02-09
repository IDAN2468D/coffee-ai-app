import { NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        // Check if image is valid (basic check)
        if (base64Image.length < 100) {
            return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
        }

        const prompt = `
        Act as a mystical Coffee Fortune Teller. 
        Analyze the shapes, bubbles, and patterns in this coffee cup image (or coffee grounds).
        
        Provide a response in JSON format with the following fields:
        1. "symbol": What shape do you see? (e.g., "A flying dragon", "A heart", "A cloud").
        2. "prediction": A short, mystical, and humorous prediction for the user's day based on that symbol.
        3. "luckyNumber": A lucky number between 1-100.
        
        Keep the tone fun, slightly esoteric, and encouraging. 
        Write the response in Hebrew (fluently and naturally).
        Return ONLY raw JSON, no markdown formatting.
        `;

        try {
            const responseText = await analyzeImage(`data:${file.type};base64,${base64Image}`, prompt);

            // Clean up markdown if Gemini returns it
            const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonStr);

            return NextResponse.json(data);
        } catch (aiError) {
            console.error("AI Error:", aiError);
            throw new Error("Failed to analyze image");
        }

    } catch (error) {
        console.error("Fortune API Error:", error);
        // Fallback mock response for demo/error cases
        return NextResponse.json({
            symbol: "ערפל מסתורי",
            prediction: "הערפל בקפה שלך מסתיר הפתעה גדולה שתגיע בקרוב. המתן בסבלנות, הדברים הטובים בדרך!",
            luckyNumber: 42
        });
    }
}
