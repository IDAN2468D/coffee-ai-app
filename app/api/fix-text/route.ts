import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ success: true, message: "Suppressed external extension error" }, { status: 200 });
}

export async function POST() {
    return NextResponse.json({ success: true }, { status: 200 });
}
