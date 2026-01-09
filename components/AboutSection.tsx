'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B4513]/10 rounded-full blur-3xl" />
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"
                                alt="חווית קפה"
                                className="w-full aspect-square object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2D1B14] leading-tight">
                            מעניקים חוויות <span className="text-[#8B4513]">קפה</span> ייחודיות
                        </h2>
                        <p className="text-stone-500 leading-relaxed text-xl">
                            גלו את האמנות שמאחורי כל כוס. אנחנו בוחרים את הפולים שלנו בקפידה ממגדלים אתיים ברחבי העולם, כדי להבטיח טעם שהוא ייחודי בדיוק כמו הטקס שלכם בבוקר.
                        </p>
                        <button className="bg-[#2D1B14] text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#8B4513] transition-all shadow-xl">
                            גלו עוד עלינו
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
