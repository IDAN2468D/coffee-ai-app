import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const images = await prisma.coffeeImage.findMany({
            where: {
                isPublic: true
            },
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
            },
            take: 50
        });

        return NextResponse.json(images);
    } catch (error) {
        console.error("Fetch gallery images error:", error);
        return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }
}
