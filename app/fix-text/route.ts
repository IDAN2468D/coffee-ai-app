import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
    return NextResponse.json({ success: true, message: "Suppressed external extension error" }, { status: 200, headers });
}

export async function POST() {
    return NextResponse.json({ success: true }, { status: 200, headers });
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers });
}
