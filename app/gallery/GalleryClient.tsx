'use client';

import React, { useEffect, useState } from 'react';
import { Coffee, User, Calendar, Share2, Download, Heart, X, Sparkles, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { Product } from '@/lib/products';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function GalleryPage() {
    const { data: session } = useSession();
    const { addItem } = useCart();
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = () => {
        fetch('/api/gallery')
            .then(res => res.json())
            .then(data => {
                setImages(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const handleCreateImage = async () => {
        if (!prompt.trim() || !session) {
            alert('אנא התחבר והכנס תיאור לתמונה');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (data.success) {
                // Refresh gallery to show new image
                fetchGallery();
                setShowCreateModal(false);
                setPrompt('');
                alert('התמונה נוצרה בהצלחה! 🎨');
            } else {
                alert(data.error || 'שגיאה ביצירת התמונה');
            }
        } catch (error) {
            console.error(error);
            alert('משהו השתבש');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-coffee.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
                <Coffee className="w-12 h-12 text-[#2D1B14] animate-bounce opacity-20" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] pb-24" dir="rtl">
            <Navbar />
            <header className="bg-[#2D1B14] py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <img src="https://www.transparenttextures.com/patterns/coffee-beans.png" alt="Pattern" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tight"
                    >
                        גלריית הקהילה
                    </motion.h1>
                    <p className="text-stone-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        אוסף נבחר של יצירות מופת של קפה שנוצרו על ידי קהילת חולמי הקפה הדיגיטלית שלנו ברחבי העולם.
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 mb-20">
                {/* Challenge Banner */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#C37D46] rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-block px-4 py-1 bg-black/20 rounded-full backdrop-blur-md text-xs font-black uppercase tracking-widest mb-4">
                            אתגר השבוע
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold">☕ קפה בחלל החיצון</h2>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            השבוע אנחנו מזמינים אתכם ליצור תמונות של בתי קפה, כוסות אספרסו, ופולים מרחפים ברחבי הגלקסיה. היצירה המקורית ביותר תזכה ב-500 נקודות!
                        </p>
                        <button
                            onClick={() => {
                                if (!session) {
                                    alert('אנא התחבר כדי ליצור תמונות');
                                    return;
                                }
                                setShowCreateModal(true);
                                setPrompt('קפה בחלל החיצון'); // Pre-fill with challenge theme
                            }}
                            className="inline-block bg-white text-[#C37D46] px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform mt-4"
                        >
                            התחל ליצור עכשיו
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {images.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-300/20 group border border-stone-100 flex flex-col"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={img.url}
                                    alt={img.prompt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                    <div className="flex space-x-3 space-x-reverse">
                                        <button
                                            onClick={() => handleDownload(img.url, img.prompt)}
                                            className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all"
                                            title="הורד תמונה"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all"
                                            title="שתף"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button className="p-4 bg-[#CAB3A3] rounded-2xl text-[#2D1B14] shadow-lg hover:bg-white transition-colors">
                                        <Heart className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-10 space-y-6 flex-grow text-right">
                                <p className="text-[#2D1B14] font-serif font-bold text-xl leading-relaxed italic line-clamp-2">
                                    "{img.prompt}"
                                </p>
                                <div className="pt-6 border-t border-stone-50 flex items-center justify-between">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                        <div className="w-10 h-10 rounded-2xl bg-[#8B4513]/5 flex items-center justify-center">
                                            <User className="w-5 h-5 text-[#8B4513]" />
                                        </div>
                                        <span className="text-xs font-black text-stone-400 uppercase tracking-widest truncate max-w-[120px]">
                                            {img.user?.name || 'אמן קפה'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse text-stone-300">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {new Date(img.createdAt).toLocaleDateString('he-IL')}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const customMug: Product = {
                                            id: `custom-mug-${img.id}`,
                                            name: 'ספל בעיצוב אישי',
                                            description: `ספל קרמיקה איכותי עם הדפסה של "${img.prompt}"`,
                                            price: 25,
                                            image: img.url,
                                            category: 'Equipment'
                                        };
                                        addItem(customMug);
                                        // Optional: Add toast or feedback
                                    }}
                                    className="w-full mt-4 bg-[#2D1B14] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#C37D46] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Coffee className="w-4 h-4" />
                                    הדפס על ספל - ₪25
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => !isGenerating && setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl"
                            dir="rtl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#C37D46] rounded-2xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-[#2D1B14]">צור תמונת AI</h3>
                                </div>
                                {!isGenerating && (
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="w-10 h-10 rounded-xl hover:bg-stone-100 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5 text-stone-400" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#2D1B14] mb-3">
                                        תאר את התמונה שתרצה ליצור
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        disabled={isGenerating}
                                        placeholder="לדוגמה: קפה אספרסו מרחף בחלל החיצון עם כוכבים ברקע..."
                                        className="w-full h-32 bg-stone-50 border-2 border-stone-200 focus:border-[#C37D46] rounded-2xl p-4 text-sm resize-none outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>

                                <button
                                    onClick={handleCreateImage}
                                    disabled={isGenerating || !prompt.trim()}
                                    className="w-full bg-[#C37D46] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#A66330] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            יוצר תמונה...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            צור תמונה
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-stone-400 text-center">
                                    התמונה תיווצר ותתווסף לגלריה הציבורית
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
