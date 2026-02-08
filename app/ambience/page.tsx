import React from 'react';
import Navbar from "@/components/TempNavbar";
import Footer from "@/components/AppFooter";
import AmbienceMixer from "@/components/AmbienceMixer";
import { Sparkles, Headphones } from 'lucide-react';

export default function AmbiencePage() {
    return (
        <main className="min-h-screen bg-[#120C0A] font-sans relative overflow-hidden" dir="rtl">
            <Navbar />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C37D46]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                {/* Cyber Overlay Effect */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('/noise.png')] mix-blend-overlay" />
                <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />

                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[#C37D46]">
                        <Headphones size={18} />
                        <span className="text-sm font-bold tracking-[0.3em] uppercase">NEURAL AMBIENCE v2.4</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tight">
                        מיקסר <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C37D46] to-amber-200">התדרים</span> הווירטואלי
                    </h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
                        ברוכים הבאים למרחב הדיגיטלי שלנו. הגדירו את אטמוספירת העבודה המושלמת
                        על ידי שילוב תדרים מרגיעים וצלילי סייבר-קפה אותנטיים.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden group/container">
                    {/* Animated background pulse */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C37D46]/5 to-transparent opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000" />

                    <div className="mb-8 flex items-center justify-between text-white/50 border-b border-white/5 pb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <Sparkles size={20} className="text-[#C37D46] animate-pulse" />
                            <span className="text-sm font-mono uppercase tracking-widest">Atmosphere Control // ACTIVE</span>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono">
                            <span>CPU: 0.2%</span>
                            <span className="text-[#C37D46]">SYNC: STABLE</span>
                        </div>
                    </div>

                    <AmbienceMixer />

                    <div className="mt-12 text-center relative z-10">
                        <p className="text-[10px] text-stone-600 font-mono tracking-widest uppercase mb-2">
                            System optimized for spatial audio / neural sync
                        </p>
                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-stone-800 to-transparent mx-auto" />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
