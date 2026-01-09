'use client';

import React, { useEffect, useState } from 'react';
import { Coffee, User, Calendar, Share2, Download, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
    }, []);

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

            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
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
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
