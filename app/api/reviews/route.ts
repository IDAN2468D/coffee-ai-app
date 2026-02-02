import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const sort = searchParams.get('sort') || 'newest';

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: 'desc' };

        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'highest':
                orderBy = { rating: 'desc' };
                break;
            case 'lowest':
                orderBy = { rating: 'asc' };
                break;
        }

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
            orderBy,
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
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

        // Check if user has purchased this product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId: productId,
                order: {
                    userId: user.id,
                    status: 'completed',
                },
            },
        });

        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId,
                rating: Number(rating),
                comment,
                isVerified: !!hasPurchased,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!reviewId) {
        return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        const isAdmin = user.isAdmin;

        if (review.userId !== user.id && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.review.delete({
            where: { id: reviewId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
