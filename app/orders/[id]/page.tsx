
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Verify import path
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import OrderTracker from "@/components/order/OrderTracker";
import Navbar from "@/components/TempNavbar";
import Footer from "@/components/AppFooter";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@prisma/client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: PageProps) {
    // Next.js 15: params is a Promise
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect(`/auth/signin?callbackUrl=/orders/${id}`);
    }

    // validate ID format (Mongo ObjectID usually 24 hex chars)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        notFound();
    }

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
    });

    if (!order) {
        notFound();
    }

    // Authorization: User must own order OR be Admin
    // Need to fetch user role to be sure? Or checking email match?
    // Session user id might not be in session depending on config.
    // Let's fetch current user from DB to be safe with Role check.
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true, isAdmin: true }
    });

    if (!user) redirect("/auth/signin");

    const isOwner = order.userId === user.id;
    const isAdmin = user.role === 'ADMIN' || user.isAdmin;

    if (!isOwner && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-stone-800">אין לך הרשאה לצפות בהזמנה זו</h1>
                    <Link href="/" className="text-stone-500 hover:text-stone-800 underline mt-4 block">
                        חזרה לדף הבית
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <Link href="/orders" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#C37D46] mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    <span>חזרה להזמנות שלי</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="bg-[#2D1B14] p-6 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold font-serif">הזמנה #{order.id.slice(-6)}</h1>
                            <p className="text-white/60 text-sm">
                                {order.createdAt.toLocaleDateString('he-IL')} • {order.items.length} פריטים
                            </p>
                        </div>
                        <div className="text-2xl font-bold">
                            ₪{order.total}
                        </div>
                    </div>

                    <div className="p-6">
                        <OrderTracker currentStatus={order.status} />
                    </div>

                    <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                        <h3 className="font-bold text-stone-900 mb-4">סיכום הזמנה</h3>
                        <ul className="space-y-4">
                            {order.items.map((item) => (
                                <li key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg border border-stone-200 flex items-center justify-center text-lg">
                                            ☕
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900">{item.product.name}</p>
                                            <p className="text-stone-500">כמות: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-stone-900">
                                        ₪{item.product.price * item.quantity}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t border-stone-200 flex justify-between items-center font-bold text-lg text-stone-900">
                            <span>סה"כ לתשלום</span>
                            <span>₪{order.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
