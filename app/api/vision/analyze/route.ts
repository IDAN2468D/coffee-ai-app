
import { NextRequest, NextResponse } from 'next/server';
import { modelFlash } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { image, type } = await req.json(); // image is base64

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        let prompt = "";
        if (type === 'beans') {
            prompt = `
            Analyze this image of coffee beans. You are a Q-Grader expert.
            Provide a short JSON report:
            {
                "roastLevel": "Light/Medium/Dark",
                "qualityScore": 85 (0-100),
                "defects": ["broken beans", "quakers", etc or "none"],
                "tastingNotes": "predicted notes based on color/texture",
                "advice": "brewing or buying advice in 1 sentence (Hebrew)"
            }
            Return ONLY the valid JSON Report. No markdown.
            `;
        } else if (type === 'pastry') {
            prompt = `
            Analyze this pastry/food item in a coffee shop setting.
            Provide a short JSON report:
            {
                "name": "Croissant/Muffin/etc",
                "calories": "approximate",
                "pairing": "Best coffee pairing (Hebrew)",
                "price_estimate": "20-30 ILS"
            }
            Return ONLY the valid JSON Report. No markdown.
            `;
        }

        // Prepare image part
        const imagePart = {
            inlineData: {
                data: image.split(',')[1] || image,
                mimeType: "image/jpeg"
            }
        };

        const result = await modelFlash.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();

        // Clean markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch (e) {
            console.error("Failed to parse JSON", text);
            return NextResponse.json({ error: "Analysis failed to produce report", raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('Vision Analysis Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze image' },
            { status: 500 }
        );
    }
}
