
'use client';

import React, { useState } from 'react';
import Navbar from "@/components/TempNavbar";
import { Sparkles, Map, Star, Globe, ChevronLeft, Search, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PASSPORT_ENTRIES } from '@/lib/mock-passport';

export default function PassportPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEntries = PASSPORT_ENTRIES.filter(entry =>
        entry.coffeeName.includes(searchTerm) || entry.origin.includes(searchTerm)
    );

    const roastLevelMap: Record<string, string> = {
        'Light': 'בהירה',
        'Medium': 'בינונית',
        'Dark': 'כהה',
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-24">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/30 backdrop-blur-md shadow-[0_0_15px_rgba(195,125,70,0.3)]"
                    >
                        <Map className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-[#C37D46]">חוקר קפה עולמי</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C37D46] to-[#8B4513] drop-shadow-sm pb-2"
                    >
                        דרכון הקפה שלך
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/40 max-w-lg mx-auto leading-relaxed font-light"
                    >
                        יומן מסע אישי לטעמים מרחבי העולם. <br />
                        כל לגימה היא חותמת חדשה בדרכון.
                    </motion.p>
                </div>

                {/* Search & Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-4 gap-6 mb-12"
                >
                    <div className="md:col-span-3 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-[#C37D46]/50 transition-colors shadow-lg">
                        <Search className="w-6 h-6 text-white/40" />
                        <input
                            type="text"
                            placeholder="חפש לפי שם קפה, מדינה, או טעמים..."
                            className="bg-transparent w-full text-white placeholder-white/20 focus:outline-none text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-gradient-to-br from-[#C37D46]/10 to-black/40 border border-[#C37D46]/30 rounded-2xl p-4 flex flex-col items-center justify-center text-[#C37D46] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#C37D46]/5 blur-xl group-hover:bg-[#C37D46]/10 transition-colors"></div>
                        <div className="relative z-10 text-3xl font-black font-mono">{PASSPORT_ENTRIES.length}</div>
                        <div className="relative z-10 text-xs font-bold uppercase tracking-widest opacity-80">יעדים נכבשו</div>
                    </div>
                </motion.div>

                {/* Passport Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredEntries.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-[#1a1a1a] border border-white/5 hover:border-[#C37D46]/50 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[#C37D46]/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Image Header */}
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={entry.image}
                                        alt={entry.coffeeName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60"></div>

                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                                        <Globe className="w-3 h-3 text-[#C37D46]" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{entry.origin}</span>
                                    </div>

                                    {/* Stamp Effect */}
                                    <div className="absolute bottom-[-10px] left-[-10px] w-28 h-28 border-[3px] border-[#C37D46]/40 rounded-full flex items-center justify-center -rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 group-hover:scale-100 bg-[#C37D46]/5 hover:bg-[#C37D46]/10 backdrop-blur-sm">
                                        <div className="text-[10px] font-black uppercase text-[#C37D46] text-center leading-tight tracking-widest">
                                            דרכון<br />ביקורת<br />ביקר<br />
                                            <span className="text-[8px] opacity-70">{entry.date.replace(/-/g, '.')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-serif font-black text-white mb-1 group-hover:text-[#C37D46] transition-colors">{entry.coffeeName}</h3>
                                            <div className="text-xs text-white/40 font-mono flex items-center gap-2">
                                                <span>{entry.date}</span>
                                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                                <span>קלייה {roastLevelMap[entry.roastLevel]}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < entry.rating ? 'fill-[#C37D46] text-[#C37D46]' : 'text-white/10'}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4 line-clamp-2 min-h-[3em]">
                                        "{entry.notes}"
                                    </p>

                                    <div className="mt-8 flex justify-end">
                                        <Link
                                            href={`/passport/${entry.id}`}
                                            className="group/btn relative px-6 py-2 bg-white/5 hover:bg-[#C37D46] text-white/60 hover:text-white rounded-full transition-all duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-[#C37D46]"
                                        >
                                            פרטים מלאים
                                            <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredEntries.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 opacity-40"
                    >
                        <Coffee className="w-16 h-16 mx-auto mb-4 stroke-1" />
                        <p className="text-lg font-serif">לא נמצאו רשומות בדרכון שלך.</p>
                    </motion.div>
                )}

            </div>
        </main>
    );
}
