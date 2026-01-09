import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function GET() {
    try {
        const testEmail = process.env.EMAIL_USER;
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: "RESEND_API_KEY is missing in .env"
            }, { status: 400 });
        }

        if (!testEmail) {
            return NextResponse.json({
                success: false,
                error: "EMAIL_USER is missing in .env"
            }, { status: 400 });
        }

        console.log(`Triggering test email to: ${testEmail}`);

        const result = await sendWelcomeEmail(testEmail, "בודק יקר");

        if (!result) {
            return NextResponse.json({
                success: false,
                error: "The mailer returned null. Check terminal for 'Resend API error' or 'Fatal error'."
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Success! Resend has accepted the email task.",
            result: result
        });
    } catch (error: any) {
        console.error("Test route crash:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
