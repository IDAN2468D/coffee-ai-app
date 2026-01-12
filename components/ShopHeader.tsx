'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ShopHeader() {
    return (
        <header className="relative pt-48 pb-24 overflow-hidden bg-[#2D1B14]">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20">
                <img
                    src="https://www.transparenttextures.com/patterns/coffee-beans.png"
                    alt="pattern"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/80 via-[#2D1B14]/90 to-[#F2F2F2] z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6">
                        <Sparkles className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/90">Premium Selection</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight"
                >
                    Curated for <span className="text-[#C37D46]">Perfection</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-stone-400 font-light max-w-2xl mx-auto leading-relaxed"
                >
                    Explore our exclusive range of artisanal blends, single-origin beans, and premium equipment designed to elevate your daily ritual.
                </motion.p>
            </div>
        </header>
    );
}
