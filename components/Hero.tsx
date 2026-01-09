'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000"
                    alt="Coffee Hero"
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl space-y-8"
                >
                    <div className="space-y-4">
                        <div className="w-16 h-1 bg-white" />
                        <h1 className="text-6xl md:text-8xl font-serif text-white font-bold leading-tight">
                            We Offer a Delicious Variety of Coffee
                        </h1>
                    </div>

                    <p className="text-xl text-white/70 font-light leading-relaxed max-w-xl">
                        From our signature dark roasts to our creamy seasonal specialties, every cup is crafted with passion and precision.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="bg-white text-[#2D1B14] px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#8B4513] hover:text-white transition-all shadow-xl">
                            Book a Table
                        </button>
                        <button className="border-2 border-white/50 text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                            Learn More
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
