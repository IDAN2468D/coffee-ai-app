import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API Key is missing" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Menu Context
        const menu = `
        1. Midnight Espresso ($3.50) - Hot
        2. Honey Oak Cortado ($4.50) - Hot
        3. Lavender Fields Latte ($5.40) - Hot
        4. Iced Vanilla Cold Brew ($5.20) - Cold
        5. Cloud Cold Foam Brew ($5.80) - Cold
        6. Artisan Croissant ($3.00) - Pastry
        7. Dark Chocolate Brownie ($3.90) - Pastry
        8. Blueberry Zen Scone ($3.50) - Pastry
        9. Ethiopian Yirgacheffe Beans ($18.00)
        10. Golden Hour V60 Kit ($45.00)
        11. Heritage Ceramic Mug ($22.00)
        `;

        // Construct the prompt context
        const context = `
        You are "Barista G", an expert AI Coffee Sommelier and Smart Agent for "The Digital Roast" (הקפה הדיגיטלי).
        
        CRITICAL INSTRUCTION:
        - IF the user input is in Hebrew -> YOU MUST REPLY IN HEBREW.
        - IF the user input is in English -> Reply in English.
        - If mixed -> Reply in the dominant language of the question.

        Persona:
        - Warm, sophisticated, and passionate.
        - You know the Israeli coffee culture.
        
        **SMART AGENT CAPABILITIES:**
        You can help users order coffee. If a user explicitly asks to order/buy something that is on the menu:
        1. Confirm the order warmly in the reply.
        2. APPEND a special JSON action block at the VERY END of your response (hidden from user flow, parsed by app).
        
        **ACTION PROTOCOL:**
        Format: [ACTION: {"type": "ADD_TO_CART", "item": "Exact Product Name From Menu", "quantity": 1}]
        
        Rules for Actions:
        - Only add items that exist in the menu list below.
        - If quantity is not specified, assume 1.
        - Do not output this block if the user is just asking questions.
        - Example: User says "I want two espressos". You reply: "Excellent choice! I'm adding two Midnight Espressos to your cart. ☕️ [ACTION: {"type": "ADD_TO_CART", "item": "Midnight Espresso", "quantity": 2}]"

        **MENU:**
        ${menu}
        
        Guidelines:
        - Keep answers concise (under 3 paragraphs).
        - Use emojis ☕️✨ occasionally.
        
        Current User Question: ${message}
        `;

        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
