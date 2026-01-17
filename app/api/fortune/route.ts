import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API Key is missing" }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Act as a mystical Coffee Fortune Teller. 
        Analyze this image of coffee cup dregs/foam/remains.
        
        1. Identify a shape, symbol, or pattern in the cup (even if abstract).
        2. Provide a humorous, positive, and inspiring "fortune reading" based on that shape for the user.
        3. Keep the tone magical, fun, and warm.
        4. Write the response in Hebrew (fluently).
        
        Output format (JSON):
        {
            "shape": "Brief description of the shape found (in Hebrew)",
            "fortune": "The full fortune reading (in Hebrew)"
        }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type || 'image/jpeg',
                },
            },
        ]);

        const responseText = result.response.text();

        // Cleanup JSON if needed
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response");

        const data = JSON.parse(jsonMatch[0]);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Fortune API Error:", error);
        return NextResponse.json({
            shape: "ענן מסתורי",
            fortune: "הערפל בקפה שלך מסתיר הפתעה גדולה שתגיע בקרוב. המתן בסבלנות, הדברים הטובים בדרך!"
        }, { status: 200 }); // Fallback with 200 OK so UI doesn't break
    }
}
