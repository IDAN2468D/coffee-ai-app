'use client';

import React, { useState, useRef } from 'react';
import Navbar from "@/components/AppNavbar";
import { Upload, Camera, Sparkles, Share2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FortunePage() {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ shape: string, fortune: string } | null>(null);
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

    return (
        <main className="min-h-screen bg-[#2D1B14] text-[#FDFCF0] font-sans overflow-x-hidden selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <Navbar />

            <div className="max-w-xl mx-auto px-6 py-12 md:py-24 text-center">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/20 px-4 py-2 rounded-full border border-[#C37D46]/40 backdrop-blur-sm">
                        <Sparkles className="w-5 h-5 text-[#C37D46]" />
                        <span className="text-sm font-bold tracking-widest uppercase text-[#C37D46]">AI Coffee Fortune Teller</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-black bg-gradient-to-r from-[#FDFCF0] to-[#C37D46] bg-clip-text text-transparent pb-2">
                        מגדת העתידות בקפה
                    </h1>
                    <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
                        צלמו את תחתית הכוס שלכם (או הקצף) ותנו לבינה המלאכותית לגלות מה צופן לכם העתיד...
                    </p>
                </motion.div>

                <div className="relative w-full aspect-square max-w-sm mx-auto mb-12">
                    {/* Main Circle Container */}
                    <div className="absolute inset-0 border-4 border-[#C37D46]/30 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-2 border-2 border-dashed border-[#C37D46]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                    <div className="relative w-full h-full rounded-full bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl flex items-center justify-center group border border-white/5">
                        <AnimatePresence mode="wait">
                            {!image ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6 p-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#C37D46] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <Camera className="w-20 h-20 text-[#C37D46]/80" />
                                    </div>
                                    <div className="space-y-4 w-full">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-[#FDFCF0] text-[#2D1B14] px-8 py-4 rounded-xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Upload className="w-5 h-5" />
                                            העלה תמונה
                                        </button>
                                        <p className="text-sm text-white/40">או צלם ישירות מהמצלמה</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative w-full h-full"
                                >
                                    <img src={image} alt="Coffee Cup" className="w-full h-full object-cover opacity-60" />

                                    {/* Loading Overlay */}
                                    {isLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                                            <div className="w-16 h-16 border-4 border-[#C37D46] border-t-transparent rounded-full animate-spin mb-4" />
                                            <p className="text-xl font-serif text-white animate-pulse text-center">
                                                הרוחות מנתחות את הסימנים...
                                            </p>
                                        </div>
                                    )}

                                    {/* Result Overlay */}
                                    {result && !isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-8 text-center"
                                        >
                                            <div className="mb-2">
                                                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-pulse" />
                                            </div>
                                            <h3 className="text-[#C37D46] font-bold text-lg mb-4 uppercase tracking-wider">
                                                {result.shape}
                                            </h3>
                                            <p className="text-xl md:text-2xl font-serif leading-relaxed text-[#FDFCF0]">
                                                "{result.fortune}"
                                            </p>
                                            <div className="mt-8 flex gap-3">
                                                <button
                                                    onClick={() => { setImage(null); setResult(null); }}
                                                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                                    title="נסה שוב"
                                                >
                                                    <RefreshCw className="w-5 h-5" />
                                                </button>
                                                {/* Share would go here */}
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
