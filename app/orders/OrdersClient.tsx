'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Coffee, Package, Calendar, ChevronRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error("Orders API returned invalid format:", data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Coffee className="w-12 h-12 text-[#2D1B14] opacity-20" />
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] pb-24" dir="rtl">
            {/* Header */}
            <header className="bg-white border-b border-stone-100 py-16 mb-12">
                <div className="max-w-5xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center space-x-2 space-x-reverse text-stone-400 hover:text-[#2D1B14] transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
                        <span className="text-xs font-black uppercase tracking-widest">חזרה לבית הקלייה</span>
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#2D1B14]">ההזמנות שלי</h1>
                    <p className="text-stone-400 mt-4 text-lg font-light">עקבו אחר היסטוריית חוויית הקפה שלכם איתנו.</p>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 text-right">
                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
                        <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ShoppingBag className="w-10 h-10 text-stone-300" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#2D1B14] mb-3">אין הזמנות עדיין</h2>
                        <p className="text-stone-400 mb-10 max-w-sm mx-auto text-lg font-light">היסטוריית ההזמנות שלכם ריקה כרגע. זה הזמן להתחיל את המסע עם קפה טרי ומשובח.</p>
                        <Link href="/" className="inline-block bg-[#2D1B14] text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-black hover:scale-[1.02] transition-all">
                            צפייה בתפריט
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.id}
                                className="bg-white rounded-[3rem] border border-stone-100 shadow-[0_20px_60px_rgba(45,27,20,0.05)] overflow-hidden group hover:shadow-[0_30px_80px_rgba(45,27,20,0.1)] transition-all duration-500"
                            >
                                <div className="p-8 md:p-12">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 pb-10 border-b border-stone-50">
                                        <div className="flex items-center space-x-6 space-x-reverse">
                                            <div className="bg-[#2D1B14] p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                <Package className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">מזהה הזמנה</p>
                                                <p className="font-mono text-lg font-bold text-[#2D1B14]">#{order.id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">תאריך הזמנה</p>
                                                <div className="flex items-center space-x-2 space-x-reverse text-[#2D1B14]">
                                                    <Calendar className="w-4 h-4 opacity-40" />
                                                    <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('he-IL')}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">סטטוס</p>
                                                <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100 shadow-sm">
                                                    {order.status === 'Completed' ? 'הושלם' : order.status}
                                                </span>
                                            </div>
                                            <div className="hidden lg:block text-right">
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">סך ההשקעה</p>
                                                <p className="text-2xl font-black text-[#2D1B14]">₪{order.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center space-x-5 space-x-reverse p-5 rounded-[1.5rem] bg-stone-50/50 border-2 border-transparent hover:border-stone-100 hover:bg-white transition-all shadow-sm">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white relative">
                                                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                                </div>
                                                <div className="min-w-0 text-right">
                                                    <p className="font-black text-[#2D1B14] truncate uppercase text-xs tracking-wide mb-1">{item.product.name}</p>
                                                    <p className="text-stone-400 text-[11px] font-bold">כמות: {item.quantity} × ₪{item.product.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-10 flex items-center justify-between border-t border-stone-50 lg:hidden">
                                        <p className="text-sm font-black text-stone-400 uppercase tracking-widest">סך ההשקעה</p>
                                        <p className="text-3xl font-black text-[#2D1B14]">₪{order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
