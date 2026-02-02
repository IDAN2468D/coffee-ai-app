import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { imageId, isPublic } = await req.json();

        if (!imageId) {
            return NextResponse.json({ error: "Image ID required" }, { status: 400 });
        }

        // Verify ownership
        const image = await prisma.coffeeImage.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        if (image.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.coffeeImage.update({
            where: { id: imageId },
            data: { isPublic },
        });

        return NextResponse.json({ success: true, image: updated });

    } catch (error) {
        console.error("Toggle privacy error:", error);
        return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
    }
}
