'use client';

import React, { useState, useRef } from 'react';
import Navbar from "@/components/TempNavbar";
import { Upload, Camera, Sparkles, Share2, RefreshCw, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FortunePage() {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ symbol: string, prediction: string, luckyNumber: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                analyzeFortune(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeFortune = async (file: File) => {
        setIsLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/fortune', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        if (result && navigator.share) {
            try {
                await navigator.share({
                    title: 'Coffee AI Fortune',
                    text: `הקפה שלי ניבא: ${result.prediction} (מספר מזל: ${result.luckyNumber})`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            alert('התחזית הועתקה ללוח!');
            navigator.clipboard.writeText(`הקפה שלי ניבא: ${result?.prediction}`);
        }
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans overflow-x-hidden selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 max-w-xl mx-auto px-6 py-24 text-center">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/30 backdrop-blur-md shadow-[0_0_15px_rgba(195,125,70,0.3)]">
                        <Sparkles className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-[#C37D46]">Cyber Oracle</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C37D46] to-[#8B4513] drop-shadow-sm pb-2">
                        מגדת העתידות
                    </h1>
                    <p className="text-lg text-white/40 max-w-md mx-auto leading-relaxed font-light">
                        הבינה המלאכותית תפענח את סודות הקפה שלך.
                        <br />
                        צלם את התחתית, וגלה את הגורל.
                    </p>
                </motion.div>

                <div className="relative w-full aspect-square max-w-sm mx-auto mb-12">
                    {/* Mystical Rings */}
                    <div className="absolute inset-0 border border-[#C37D46]/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 border border-[#C37D46]/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute inset-0 bg-[#C37D46]/5 rounded-full blur-3xl animate-pulse" />

                    <div className="relative w-full h-full rounded-full bg-[#1a1a1a]/80 backdrop-blur-xl overflow-hidden shadow-2xl flex items-center justify-center group border border-white/5 ring-1 ring-white/10">
                        <AnimatePresence mode="wait">
                            {!image ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6 p-6 z-10"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#C37D46] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <Camera className="w-16 h-16 text-[#C37D46]/80" />
                                    </div>
                                    <div className="space-y-3 w-full">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-gradient-to-r from-[#C37D46] to-[#8B4513] text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(195,125,70,0.4)] hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                                        >
                                            <Upload className="w-4 h-4" />
                                            העלה תמונה
                                        </button>
                                        <p className="text-xs text-white/20 font-mono tracking-widest uppercase">Select Image Source</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative w-full h-full"
                                >
                                    <img src={image} alt="Coffee Cup" className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />

                                    {/* Loading Overlay */}
                                    {isLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 z-20">
                                            <div className="w-20 h-20 relative">
                                                <div className="absolute inset-0 border-t-2 border-[#C37D46] rounded-full animate-spin"></div>
                                                <div className="absolute inset-2 border-r-2 border-[#C37D46]/50 rounded-full animate-spin reverse"></div>
                                            </div>
                                            <p className="mt-6 text-lg font-mono text-[#C37D46] animate-pulse text-center tracking-widest uppercase">
                                                Analyzing Patterns...
                                            </p>
                                        </div>
                                    )}

                                    {/* Result Overlay */}
                                    {result && !isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-30"
                                        >
                                            <div className="mb-4">
                                                <Sparkles className="w-8 h-8 text-[#C37D46] mx-auto animate-pulse" />
                                            </div>

                                            <h3 className="text-white font-black text-xl mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                                {result.symbol}
                                            </h3>

                                            <div className="w-12 h-0.5 bg-[#C37D46]/50 mx-auto mb-4"></div>

                                            <p className="text-lg font-serif leading-relaxed text-white/90 mb-6 drop-shadow-md">
                                                "{result.prediction}"
                                            </p>

                                            <div className="flex items-center gap-2 text-[#C37D46] font-mono text-sm border border-[#C37D46]/30 px-3 py-1 rounded-full bg-[#C37D46]/10 backdrop-blur-md mb-6">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span>מספר מזל: {result.luckyNumber}</span>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleShare}
                                                    className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#C37D46]/50 transition-all text-white/60 hover:text-white"
                                                    title="שתף"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => { setImage(null); setResult(null); }}
                                                    className="p-3 bg-[#C37D46] text-white rounded-full hover:bg-[#A66330] hover:scale-110 transition-all shadow-[0_0_15px_rgba(195,125,70,0.4)]"
                                                    title="נסה שוב"
                                                >
                                                    <RefreshCw className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
            </div>
        </main>
    );
}
