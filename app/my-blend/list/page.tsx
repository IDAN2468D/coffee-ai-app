import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import MyBlendListClient from './MyBlendListClient';

export default async function MyBlendListPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/passport'); // או דף התחברות אחר
    }

    // חיפוש המשתמש כדי לקבל את ה-ID שלו
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (!user) {
        redirect('/passport');
    }

    const blends = await prisma.blend.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    });

    // המרה לאובייקט רגיל כדי למנוע בעיות סריאליזציה עם תאריכים
    const serializedBlends = blends.map(blend => ({
        ...blend,
        id: blend.id.toString(),
        userId: blend.userId.toString(),
        createdAt: blend.createdAt.toISOString(),
    }));

    return <MyBlendListClient initialBlends={serializedBlends} />;
}
