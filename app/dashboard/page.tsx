'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Coffee,
    Heart,
    Image as ImageIcon,
    ShoppingBag,
    TrendingUp,
    Star,
    Clock,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [myImages, setMyImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        } else if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status, router]);

    const fetchDashboardData = async () => {
        try {
            // Fetch images
            const imgRes = await fetch('/api/my-images');
            const imgData = await imgRes.json();
            setMyImages(imgData);

            // Mock stats for now (In real app, fetch from specialized API)
            setStats({
                totalOrders: 0,
                favoriteCategory: "Latte Art",
                creationsCount: imgData.length,
                points: 150
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
                <Coffee className="w-12 h-12 text-[#2D1B14] animate-spin opacity-20" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-stone-100 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-serif font-bold text-[#2D1B14]">
                            Welcome back, <span className="text-[#8B4513]">{session?.user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-stone-400 font-light text-lg">Your personal coffee roastery dashboard.</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">Roast Rewards</p>
                            <div className="flex items-center space-x-2 text-[#8B4513]">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-2xl font-black">{stats?.points} PTS</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border-2 border-white shadow-sm">
                            <img src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name}&background=2D1B14&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Creations', value: stats?.creationsCount, icon: ImageIcon, color: 'bg-blue-500' },
                        { label: 'Favorite Style', value: stats?.favoriteCategory, icon: Heart, color: 'bg-red-500' },
                        { label: 'Orders', value: stats?.totalOrders, icon: ShoppingBag, color: 'bg-green-500' },
                        { label: 'XP Level', value: 'Barista II', icon: TrendingUp, color: 'bg-purple-500' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-stone-200/40 border border-stone-100 flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">{item.label}</p>
                                <p className="text-2xl font-black text-[#2D1B14]">{item.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${item.color} text-white shadow-lg`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Recent Creations */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-serif font-bold text-[#2D1B14]">Your AI Collections</h2>
                            <Link href="/ai-barista" className="text-xs font-bold uppercase tracking-widest text-[#8B4513] hover:underline flex items-center">
                                Create New <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {myImages.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-stone-200">
                                <Sparkles className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                                <p className="text-stone-400 font-medium">Your gallery is quiet. Unleash the AI Barista!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {myImages.slice(0, 4).map((img) => (
                                    <div key={img.id} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                                        <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                            <p className="text-white text-xs font-medium line-clamp-1 italic opacity-80">"{img.prompt}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Recent Activity */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-serif font-bold text-[#2D1B14]">Brew Log</h2>
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm space-y-6">
                            {[
                                { title: 'Account Created', time: 'Just now', icon: Clock },
                                { title: 'First Bonus Points', time: 'Just now', icon: Star },
                            ].map((activity, idx) => (
                                <div key={idx} className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0">
                                        <activity.icon className="w-5 h-5 text-stone-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-[#2D1B14]">{activity.title}</p>
                                        <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-4 border-2 border-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:bg-stone-50 transition-all">
                                View Full Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
