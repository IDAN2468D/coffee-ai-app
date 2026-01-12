'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CoffeeAnimation from './CoffeeAnimation';

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden bg-[#2D1B14]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/premium_hero_bg.png"
                    alt="Premium Coffee Shop Ambience"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B14] via-[#2D1B14]/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 text-left" // Left align as per standard web design, or specific to image? Image shows typical hero.
                    // Image shows centered or left. Let's go with Left aligned for clear typography.
                    >
                        <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight">
                            Brewed to <br />
                            Perfection, Sipped <br />
                            with <span className="text-[#C37D46]">Passion</span>.
                        </h1>

                        <p className="text-lg text-white/80 font-light leading-relaxed max-w-lg">
                            We curate the world's finest coffee beans, roasted to perfection to bring you the ultimate coffee experience. Start your morning right with Latte Lane.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/shop"
                                className="bg-[#C37D46] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#A66330] transition-all shadow-lg hover:shadow-[#C37D46]/20 border-2 border-transparent hover:scale-105 flex items-center gap-2"
                            >
                                Shop Now
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                My Dashboard
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Image / Composition - Optional, depending on if we have a cut-out image. 
                        For now, the background does the heavy lifting, but we can add a floating cup if we have one.
                        The example image has a top-down view cup.
                    */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:flex justify-end relative items-center justify-center p-12"
                    >
                        {/* Animated Coffee Cup */}
                        <div className="relative w-[500px] h-[500px]">
                            <CoffeeAnimation />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decor elements */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#2D1B14] to-transparent z-20" />
        </section>
    );
}
