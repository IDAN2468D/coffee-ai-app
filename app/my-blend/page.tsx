
'use client';

import React, { useState } from 'react';
import Navbar from "@/components/TempNavbar";
import { Sparkles, Coffee, Plus, Save, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyBlendPage() {
    const [blendName, setBlendName] = useState('');
    const [base, setBase] = useState('Espresso');
    const [milk, setMilk] = useState('Regular');
    const [flavor, setFlavor] = useState('None');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!blendName) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/my-blend/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: blendName,
                    base,
                    milk,
                    flavor,
                }),
            });

            if (res.ok) {
                alert('הבלנד שלך נשמר בהצלחה!');
                setBlendName('');
            } else {
                const data = await res.json();
                if (res.status === 401) {
                    alert('נא להתחבר כדי לשמור את הבלנד');
                } else {
                    alert(`שגיאה בשמירה: ${data.error || 'נסה שנית'}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('אירעה שגיאה בעת השמירה');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-40 pb-24">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/30 backdrop-blur-md shadow-[0_0_15px_rgba(195,125,70,0.3)]">
                        <Sparkles className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-[#C37D46]">יוצר הבלנדים</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C37D46] to-[#8B4513] drop-shadow-sm pb-2">
                        צור את הקפה שלך
                    </h1>
                    <p className="text-xl text-white/40 max-w-lg mx-auto leading-relaxed font-light">
                        המעבדה פתוחה. בחרו את המרכיבים, תנו שם ליצירה, ואנחנו נדאג לשאר.
                    </p>
                </div>

                {/* Creator UI */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-12">

                        <div className="space-y-8">
                            {/* Base Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-[#C37D46] uppercase tracking-widest">בסיס הקפה</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Espresso', 'Cold Brew', 'Filter', 'Ristretto'].map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setBase(b)}
                                            className={`p-4 rounded-xl border text-right transition-all ${base === b ? 'bg-[#C37D46]/20 border-[#C37D46] text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Milk Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-[#C37D46] uppercase tracking-widest">סוג חלב</label>
                                <select
                                    value={milk}
                                    onChange={(e) => setMilk(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#C37D46] focus:outline-none transition-colors"
                                >
                                    <option value="Regular" className="bg-[#1a1a1a] text-white">חלב רגיל</option>
                                    <option value="Oat" className="bg-[#1a1a1a] text-white">חלב שיבולת שועל</option>
                                    <option value="Almond" className="bg-[#1a1a1a] text-white">חלב שקדים</option>
                                    <option value="Soy" className="bg-[#1a1a1a] text-white">חלב סויה</option>
                                    <option value="None" className="bg-[#1a1a1a] text-white">ללא חלב</option>
                                </select>
                            </div>

                            {/* Flavor Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-[#C37D46] uppercase tracking-widest">תוספת טעם</label>
                                <div className="flex flex-wrap gap-2">
                                    {['None', 'Vanilla', 'Caramel', 'Hazelnut', 'Cinnamon'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFlavor(f)}
                                            className={`px-4 py-2 rounded-full border text-sm transition-all ${flavor === f ? 'bg-[#C37D46] border-[#C37D46] text-white' : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'}`}
                                        >
                                            {f === 'None' ? 'ללא' : f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 flex flex-col justify-between">

                            {/* Preview Card */}
                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 text-center space-y-4">
                                <div className="w-32 h-32 mx-auto bg-[#C37D46]/10 rounded-full flex items-center justify-center relative">
                                    <Coffee className="w-16 h-16 text-[#C37D46]" />
                                    <div className="absolute inset-0 border-4 border-[#C37D46]/20 rounded-full border-t-[#C37D46] animate-spin p-2"></div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-white">{blendName || 'הבלנד האישי שלך'}</h3>
                                    <p className="text-white/40 text-sm mt-2">
                                        {base} + {milk === 'None' ? 'No Milk' : milk + ' Milk'}
                                        {flavor !== 'None' && ` + ${flavor}`}
                                    </p>
                                </div>
                            </div>

                            {/* Name & Save */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-[#C37D46] uppercase tracking-widest">שם ליצירה</label>
                                <input
                                    type="text"
                                    value={blendName}
                                    onChange={(e) => setBlendName(e.target.value)}
                                    placeholder="אייס וניל חלומי..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#C37D46] focus:outline-none transition-colors"
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={!blendName || isSaving}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!blendName || isSaving ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#C37D46] text-white hover:bg-[#A66330] shadow-lg shadow-[#C37D46]/20'}`}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            שומר...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            שמור למתכונים שלי
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
