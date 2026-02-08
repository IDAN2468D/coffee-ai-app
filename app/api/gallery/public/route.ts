import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const images = await prisma.coffeeImage.findMany({
            where: { isPublic: true },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json(images);
    } catch (error) {
        console.error("Public gallery fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch public gallery" }, { status: 500 });
    }
}
