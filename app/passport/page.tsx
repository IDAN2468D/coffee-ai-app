
'use client';

import React, { useState } from 'react';
import Navbar from "@/components/TempNavbar";
import { Sparkles, Map, Star, Award, Coffee, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PassportPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for passport entries
    const entries = [
        {
            id: 1,
            coffeeName: "אתיופיה יירגשף",
            date: "2023-10-15",
            rating: 5,
            notes: "חומציות פירותית מדהימה, טעמי יסמין.",
            origin: "Ethiopia",
            image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 2,
            coffeeName: "קולומביה סופרמו",
            date: "2023-10-18",
            rating: 4,
            notes: "גוף מלא, טעמי אגוז וקרמל. קצת מריר מדי בסוף.",
            origin: "Colombia",
            image: "https://images.unsplash.com/photo-1587049352851-8d4e8913d179?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 3,
            coffeeName: "ברזיל סרדו",
            date: "2023-10-22",
            rating: 3,
            notes: "סטנדרטי, טוב לקפוצ'ינו אבל לא לאספרסו נקי.",
            origin: "Brazil",
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop"
        }
    ];

    const filteredEntries = entries.filter(entry =>
        entry.coffeeName.includes(searchTerm) || entry.origin.includes(searchTerm)
    );

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/30 backdrop-blur-md shadow-[0_0_15px_rgba(195,125,70,0.3)]">
                        <Map className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-[#C37D46]">Coffee Explorer</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C37D46] to-[#8B4513] drop-shadow-sm pb-2">
                        דרכון הקפה שלך
                    </h1>
                    <p className="text-xl text-white/40 max-w-lg mx-auto leading-relaxed font-light">
                        כל הטעמים, כל המסעות. <br />
                        תיעוד אישי של כל כוס קפה ששתיתם.
                    </p>
                </div>

                {/* Search & Statistics */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="md:col-span-3 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-[#C37D46]/50 transition-colors">
                        <Search className="w-6 h-6 text-white/40" />
                        <input
                            type="text"
                            placeholder="חפש לפי שם קפה או מדינה..."
                            className="bg-transparent w-full text-white placeholder-white/20 focus:outline-none text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-[#C37D46]/10 border border-[#C37D46]/30 rounded-2xl p-4 flex flex-col items-center justify-center text-[#C37D46]">
                        <div className="text-3xl font-black font-mono">{entries.length}</div>
                        <div className="text-xs font-bold uppercase tracking-widest opacity-80">יעדים נכבשו</div>
                    </div>
                </div>

                {/* Passport Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEntries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-[#1a1a1a] border border-white/5 hover:border-[#C37D46]/30 rounded-3xl overflow-hidden shadow-xl transition-all hover:translate-y-[-5px]"
                        >
                            {/* Image Header */}
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={entry.image}
                                    alt={entry.coffeeName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#C37D46] rounded-full animate-pulse"></span>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{entry.origin}</span>
                                </div>
                                {/* Stamp Effect */}
                                <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 border-4 border-white/10 rounded-full flex items-center justify-center -rotate-12 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[10px] font-black uppercase text-white/40 text-center leading-none">
                                        PASSPORT<br />CONTROL<br />VISITED
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-1">{entry.coffeeName}</h3>
                                        <div className="text-xs text-white/40 font-mono">{entry.date}</div>
                                    </div>
                                    <div className="flex bg-[#C37D46]/10 px-2 py-1 rounded-lg border border-[#C37D46]/20">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < entry.rating ? 'fill-[#C37D46] text-[#C37D46]' : 'text-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                                    "{entry.notes}"
                                </p>

                                <div className="mt-6 flex justify-end">
                                    <button className="text-[#C37D46] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                        פרטים מלאים <Award className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredEntries.length === 0 && (
                    <div className="text-center py-20 opacity-40">
                        <Coffee className="w-16 h-16 mx-auto mb-4" />
                        <p>לא נמצאו רשומות בדרכון שלך.</p>
                    </div>
                )}

            </div>
        </main>
    );
}
