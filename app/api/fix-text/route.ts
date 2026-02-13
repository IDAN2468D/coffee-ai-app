import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ success: true, message: "Suppressed external extension error" }, { status: 200 });
}

export async function POST() {
    return NextResponse.json({ success: true }, { status: 200 });
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204 });
}

