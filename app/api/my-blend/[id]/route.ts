import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const blendId = params.id;

        // וידוא שהבלנד שייך למשתמש הנוכחי לפני המחיקה
        // קודם משיגים את ה-ID של המשתמש
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // בדיקה שהבלנד קיים ושייך למשתמש
        const blend = await prisma.blend.findUnique({
            where: { id: blendId },
        });

        if (!blend) {
            return NextResponse.json({ error: 'Blend not found' }, { status: 404 });
        }

        if (blend.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // ביצוע המחיקה
        await prisma.blend.delete({
            where: { id: blendId },
        });

        return NextResponse.json({ message: 'Blend deleted successfully' });

    } catch (error) {
        console.error('Error deleting blend:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
