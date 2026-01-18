import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[#C37D46]">
                        <Headphones size={18} />
                        <span className="text-sm font-bold tracking-widest uppercase">Cyber Ambience</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tight">
                        בית הקפה <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C37D46] to-amber-200">הווירטואלי</span>
                    </h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
                        השאירו את הטאב הזה פתוח ברקע בזמן שאתם עובדים.
                        בחרו את הסאונד המושלם שלכם והרגישו בבית הקפה שלנו, מכל מקום.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl">
                    <div className="mb-8 flex items-center gap-3 text-white/50 border-b border-white/5 pb-8">
                        <Sparkles size={20} />
                        <span className="text-sm font-mono uppercase">Sound Mixer // v2.0</span>
                    </div>

                    <AmbienceMixer />

                    <div className="mt-12 text-center">
                        <p className="text-xs text-stone-600 font-mono">
                            * מומלץ להשתמש באוזניות לחוויה מקסימלית (Spatial Audio)
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
