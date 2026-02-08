import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { imageId } = await req.json();
        if (!imageId) {
            return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                coffeeImageId_userId: {
                    coffeeImageId: imageId,
                    userId: user.id
                }
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        } else {
            await prisma.like.create({
                data: {
                    coffeeImageId: imageId,
                    userId: user.id
                }
            });
            return NextResponse.json({ liked: true });
        }

    } catch (error) {
        console.error('Like error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
