'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function BeanBanner() {
    return (
        <section className="relative py-40 overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=2000"
                    alt="Coffee Beans"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white space-y-6">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-serif font-bold"
                >
                    Check Out Our Best Coffee Beans
                </motion.h2>
                <p className="max-w-2xl mx-auto text-white/70 text-lg font-light">
                    Ethically sourced, masterfully roasted, and delivered fresh to your cup. Experience the depth of flavor only premium beans can provide.
                </p>
            </div>
        </section>
    );
}
