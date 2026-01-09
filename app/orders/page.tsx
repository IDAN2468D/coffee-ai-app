'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Coffee, Package, Calendar, ChevronRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
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
        <main className="min-h-screen bg-[#FDFCF0] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-stone-100 py-12 mb-12">
                <div className="max-w-5xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center space-x-2 text-stone-400 hover:text-[#2D1B14] transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Roastery</span>
                    </Link>
                    <h1 className="text-5xl font-serif font-bold text-[#2D1B14]">Your Orders</h1>
                    <p className="text-stone-400 mt-2 font-light">Trace the history of your coffee journey with us.</p>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
                        <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-8 h-8 text-stone-300" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#2D1B14] mb-2">No orders yet</h2>
                        <p className="text-stone-400 mb-8 max-w-xs mx-auto">Your order history is currently empty. Start your journey with a fresh brew.</p>
                        <Link href="/" className="inline-block bg-[#2D1B14] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all">
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.id}
                                className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="p-8 md:p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-stone-50">
                                        <div className="flex items-center space-x-6">
                                            <div className="bg-[#2D1B14] p-4 rounded-2xl shadow-lg">
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">Order Identifier</p>
                                                <p className="font-mono text-sm font-bold text-[#2D1B14]">#{order.id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">Brew Date</p>
                                                <div className="flex items-center space-x-2 text-[#2D1B14]">
                                                    <Calendar className="w-4 h-4 opacity-40" />
                                                    <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">Status</p>
                                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="hidden md:block">
                                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">Total Investment</p>
                                                <p className="text-xl font-black text-[#2D1B14]">${order.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-stone-50/50 border border-transparent hover:border-stone-200 transition-colors">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#2D1B14] truncate uppercase text-xs tracking-wide">{item.product.name}</p>
                                                    <p className="text-stone-400 text-[11px] font-medium">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 flex items-center justify-between border-t border-stone-50 md:hidden">
                                        <p className="text-sm font-bold text-stone-400">Total Investment</p>
                                        <p className="text-2xl font-black text-[#2D1B14]">${order.total.toFixed(2)}</p>
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
