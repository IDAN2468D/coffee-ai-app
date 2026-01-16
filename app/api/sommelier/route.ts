
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRODUCTS } from '@/lib/products';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { answers, freeText } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            // Fallback if no API key
            const fallbackProduct = PRODUCTS[0];
            return NextResponse.json({
                product: fallbackProduct,
                explanation: "ה-AI במנוחה כרגע, אבל האספרסו הזה תמיד בחירה מצוינת."
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert AI Coffee Sommelier based in a boutique coffee shop.
        
        Our Menu (JSON):
        ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, description: p.description, category: p.category })))}

        User Preferences:
        - Vibe/Energy: ${answers.vibe || 'Not specified'}
        - Temperature: ${answers.temperature || 'Not specified'}
        - Flavor Profile: ${answers.flavor || 'Not specified'}
        - Additional Notes: ${freeText || 'None'}

        Task:
        1. Select the SINGLE best matching product from our menu for this user.
        2. Write a short, personalized, and charming explanation (in Hebrew) telling the user why this specific coffee fits their current mood and taste.
        3. Be creative but accurate.

        Output must be valid JSON only:
        {
            "productId": "id_of_product",
            "explanation": "Your explanation in Hebrew here"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean the response to ensure it's valid JSON (sometimes models add markdown backticks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse AI response");
        }

        const parsedResult = JSON.parse(jsonMatch[0]);
        const selectedProduct = PRODUCTS.find(p => p.id === parsedResult.productId) || PRODUCTS[0];

        return NextResponse.json({
            product: selectedProduct,
            explanation: parsedResult.explanation
        });

    } catch (error) {
        console.error("AI Sommelier error:", error);
        return NextResponse.json({
            product: PRODUCTS[0],
            explanation: "הייתה לנו תקלה קטנה בתקשורת עם הבריסטה הדיגיטלי, אבל הנה המלצה קלאסית."
        }, { status: 500 });
    }
}
