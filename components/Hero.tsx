'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center overflow-hidden bg-[#2D1B14]">
            {/* Background with dynamic overlay */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 z-0"
            >
                <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000"
                    alt="Coffee Hero"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#2D1B14] via-transparent to-[#2D1B14]/80" />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full" dir="rtl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="inline-flex items-center space-x-2 space-x-reverse bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white/90 text-sm font-bold tracking-wide"
                            >
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span>חווית קפה מבוססת AI הראשונה בישראל</span>
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl font-serif text-white font-bold leading-[1.1]">
                                מגדירים מחדש את <span className="text-[#CAB3A3]">הקפה</span> שלך
                            </h1>
                        </div>

                        <p className="text-xl text-white/70 font-light leading-relaxed max-w-xl">
                            מהפוליים המשובחים ביותר ועד ליצירות אמנות דיגיטליות - אנחנו משלבים מסורת של קפה משובח עם טכנולוגיית AI מתקדמת.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-[#CAB3A3] text-[#2D1B14] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center group"
                            >
                                לתפריט המשקאות
                                <ArrowRight className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button className="bg-white/5 backdrop-blur-md border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                                הסיפור שלנו
                            </button>
                        </div>
                    </motion.div>

                    {/* Floating Premium Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="hidden lg:block relative"
                    >
                        <div className="absolute inset-0 bg-[#8B4513] blur-[100px] opacity-20 rounded-full" />
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative bg-white/5 backdrop-blur-2xl border border-white/20 p-8 rounded-[3rem] shadow-2xl space-y-6"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-64 object-cover rounded-[2rem] shadow-lg"
                                alt="Signature Coffee"
                            />
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-white text-2xl font-serif font-bold">לאטה וניל בעבודת יד</h3>
                                    <p className="text-white/60">המומלץ שלנו להיום</p>
                                </div>
                                <div className="bg-[#CAB3A3] p-4 rounded-2xl text-[#2D1B14] font-black">
                                    ₪24
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-[10px] uppercase font-bold tracking-[0.3em]">גלול מטה</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
        </section>
    );
}
