import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { productId, rating, comment } = body;

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get User ID from email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId,
                rating,
                comment,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
