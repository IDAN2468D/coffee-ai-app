import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // בדיקת אימות בסיסית
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, base, milk, flavor } = body;

        // וידוא שכל השדות קיימים
        if (!name || !base || !milk || !flavor) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // חילוץ ה-ID מהסשן בצורה בטוחה (אם קיים)
        // הערה: ב-NextAuth ברירת המחדל, ה-ID לא תמיד קיים בטיפוס אלא אם הוגדר ב-callbacks
        const userId = (session.user as { id?: string }).id;

        // הכנת אובייקט הקישור למשתמש (לפי ID אם יש, אחרת לפי אימייל)
        const userConnect = userId
            ? { connect: { id: userId } }
            : { connect: { email: session.user.email } };

        const newBlend = await prisma.blend.create({
            data: {
                name,
                base,
                milk,
                flavor,
                user: userConnect,
            },
        });

        return NextResponse.json(newBlend, { status: 201 });

    } catch (error: any) {
        console.error('Error saving blend:', error);

        // טיפול בשגיאה ספציפית של Prisma (P2025: Record to update not found)
        // קורה אם מנסים לקשר למשתמש שלא קיים ב-DB
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}