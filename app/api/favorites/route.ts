import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { favoriteIds: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let newFavoriteIds = [...(user.favoriteIds || [])];
        const isFavorite = newFavoriteIds.includes(productId);

        if (isFavorite) {
            newFavoriteIds = newFavoriteIds.filter(id => id !== productId);
        } else {
            newFavoriteIds.push(productId);
        }

        await prisma.user.update({
            where: { id: userId },
            data: { favoriteIds: newFavoriteIds }
        });

        return NextResponse.json({
            success: true,
            isFavorite: !isFavorite,
            favoriteIds: newFavoriteIds
        });

    } catch (error) {
        console.error("Toggle favorite error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { favoriteIds: true }
        });

        return NextResponse.json({ favoriteIds: user?.favoriteIds || [] });

    } catch (error) {
        console.error("Get favorites error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
