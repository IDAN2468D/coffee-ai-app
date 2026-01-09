import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Simulating password reset token generation
        const token = crypto.randomBytes(32).toString('hex');

        console.log(`Password reset requested for ${email}. Link: http://localhost:3000/reset-password?token=${token}`);

        return NextResponse.json({ message: "Password reset link sent to your email (check console context)" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
