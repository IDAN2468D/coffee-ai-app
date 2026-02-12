'use client';

import React, { useEffect, useState, useOptimistic, useTransition } from 'react';
import { Coffee, User, Calendar, Share2, Download, Heart, X, Sparkles, Loader, Globe, Lock, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../../lib/store';
import { Product } from '@/lib/products';
import { useSession } from 'next-auth/react';
import Navbar from '../../components/TempNavbar';
import { toggleLike, addComment } from '../actions/gallery';

interface Comment {
    id: string;
    text: string;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface Like {
    userId: string;
}

interface CoffeeImage {
    id: string;
    url: string;
    prompt: string;
    isPublic: boolean;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
    likes: Like[];
    comments: Comment[];
    _count?: {
        likes: number;
        comments: number;
    };
}

export default function GalleryPage() {
    const { data: session } = useSession();
    const { addItem } = useCart();
    const [images, setImages] = useState<CoffeeImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'community' | 'mine'>('community');
    const [expandedImageId, setExpandedImageId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isPending, startTransition] = useTransition();

    const [optimisticImages, addOptimisticUpdate] = useOptimistic(
        images,
        (state: CoffeeImage[], update: { type: 'like'; imageId: string; userId: string } | { type: 'comment'; imageId: string; comment: Comment }) => {
            return state.map(img => {
                if (img.id === update.imageId) {
                    if (update.type === 'like') {
                        const hasLiked = img.likes?.some(like => like.userId === update.userId) ?? false;
                        const newLikes = hasLiked
                            ? img.likes?.filter(like => like.userId !== update.userId) ?? []
                            : [...(img.likes ?? []), { userId: update.userId }];
                        return { ...img, likes: newLikes };
                    }
                    if (update.type === 'comment') {
                        return { ...img, comments: [update.comment, ...(img.comments ?? [])] };
                    }
                }
                return img;
            });
        }
    );

    useEffect(() => {
        fetchGallery();
    }, [activeTab]);

    const fetchGallery = () => {
        setIsLoading(true);
        const endpoint = activeTab === 'community' ? '/api/gallery/public' : '/api/gallery';

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setImages(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setImages([]);
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
                if (activeTab === 'mine') {
                    fetchGallery();
                } else {
                    setActiveTab('mine');
                }
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

    const handleTogglePrivacy = async (imageId: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/gallery/toggle-privacy', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageId, isPublic: !currentStatus })
            });

            if (res.ok) {
                setImages(prev => prev.map(img =>
                    img.id === imageId ? { ...img, isPublic: !currentStatus } : img
                ));
            }
        } catch (error) {
            console.error(error);
            alert('שגיאה בעדכון הגדרות פרטיות');
        }
    };

    const handleLike = async (imageId: string) => {
        if (!session) {
            alert('אנא התחבר כדי לעשות לייק');
            return;
        }

        const userId = (session.user as any).id;
        addOptimisticUpdate({ type: 'like', imageId, userId });

        const result = await toggleLike(imageId);
        if (!result.success) {
            console.error('Like failed', result.error);
            fetchGallery(); // Sync back on error
        }
    };

    const handleComment = async (imageId: string) => {
        if (!session || !commentText.trim()) return;

        const dummyComment: Comment = {
            id: `temp-${Date.now()}`,
            text: commentText,
            createdAt: new Date().toISOString(),
            user: {
                name: session.user?.name ?? 'אנונימי',
                image: session.user?.image ?? null,
            }
        };

        const currentText = commentText;
        setCommentText('');

        startTransition(async () => {
            addOptimisticUpdate({ type: 'comment', imageId, comment: dummyComment });
            const result = await addComment(imageId, currentText);
            if (!result.success) {
                console.error('Comment failed', result.error);
                alert('שגיאה בשליחת תגובה');
                setCommentText(currentText); // Restore text
                fetchGallery(); // Sync back
            }
        });
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-coffee.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                        שתפו, הגיבו וקבלו השראה מיצירות AI של חובבי קפה אחרים.
                    </p>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setActiveTab('community')}
                            className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'community'
                                ? 'bg-[#C37D46] text-white shadow-lg scale-105'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Globe size={18} />
                            הקהילה
                        </button>
                        {session && (
                            <button
                                onClick={() => setActiveTab('mine')}
                                className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'mine'
                                    ? 'bg-[#C37D46] text-white shadow-lg scale-105'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                <User size={18} />
                                היצירות שלי
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 mb-20">
                {activeTab === 'community' && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#C37D46] rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl mb-12"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-block px-4 py-1 bg-black/20 rounded-full backdrop-blur-md text-xs font-black uppercase tracking-widest mb-4">
                                חדש! Community Feed
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold">הצטרפו לשיחה</h2>
                            <p className="text-white/80 text-lg max-w-2xl mx-auto">
                                אהבתם יצירה? פרגנו בלייק! יש לכם רעיון לשיפור? כתבו תגובה!
                            </p>
                            <button
                                onClick={() => {
                                    if (!session) {
                                        alert('אנא התחבר כדי ליצור תמונות');
                                        return;
                                    }
                                    setShowCreateModal(true);
                                    setPrompt('');
                                }}
                                className="inline-block bg-white text-[#C37D46] px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform mt-4"
                            >
                                צור יצירה חדשה
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-20">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Coffee className="w-12 h-12 text-[#C37D46] animate-bounce opacity-50" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {optimisticImages.length > 0 ? optimisticImages.map((img, idx) => {
                            const isLiked = session ? img.likes?.some(like => like.userId === (session.user as any).id) ?? false : false;

                            return (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group border border-stone-100 flex flex-col"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={img.url}
                                            alt={img.prompt}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                            <div className="flex space-x-3 space-x-reverse">
                                                <button
                                                    onClick={() => handleDownload(img.url, img.prompt)}
                                                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-black transition-all"
                                                    title="הורד תמונה"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {activeTab === 'mine' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTogglePrivacy(img.id, img.isPublic);
                                                    }}
                                                    className={`p-3 backdrop-blur-md rounded-xl transition-all flex items-center gap-2 ${img.isPublic
                                                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500 hover:text-white'
                                                        : 'bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white'
                                                        }`}
                                                >
                                                    {img.isPublic ? <Globe size={18} /> : <Lock size={18} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4 flex-grow text-right bg-white relative">
                                        {/* User Info & Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                                                    {img.user?.image ? (
                                                        <img src={img.user.image} alt={img.user.name || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-stone-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-stone-700">
                                                        {img.user?.name || 'אנונימי'}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400">
                                                        {new Date(img.createdAt).toLocaleDateString('he-IL')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md rounded-2xl p-2 border border-white/50 shadow-sm">
                                                <button
                                                    onClick={() => handleLike(img.id)}
                                                    className={`flex items-center gap-1 text-xs font-bold transition-colors p-2 rounded-xl hover:bg-white/50 ${isLiked ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                                                        }`}
                                                >
                                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                                    <span>{img.likes?.length ?? 0}</span>
                                                </button>
                                                <div className="w-px h-4 bg-stone-200" />
                                                <button
                                                    onClick={() => setExpandedImageId(expandedImageId === img.id ? null : img.id)}
                                                    className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-[#C37D46] transition-colors p-2 rounded-xl hover:bg-white/50"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                    <span>{img.comments?.length ?? 0}</span>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-[#2D1B14] font-medium text-sm leading-relaxed line-clamp-2">
                                            "{img.prompt}"
                                        </p>

                                        {/* Comments Section (Expandable) */}
                                        <AnimatePresence>
                                            {expandedImageId === img.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-stone-100 pt-4 space-y-4 overflow-hidden"
                                                >
                                                    <div className="max-h-40 overflow-y-auto space-y-3 custom-scrollbar">
                                                        {!img.comments || img.comments.length === 0 ? (
                                                            <p className="text-center text-xs text-stone-400 italic py-2">אין תגובות עדיין. היה הראשון להגיב!</p>
                                                        ) : (
                                                            img.comments.map(comment => (
                                                                <div key={comment.id} className="bg-stone-50 p-3 rounded-xl text-xs space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-bold text-[#2D1B14]">{comment.user.name || 'אנונימי'}</span>
                                                                        <span className="text-[10px] text-stone-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p className="text-stone-600">{comment.text}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>

                                                    {session && (
                                                        <div className="flex gap-2 bg-stone-50/50 backdrop-blur-sm p-2 rounded-2xl border border-stone-200/50">
                                                            <input
                                                                type="text"
                                                                value={commentText}
                                                                onChange={(e) => setCommentText(e.target.value)}
                                                                placeholder="כתוב תגובה..."
                                                                className="flex-grow bg-transparent px-3 py-2 text-sm focus:outline-none"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleComment(img.id);
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => handleComment(img.id)}
                                                                disabled={isPending || !commentText.trim()}
                                                                className="bg-[#C37D46] text-white p-2 rounded-xl hover:bg-[#A06438] disabled:opacity-50 transition-colors shadow-lg shadow-[#C37D46]/20"
                                                            >
                                                                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

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
                                            }}
                                            className="w-full mt-2 bg-stone-50 text-[#2D1B14] py-3 rounded-xl font-bold text-sm hover:bg-[#C37D46] hover:text-white transition-all flex items-center justify-center gap-2 border border-stone-100"
                                        >
                                            <Coffee className="w-4 h-4" />
                                            הדפס על ספל - ₪25
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div className="col-span-full text-center py-20 opacity-50">
                                <p className="text-xl text-stone-500 font-serif">לא נמצאו תמונות בגלריה זו</p>
                                {activeTab === 'mine' && (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="mt-4 text-[#C37D46] font-bold underline"
                                    >
                                        צור את התמונה הראשונה שלך
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => !isGenerating && setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                            dir="rtl"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C37D46] to-yellow-500" />

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#C37D46]/10 rounded-2xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-[#C37D46]" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-black text-[#2D1B14]">סטודיו ה-AI</h3>
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">צור אומנות ברגע</p>
                                    </div>
                                </div>
                                {!isGenerating && (
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5 text-stone-500" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#2D1B14] mb-3">
                                        מה תרצה לצייר?
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        disabled={isGenerating}
                                        placeholder="לדוגמה: שועל לוגם הפוך בבית קפה פריזאי בגשם..."
                                        className="w-full h-32 bg-stone-50 border-2 border-stone-100 focus:border-[#C37D46] focus:bg-white rounded-2xl p-4 text-base resize-none outline-none transition-all disabled:opacity-50"
                                    />
                                </div>

                                <button
                                    onClick={handleCreateImage}
                                    disabled={isGenerating || !prompt.trim()}
                                    className="w-full bg-[#2D1B14] text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            ה-AI מצייר עבורך...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            צור יצירת מופת
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
