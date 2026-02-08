'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/AppNavbar';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Coffee, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BeanRaterPage() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!image) return;
        setLoading(true);
        try {
            const res = await fetch('/api/vision/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image, type: 'beans' })
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
            alert('שגיאה בניתוח התמונה');
        } finally {
            setLoading(false);
        }
    };

    const triggerUpload = () => fileInputRef.current?.click();

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mb-12"
                >
                    <span className="inline-block px-4 py-1 rounded-full bg-[#C37D46]/10 text-[#C37D46] font-bold text-sm tracking-wider uppercase">
                        AI Quality Control
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-[#2D1B14] mb-4 font-serif">
                        בדיקת איכות קפה
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        צלם את הפולים שקנית, והבינה המלאכותית שלנו תנתח את רמת הקלייה, האיכות, ותחפש פגמים.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <div
                            onClick={triggerUpload}
                            className={`relative aspect-square rounded-3xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-white shadow-xl ${image ? 'border-[#C37D46] border-solid' : 'border-stone-300 hover:border-[#C37D46] hover:bg-orange-50'
                                }`}
                        >
                            {image ? (
                                <img src={image} alt="Coffee Beans" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-stone-400 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
                                        <Camera className="w-10 h-10" />
                                    </div>
                                    <span className="text-lg font-medium">לחץ להעלאת תמונה</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {image && !loading && !result && (
                            <button
                                onClick={analyzeImage}
                                className="w-full py-4 bg-[#2D1B14] text-white rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                נתח איכות
                            </button>
                        )}

                        {loading && (
                            <div className="w-full py-4 bg-stone-100 text-stone-500 rounded-xl font-bold text-xl flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                מנתח נתונים...
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 min-h-[400px] flex flex-col relative overflow-hidden" dir="rtl">
                        {!result ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-stone-300 space-y-4">
                                <Coffee className="w-24 h-24 opacity-20" />
                                <p className="text-lg">התוצאות יופיעו כאן</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8 text-right"
                            >
                                <div className="flex items-center justify-between border-b border-stone-100 pb-6">
                                    <div>
                                        <span className="text-sm text-stone-400 font-bold uppercase block mb-1">ציון איכות</span>
                                        <span className="text-6xl font-black text-[#2D1B14]">{result.qualityScore}</span>
                                        <span className="text-2xl text-stone-300 font-thin">/100</span>
                                    </div>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${result.qualityScore >= 80 ? 'border-green-500 text-green-500 bg-green-50' :
                                        result.qualityScore >= 60 ? 'border-yellow-500 text-yellow-500 bg-yellow-50' :
                                            'border-red-500 text-red-500 bg-red-50'
                                        }`}>
                                        <Trophy className="w-10 h-10" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-stone-50 p-4 rounded-xl">
                                        <span className="text-xs text-stone-400 font-bold uppercase block mb-2">רמת קלייה</span>
                                        <div className="text-xl font-bold text-[#2D1B14]">{result.roastLevel}</div>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl">
                                        <span className="text-xs text-stone-400 font-bold uppercase block mb-2">טעמים</span>
                                        <div className="text-sm font-medium text-[#2D1B14]">{result.tastingNotes}</div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs text-stone-400 font-bold uppercase block mb-3">פגמים שזוהו</span>
                                    {result.defects && (Array.isArray(result.defects) ? result.defects : [result.defects]).length > 0 && (Array.isArray(result.defects) ? result.defects : [result.defects])[0] !== 'none' ? (
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(result.defects) ? result.defects : [result.defects]).map((defect: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {defect}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                                            <CheckCircle size={18} />
                                            <span className="font-bold">ללא פגמים נראים לעין</span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#C37D46]/10 p-6 rounded-2xl border border-[#C37D46]/20">
                                    <span className="text-xs text-[#C37D46] font-bold uppercase block mb-2">המלצת הבריסטה</span>
                                    <p className="text-[#2D1B14] font-medium leading-relaxed">
                                        "{result.advice}"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
