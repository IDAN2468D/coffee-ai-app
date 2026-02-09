
'use client';

import React from 'react';
import Navbar from "@/components/TempNavbar";
import { Sparkles, Map, Star, Calendar, ChefHat, Droplets, ArrowRight, Share2, Globe, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PASSPORT_ENTRIES } from '@/lib/mock-passport';

export default function PassportDetailsPage({ params }: { params: { id: string } }) {
    const entry = PASSPORT_ENTRIES.find(e => e.id === Number(params.id));

    if (!entry) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 w-full">

                {/* Hero Section */}
                <div className="relative h-[50vh] min-h-[400px] w-full">
                    <img
                        src={entry.image}
                        alt={entry.coffeeName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/50 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-6xl mx-auto">
                        <Link
                            href="/passport"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-[#C37D46] transition-colors mb-6 group"
                        >
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            חזרה לדרכון
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-[#C37D46] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#C37D46]/20">
                                        {entry.origin}
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md border border-white/10">
                                        {entry.date}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-2 drop-shadow-2xl">
                                    {entry.coffeeName}
                                </h1>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${i < entry.rating ? 'fill-[#C37D46] text-[#C37D46]' : 'text-white/20'}`}
                                        />
                                    ))}
                                    <span className="mr-3 text-white/40 font-mono text-sm">(Rating: {entry.rating}/5)</span>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl transition-all font-bold text-white group">
                                <Share2 className="w-5 h-5" />
                                <span>שתף כרטיסייה</span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
                    <div className="grid md:grid-cols-3 gap-12 md:gap-24">

                        {/* Left Column: Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-2 space-y-12"
                        >
                            {/* Tasting Notes */}
                            <div className="bg-[#1a1a1a]/50 border border-[#C37D46]/20 rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="w-24 h-24 text-[#C37D46]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#C37D46] mb-4 flex items-center gap-2">
                                    <ChefHat className="w-5 h-5" />
                                    רשמי טעימה
                                </h3>
                                <p className="text-xl md:text-2xl font-serif leading-relaxed text-white/90">
                                    "{entry.notes}"
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-[#C37D46]/30 transition-colors">
                                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Droplets className="w-4 h-4" />
                                        שיטת חליטה
                                    </div>
                                    <div className="text-xl font-black text-white">{entry.method}</div>
                                </div>
                                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-[#C37D46]/30 transition-colors">
                                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        דרגת קלייה
                                    </div>
                                    <div className="text-xl font-black text-white">{entry.roastLevel}</div>
                                </div>
                                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-[#C37D46]/30 transition-colors">
                                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        מקור
                                    </div>
                                    <div className="text-xl font-black text-white">{entry.origin}</div>
                                </div>
                                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-[#C37D46]/30 transition-colors">
                                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <ChefHat className="w-4 h-4" />
                                        בריסטה
                                    </div>
                                    <div className="text-xl font-black text-white">{entry.barista}</div>
                                </div>
                            </div>

                        </motion.div>

                        {/* Right Column: Visual Elements */}
                        <div className="space-y-8">
                            {/* Passport Stamp */}
                            <div className="aspect-square rounded-full border-4 border-[#C37D46]/20 flex items-center justify-center p-8 relative group cursor-pointer hover:border-[#C37D46]/50 transition-all bg-[#1a1a1a]/50">
                                <div className="absolute inset-4 border border-[#C37D46]/10 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="text-center rotate-[-12deg] group-hover:scale-110 transition-transform duration-500">
                                    <div className="text-[#C37D46] font-black text-2xl uppercase tracking-widest leading-none mb-1">Passport</div>
                                    <div className="text-white/60 font-mono text-sm uppercase tracking-[0.3em]">Approved</div>
                                    <div className="w-12 h-1 bg-[#C37D46]/50 mx-auto my-2"></div>
                                    <div className="text-white/40 font-mono text-xs">{entry.date}</div>
                                </div>
                            </div>

                            {/* Similar Recommendations (Future) */}
                            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">עוד מאתיופיה</h4>
                                <div className="space-y-3">
                                    <div className="h-2 bg-white/5 rounded-full w-full animate-pulse"></div>
                                    <div className="h-2 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                                    <div className="h-2 bg-white/5 rounded-full w-1/2 animate-pulse"></div>
                                </div>
                                <p className="text-xs text-white/20 mt-4 text-center">בקרוב...</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
