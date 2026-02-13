"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { craftBlend } from "@/app/actions/alchemy";
import { Beaker, Sparkles, Wand2, Coffee, CheckCircle2 } from "lucide-react";

export default function AlchemyPage() {
    const [stats, setStats] = useState({
        acidity: 50,
        body: 50,
        sweetness: 50,
        bitterness: 50
    });
    const [isCrafting, setIsCrafting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCraft = async () => {
        setIsCrafting(true);
        const res = await craftBlend(stats);
        if (res.success) {
            setResult(res.data);
        } else {
            alert(res.error);
        }
        setIsCrafting(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-3 rounded-full bg-amber-500/10 mb-4">
                        <Beaker className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
                        מעבדת האלכימיה
                    </h1>
                    <p className="text-gray-400 mt-4 text-lg">
                        רתום את כוח ה-AI ליצירת תערובת הקפה המושלמת עבורך
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 bg-zinc-900/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
                        {Object.entries(stats).map(([key, value]) => (
                            <div key={key} className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="capitalize text-gray-300">
                                        {key === 'acidity' ? 'חמיצות' :
                                            key === 'body' ? 'גוף' :
                                                key === 'sweetness' ? 'מתיקות' : 'מרירות'}
                                    </span>
                                    <span className="text-amber-500">{value}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={value}
                                    onChange={(e) => setStats({ ...stats, [key]: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>
                        ))}

                        <button
                            onClick={handleCraft}
                            disabled={isCrafting}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50"
                        >
                            {isCrafting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <Wand2 className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <Sparkles className="w-6 h-6" />
                            )}
                            {isCrafting ? "מזקק טעמים..." : "צור תערובת פרימיום"}
                        </button>
                    </div>

                    <div className="relative h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {!result && !isCrafting && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center text-gray-500"
                                >
                                    <Coffee className="w-24 h-24 mx-auto mb-4 opacity-20" />
                                    <p>הזן ערכים כדי להתחיל בזיקוק</p>
                                </motion.div>
                            )}
                            {isCrafting && (
                                <motion.div
                                    key="loading"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <div className="w-48 h-48 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                                    <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-amber-500 animate-pulse" />
                                </motion.div>
                            )}
                            {result && (
                                <motion.div
                                    key="result"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-gradient-to-br from-amber-900/40 to-black p-8 rounded-3xl border border-amber-500/30 text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4">
                                        <CheckCircle2 className="text-amber-500 w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-amber-500 mb-4">{result.name}</h3>
                                    <p className="text-gray-300 leading-relaxed italic">
                                        "{result.flavor}"
                                    </p>
                                    <div className="mt-6 flex justify-center gap-4 text-xs font-mono text-amber-500/60">
                                        <span>A:{stats.acidity}</span>
                                        <span>B:{stats.body}</span>
                                        <span>S:{stats.sweetness}</span>
                                        <span>M:{stats.bitterness}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
