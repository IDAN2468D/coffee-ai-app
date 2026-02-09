'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Coffee, Plus, ArrowLeft } from 'lucide-react';
import Navbar from "@/components/TempNavbar";

interface Blend {
    id: string;
    name: string;
    base: string;
    milk: string;
    flavor: string;
    createdAt: string;
}

export default function MyBlendListClient({ initialBlends }: { initialBlends: Blend[] }) {
    const router = useRouter();
    const [blends, setBlends] = useState<Blend[]>(initialBlends);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('האם אתה בטוח שברצונך למחוק את הבלנד הזה?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/my-blend/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setBlends(blends.filter(blend => blend.id !== id));
            } else {
                alert('שגיאה במחיקת הבלנד');
            }
        } catch (error) {
            console.error('Error deleting blend:', error);
            alert('אירעה שגיאה');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-24">

                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div className="space-y-2 text-center md:text-right">
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C37D46] to-[#8B4513]">
                            הבלנדים שלי
                        </h1>
                        <p className="text-white/40 font-light">
                            כל היצירות שלך במקום אחד
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/my-blend')}
                        className="bg-[#C37D46] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#A66330] transition-colors shadow-lg shadow-[#C37D46]/20"
                    >
                        <Plus className="w-5 h-5" />
                        צור בלנד חדש
                    </button>
                </div>

                {blends.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <Coffee className="w-16 h-16 mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-bold text-white/60 mb-2">עדיין אין לך בלנדים שמורים</h3>
                        <p className="text-white/40 mb-8">זה הזמן ליצור את הבלנד הראשון שלך!</p>
                        <button
                            onClick={() => router.push('/my-blend')}
                            className="text-[#C37D46] font-bold hover:underline"
                        >
                            עבור ליוצר הבלנדים
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blends.map((blend) => (
                            <div key={blend.id} className="group bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#C37D46]/50 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C37D46]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="bg-[#C37D46]/10 p-3 rounded-xl">
                                        <Coffee className="w-6 h-6 text-[#C37D46]" />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(blend.id)}
                                        disabled={deletingId === blend.id}
                                        className="text-white/20 hover:text-red-500 transition-colors p-2"
                                        title="מחק בלנד"
                                    >
                                        {deletingId === blend.id ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <h3 className="text-xl font-serif font-bold text-white mb-2 truncate" title={blend.name}>
                                    {blend.name}
                                </h3>

                                <div className="space-y-2 text-sm text-white/60 mb-6">
                                    <div className="flex justify-between">
                                        <span>בסיס:</span>
                                        <span className="text-white">{blend.base}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>חלב:</span>
                                        <span className="text-white">{blend.milk === 'None' ? 'ללא' : blend.milk}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>טעם:</span>
                                        <span className="text-white">{blend.flavor === 'None' ? 'ללא' : blend.flavor}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-white/30">
                                    <span>{new Date(blend.createdAt).toLocaleDateString('he-IL')}</span>
                                    {/* Future: Add 'Order Now' button here */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
