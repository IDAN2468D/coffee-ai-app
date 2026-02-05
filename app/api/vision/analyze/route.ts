
import { modelFlash } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { image, type } = await req.json(); // image is base64

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        let prompt = "";
        if (type === 'beans') {
            prompt = `
            Analyze the coffee image. You are a Senior Barista and Q-Grader expert.
            
            1. Identify basic info (Name, Roast, Brand).
            2. **Food Pairing:** Suggest 2 specific foods that pair perfectly with this coffee's flavor profile.
            3. **Health:** Estimate caffeine content (mg) and best time of day to drink.
            4. **Timer Data:** If it's beans, provide precise timing for each brewing step.

            Provide a strictly valid JSON response in the following format:
            {
                "type": "bean",
                "name": "string",
                "roast": "Light/Medium/Dark",
                "origin": "string",
                "flavorNotes": ["string", "string"],
                "foodPairing": ["string", "string"],
                "caffeineEstimate": "string (e.g. ~100mg)",
                "bestTimeOfDay": "Morning | Afternoon | Evening",
                "recipe": {
                    "method": "V60 | French Press | Espresso",
                    "ratio": "1:15",
                    "steps": [
                        { "time": "0:00-0:30", "action": "Bloom with 50g water" },
                        { "time": "0:30-2:00", "action": "Pour remaining water slowly" }
                    ]
                }
            }
            Return ONLY the valid JSON Report. No markdown or extra text.
            `;
        } else if (type === 'capsule') {
            prompt = `
            Analyze this coffee capsule image. You are a Senior Barista and Nespresso Expert.
            
            1. Identify basic info (Name, Brand, Intensity).
            2. **Food Pairing:** Suggest 2 specific foods that pair perfectly with this capsule's flavor profile.
            3. **Health:** Estimate caffeine content (mg) and best time of day to drink.
            4. Provide brew recommendations (Espresso/Lungo) and a short guide.

            Provide a strictly valid JSON response in the following format:
            {
                "type": "capsule",
                "name": "string",
                "brand": "string",
                "intensity": "number/12",
                "flavorNotes": ["string", "string"],
                "foodPairing": ["string", "string"],
                "caffeineEstimate": "string",
                "bestTimeOfDay": "Morning | Afternoon | Evening",
                "qualityScore": 90,
                "recommendations": [
                    { "type": "Espresso", "volume": "40ml" },
                    { "type": "Lungo", "volume": "110ml" }
                ],
                "guide": [
                    "Step 1...",
                    "Step 2..."
                ]
            }
            Return ONLY the valid JSON Report. No markdown or extra text.
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
