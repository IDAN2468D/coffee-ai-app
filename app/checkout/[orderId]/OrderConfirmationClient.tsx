"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, User, Mail, MapPin, Star, Coffee } from "lucide-react";
import Link from "next/link";

interface OrderConfirmationClientProps {
    order: {
        id: string;
        items: any[];
        total: number;
        shippingFee: number;
        discount: number;
        vipDiscount: number;
        shippingDetails: any;
        date: string;
        pointsEarned: number;
    };
    userName: string;
}

export default function OrderConfirmationClient({ order, userName }: OrderConfirmationClientProps) {
    return (
        <main className="min-h-screen bg-[#FDFCF0] py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />

                    <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6 relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                        <CheckCircle className="w-12 h-12 text-green-600 relative z-10" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14] mb-4">
                        ההזמנה התקבלה בהצלחה!
                    </h1>
                    <p className="text-lg text-stone-500 max-w-lg mx-auto leading-relaxed">
                        תודה על ההזמנה, {userName.split(' ')[0]}. הקפה שלך כבר בתהליך הכנה.
                    </p>

                    <div className="mt-8 inline-flex items-center gap-3 bg-stone-50 px-6 py-3 rounded-xl border border-stone-100">
                        <span className="text-stone-400 font-bold text-xs uppercase tracking-widest">מספר הזמנה:</span>
                        <span className="font-mono font-bold text-[#2D1B14]">{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Details Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Items List */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-stone-100 text-right">
                            <h3 className="text-xl font-black text-[#2D1B14] mb-6 flex items-center justify-end gap-3">
                                <span>פרטי ההזמנה</span>
                                <Package className="w-5 h-5 text-[#8B4513]" />
                            </h3>
                            <div className="space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl flex-row-reverse">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm border border-stone-100 flex-shrink-0">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-grow text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                {item.size && (
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[9px] font-black uppercase">
                                                        {item.size === 'S' ? 'קטן' : item.size === 'M' ? 'בינוני' : 'גדול'}
                                                    </span>
                                                )}
                                                <h4 className="font-bold text-[#2D1B14] text-lg">{item.name}</h4>
                                            </div>
                                            <p className="text-xs text-stone-500 mt-1 font-bold">כמות: {item.quantity}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-[#2D1B14] text-lg">₪{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-stone-100 flex justify-between items-center px-2">
                                <span className="font-black text-stone-400 uppercase tracking-widest text-xs">סה״כ שולם</span>
                                <span className="font-black text-3xl text-[#2D1B14]">₪{order.total.toFixed(0)}</span>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-stone-100 text-right">
                            <h3 className="text-xl font-black text-[#2D1B14] mb-6 flex items-center justify-end gap-3">
                                <span>פרטי למשלוח</span>
                                <div className="bg-stone-50 p-2 rounded-xl">
                                    <Truck className="w-5 h-5 text-[#8B4513]" />
                                </div>
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl hover:bg-stone-50 transition-colors flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2D1B14] shadow-sm flex-shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow text-right">
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">נשלח אל</p>
                                        <p className="font-bold text-[#2D1B14] text-base md:text-lg">{order.shippingDetails.fullName || userName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl hover:bg-stone-50 transition-colors flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2D1B14] shadow-sm flex-shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow text-right">
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">כתובת</p>
                                        <p className="font-bold text-[#2D1B14] text-base md:text-lg">
                                            {order.shippingDetails.street}, {order.shippingDetails.city}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Points Earned Card */}
                        <div className="bg-[#2D1B14] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden text-center group hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute top-0 right-0 p-32 bg-[#CAB3A3]/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="relative z-10 flex flex-col items-center space-y-4">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                                    <Star className="w-10 h-10 text-yellow-400 fill-current" />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-yellow-400 mb-2">+{order.pointsEarned}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-white">נקודות Roast שנצברו</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/orders"
                            className="block w-full bg-[#E8E6D9] hover:bg-[#DCD8C0] text-[#2D1B14] py-5 rounded-2xl font-black text-center shadow-sm hover:shadow-md transition-all text-lg"
                        >
                            ההזמנות שלי
                        </Link>

                        <Link
                            href="/"
                            className="block w-full bg-white border-2 border-[#2D1B14] text-[#2D1B14] py-5 rounded-2xl font-black text-center hover:bg-[#2D1B14] hover:text-white transition-all shadow-sm hover:shadow-lg text-lg"
                        >
                            חזרה לחנות
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
