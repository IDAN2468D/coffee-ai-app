import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { transcript } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API Key is missing" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

        // Fetch real products from DB
        const products = await prisma.product.findMany({
            select: { id: true, name: true, price: true, image: true }
        });

        // Create a lookup map for the prompt context
        const productsJSON = JSON.stringify(products);

        const prompt = `
        You are a smart Voice Order Agent for a coffee shop.
        
        Your Goal: Extract user intent from the voice transcript and map it to products in the database.
        
        Available Products (JSON):
        ${productsJSON}
        
        User Transcript: "${transcript}"
        
        Instructions:
        1. Identify if the user wants to buy/order something.
        2. Match vague terms to the closest Product ID.
        3. Extract quantity (default 1).
        4. If the user wants to buy, YOU MUST RETURN the full product details object nested in the response.
        
        Output JSON Format:
        {
            "items": [
                { 
                    "quantity": number,
                    "productDetails": {
                         "id": "...",
                         "name": "...",
                         "price": 0,
                         "image": "..."
                    }
                }
            ],
            "response": "Text to speak back to user (In Hebrew)"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json(JSON.parse(responseText));

    } catch (error) {
        console.error("Voice Agent API Error:", error);
        return NextResponse.json({ error: "Failed to process voice command" }, { status: 500 });
    }
}
