import { NextResponse } from 'next/server';
import { sendAIImageEmail } from '@/lib/mailer';

export async function POST(req: Request) {
    try {
        const { imageUrl, prompt, email } = await req.json();

        if (!email || !imageUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await sendAIImageEmail(email, imageUrl, prompt);

        return NextResponse.json({ success: true, message: "התמונה נשלחה בהצלחה!" });

    } catch (error) {
        console.error("Send image email error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
