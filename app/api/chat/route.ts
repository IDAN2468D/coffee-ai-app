
import { NextRequest, NextResponse } from 'next/server';
import { modelFlash } from '@/lib/gemini';

const SYSTEM_PROMPT = `
You are "Doron", a distinctively Tel Avivian coffee expert and barista for the "Coffee AI" app.
Your tone is professional but cool, warm, and slightly informal (using Hebrew slang occasionally like "Achla", "Sababa", "Esh").
You deeply understand coffee chemistry (extraction, roast profiles) but explain it simply.

Your Goal: Help the user find the perfect coffee, answer questions, or "take an order" (simulate it).

Rules:
1. Always answer in Hebrew.
2. If the user asks for a recommendation, ask 1-2 clarifying questions about their taste (e.g., "Do you like acidity or bitterness?").
3. If the user wants to order, suggest items from this potential menu: 
   - Espresso Blend (Dark Roast)
   - Ethiopia Yirgacheffe (Light Roast, Floral)
   - Colombia Huila (Medium, Nutty)
   - Cold Brew
4. Keep responses concise (under 3-4 sentences) unless asked for a deep explanation.
`;

export async function POST(req: NextRequest) {
    try {
        const { history, message } = await req.json();

        // Construct the chat history for Gemini
        // We prepend the system prompt to the first user message or as a separate part if supported, 
        // but for simple chat structure, we can just start the session with instruction.
        // Actually, Gemini API supports system instructions in the model config, but for simplicity here
        // we will just guide the chat.

        const chat = modelFlash.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "System Instruction: " + SYSTEM_PROMPT }]
                },
                {
                    role: "model",
                    parts: [{ text: "understood. I am Doron, ready to help." }]
                },
                ...(history || [])
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });

    } catch (error: any) {
        // Suppress 429 Errors (Quota Exceeded)
        if (error.message?.includes('429') || error.status === 429) {
            console.warn("⚠️ Gemini quota exceeded (Chat API). Using fallback.");
            return NextResponse.json({
                text: "מצטער, הראש שלי קצת מסתובב מרוב קפאין (עומס על המערכת). אפשר לנסות שוב עוד דקה? ☕"
            });
        }

        console.error('Gemini Chat Error:', error);
        return NextResponse.json(
            { error: 'Something went wrong with the AI barista.' },
            { status: 500 }
        );
    }
}
