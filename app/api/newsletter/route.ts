import { NextResponse } from 'next/server';
import { sendNewsletterEmail } from '@/lib/mailer';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "אנא הזן כתובת מייל תקינה" }, { status: 400 });
        }

        // Send newsletter welcome email
        await sendNewsletterEmail(email);

        return NextResponse.json({
            success: true,
            message: "תודה! נרשמת בהצלחה לניוזלטר. בדוק את המייל שלך 📬"
        });

    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json({ error: "שגיאה בהרשמה, אנא נסה שוב" }, { status: 500 });
    }
}
