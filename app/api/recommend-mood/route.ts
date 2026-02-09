import { NextResponse } from 'next/server';
import { modelFlash } from '@/lib/gemini';
import { PRODUCTS } from '@/lib/products';

export async function POST(req: Request) {
    try {
        const { mood } = await req.json();

        if (!mood) {
            return NextResponse.json({ error: 'No mood provided' }, { status: 400 });
        }

        // Simplify products for the prompt to save tokens
        const productsList = PRODUCTS.map(p => `ID ${p.id}: ${p.name} (${p.description}) [${p.category}]`).join('\n');

        const prompt = `
        You are a Barista AI. The user feels: "${mood}".
        
        Available coffees:
        ${productsList}
        
        Task:
        1. Select the SINGLE BEST matching coffee for this mood from the list.
        2. Explain WHY in a warm, "Cyber Barista" tone (Hebrew).
        
        Output JSON:
        {
            "productId": "id_of_product",
            "reason": "Short explanation in Hebrew"
        }
        Return ONLY raw JSON, no markdown formatting.
        `;

        const result = await modelFlash.generateContent(prompt);
        const responseText = await result.response.text();

        // Cleanup JSON
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const recommendation = JSON.parse(jsonStr);

        // Find full product details
        const product = PRODUCTS.find(p => p.id === recommendation.productId);

        if (!product) {
            return NextResponse.json({ error: 'AI recommended invalid product ID: ' + recommendation.productId }, { status: 500 });
        }

        return NextResponse.json({
            product,
            reason: recommendation.reason
        });

    } catch (error) {
        console.error('Mood API Error:', error);
        // Fallback
        const fallback = PRODUCTS[0];
        return NextResponse.json({
            product: fallback,
            reason: "ה-AI במנוחה, אבל אספרסו טוב תמיד מתאים לכל מצב רוח!"
        });
    }
}
