'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { IProcessedBranch } from './page';
import { MapPin, Phone, Compass, Coffee, Sparkles, Navigation, Search, List, Map as MapIcon, ChevronLeft, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import StoreMap only on the client
const StoreMap = dynamic(() => import('@/components/StoreMap'), {
    loading: () => (
        <div className="h-[400px] md:h-[500px] w-full bg-stone-900 rounded-3xl flex items-center justify-center border border-white/5">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Coffee className="w-10 h-10 text-amber-600 animate-bounce" />
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div className="text-white/40 font-bold tracking-widest text-[10px] uppercase">הופך סניפים למפה...</div>
            </div>
        </div>
    ),
    ssr: false
});

interface StoresClientProps {
    branches: IProcessedBranch[];
}

export default function StoresClient({ branches = [] }: StoresClientProps) {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const safeBranches = Array.isArray(branches) ? branches : [];

    const filteredBranches = useMemo(() => {
        return safeBranches.filter(branch =>
            branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [safeBranches, searchQuery]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#0A0503] pb-24" dir="rtl">
            {/* Immersive Hero Section */}
            <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0503]/50 to-[#0A0503]" />

                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/10 blur-[150px] rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.2em] uppercase mb-6 backdrop-blur-xl">
                        <MapPin className="w-3 h-3" />
                        <span>רשת הסניפים הארצית</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif font-black text-white mb-4 tracking-tight leading-tight">
                        מצאו את <span className="text-amber-500 italic">הבית</span> החדש שלכם
                    </h1>
                    <p className="text-stone-400 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed opacity-80">
                        הטכנולוגיה העדכנית ביותר של עולם הקפה, בכל רחבי הארץ.
                    </p>
                </motion.div>
            </section>

            {/* Sticky Interaction Bar */}
            <div className="sticky top-16 md:top-20 z-40 px-4 md:px-6 -mt-8 mb-8">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3">
                    {/* Search Field */}
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-500 group-focus-within:text-amber-500 transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="חפשו עיר או שם סניף..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pr-11 pl-4 bg-stone-900/80 backdrop-blur-xl border border-white/5 rounded-2xl text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold shadow-2xl"
                        />
                    </div>

                    {/* View Switcher (Mobile Optimized) */}
                    <div className="flex gap-2 h-14">
                        <div className="flex p-1.5 bg-stone-900/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl flex-grow">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#C37D46] text-white shadow-lg' : 'text-stone-500 hover:text-white'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                <span className="text-xs font-black uppercase">רשימה</span>
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-[#C37D46] text-white shadow-lg' : 'text-stone-500 hover:text-white'
                                    }`}
                            >
                                <MapIcon className="w-4 h-4" />
                                <span className="text-xs font-black uppercase">מפה</span>
                            </button>
                        </div>

                        <button className="w-14 h-full flex items-center justify-center bg-stone-900/80 backdrop-blur-xl border border-white/5 rounded-2xl text-stone-500 hover:text-amber-500 transition-all shadow-xl">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 md:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">
                            {filteredBranches.length} תוצאות נמצאו
                        </span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'map' ? (
                        <motion.div
                            key="map-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 rounded-[2.5rem] border border-white/10 p-2 overflow-hidden shadow-2xl"
                        >
                            {safeBranches.length > 0 ? (
                                <StoreMap branches={filteredBranches} />
                            ) : (
                                <div className="h-[400px] flex items-center justify-center text-stone-500">
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="font-bold">לא נמצאו סניפים התואמים לחיפוש...</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list-view"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {filteredBranches.length > 0 ? (
                                filteredBranches.map((branch) => (
                                    <motion.div
                                        key={branch._id || Math.random()}
                                        variants={itemVariants}
                                        className="group relative bg-[#1A100C]/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-amber-500/10 rounded-xl">
                                                    <Compass className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/5 px-2 py-1 rounded-full border border-amber-500/10">
                                                        <Sparkles className="w-2.5 h-2.5" />
                                                        <span>מומלץ</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-serif font-black text-white mb-2 group-hover:text-amber-500 transition-colors">
                                                {branch.name}
                                            </h3>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-start gap-2.5 text-stone-400 group-hover:text-stone-300 transition-colors">
                                                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-amber-500/70" />
                                                    <span className="text-xs font-medium leading-relaxed">{branch.address}</span>
                                                </div>
                                                {branch.phoneNumber && (
                                                    <div className="flex items-center gap-2.5 text-stone-400">
                                                        <Phone className="w-3.5 h-3.5 text-amber-500/70" />
                                                        <span className="text-xs tracking-[0.1em] font-medium">{branch.phoneNumber}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <a
                                                    href={`https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-grow flex items-center justify-center gap-2 h-12 bg-white text-black rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-xl group/btn"
                                                >
                                                    <Navigation className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">פתיחת ניווט</span>
                                                </a>
                                                <button className="w-12 h-12 flex items-center justify-center bg-white/5 text-white/50 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-900 rounded-3xl mb-6">
                                        <Search className="w-8 h-8 text-stone-700" />
                                    </div>
                                    <h4 className="text-white font-bold mb-2">לא נמצאו תוצאות</h4>
                                    <p className="text-stone-500 text-sm">נסו לחפש במונחים אחרים או לנקות את המסנן.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Quick Contact */}
            <div className="mt-20 px-4">
                <div className="max-w-xl mx-auto bg-amber-500/5 rounded-[2rem] border border-amber-500/10 p-8 text-center backdrop-blur-sm">
                    <h3 className="text-white font-serif text-lg font-bold mb-2">לא מצאתם את הסניף המתאים?</h3>
                    <p className="text-stone-500 text-xs mb-6 font-medium">אנחנו עובדים במרץ על פתיחת נקודות חדשות של ה-Cyber Barista.</p>
                    <button className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        דברו איתנו
                    </button>
                </div>
            </div>
        </div>
    );
}
