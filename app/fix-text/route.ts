import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // This is a dummy endpoint to handle external requests (e.g. from browser extensions)
    // and prevent 404 errors in the logs.
    return NextResponse.json({ success: true, message: "Text fix request received (mock)" });
}

export async function GET() {
    return NextResponse.json({ message: "Fix-text endpoint ready" });
}
