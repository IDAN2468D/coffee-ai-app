'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
    Sparkles,
    Package,
    Plus,
    Check,
    LogOut,
    Crown,
    Settings,
    User,
    Home,
    Beaker,
    Compass,
    ChefHat
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PRODUCTS, Product } from '../../lib/products';
import { useCartStore } from '@/context/useCartStore';
import LoyaltyTracker from '@/components/LoyaltyTracker';
import type { LoyaltyStatus } from '@/lib/loyalty';

export default function Dashboard({
    initialPoints,
    initialOrders,
    subscription,
    loyaltyStatus
}: {
    initialPoints: number,
    initialOrders: any[],
    subscription: { plan: "FREE" | "BASIC" | "PRO" | null, status: string | null, expiry: any | null } | null,
    loyaltyStatus: LoyaltyStatus | null
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [stats, setStats] = useState<any>(null);
    const [myImages, setMyImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showAllActivity, setShowAllActivity] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        } else if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status, router]);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        window.location.href = '/auth/login';
    };

    const fetchDashboardData = async () => {
        try {
            // Fetch images
            const imgRes = await fetch('/api/my-images');
            const imgData = await imgRes.json();
            setMyImages(imgData);

            // Calculate stats from real data
            setStats({
                totalOrders: initialOrders.length,
                favoriteCategory: "אספרסו",
                creationsCount: imgData.length,
                points: initialPoints
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <Coffee className="w-12 h-12 text-[#C37D46] animate-spin opacity-50" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")`,
                backgroundSize: '100px'
            }}></div>

            {/* Header / Hero Section */}
            <header className="relative z-10 pt-32 pb-20 bg-gradient-to-b from-[#1a1a1a] to-[#0F0F0F] border-b border-white/5 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        {/* User Greeting */}
                        <div className="space-y-2 text-right w-full md:w-auto">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 flex-row-reverse justify-end"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#C37D46] shadow-lg shadow-[#C37D46]/20 relative">
                                        <Image
                                            src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name}&background=1a1a1a&color=C37D46`}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {subscription?.plan && (
                                        <div className="absolute -bottom-2 -left-2 bg-[#C37D46] text-white p-1.5 rounded-lg shadow-lg">
                                            <Crown className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <h1 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight mb-1">
                                        ברוך הבא, <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#C37D46] to-[#E8CBAD]">{session?.user?.name?.split(' ')[0]}</span>
                                    </h1>
                                    <p className="text-white/40 font-medium text-lg">הבריסטה האישי שלך מוכן לפעולה.</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Action Stats */}
                        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                            <Link href="/" className="group flex items-center gap-2 px-4 py-3 bg-[#4b3621] hover:bg-[#5e442b] text-[#E8CBAD] rounded-2xl transition-all shadow-lg hover:shadow-[#4b3621]/20">
                                <Home className="w-5 h-5" />
                                <span className="font-bold hidden sm:inline">דף הבית</span>
                            </Link>

                            <div className="text-right bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">נקודות Roast</span>
                                <div className="flex items-center gap-2 text-[#C37D46]">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="text-2xl font-black font-mono">{initialPoints}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="group p-4 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-2xl transition-all"
                                title="התנתק"
                            >
                                <LogOut className="w-6 h-6 text-white/40 group-hover:text-red-400 transtion-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'יצירות AI', value: stats?.creationsCount || 0, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { label: 'סגנון אהוב', value: stats?.favoriteCategory || '-', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
                        { label: 'הזמנות', value: initialOrders.length, icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10' },
                        { label: 'סטטוס', value: subscription?.plan || 'Free', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#1a1a1a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl hover:bg-[#252525] transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-4 flex-row-reverse">
                                <div className={`p-3 rounded-xl ${item.bg}`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <span className={`text-3xl font-black text-white group-hover:scale-110 transition-transform duration-300`}>{item.value}</span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/30 text-right">{item.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* VIP Loyalty Tracker */}
                        {loyaltyStatus && <LoyaltyTracker status={loyaltyStatus} />}

                        {/* Recent Orders */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between flex-row-reverse px-2">
                                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3 flex-row-reverse">
                                    <Package className="w-6 h-6 text-[#C37D46]" />
                                    הזמנות אחרונות
                                </h2>
                            </div>

                            {initialOrders.length === 0 ? (
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-12 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag className="w-8 h-8 text-white/20" />
                                    </div>
                                    <p className="text-white/40 font-medium">ההיסטוריה שלך ריקה. זה הזמן להתחיל!</p>
                                    <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-[#C37D46] hover:bg-[#b06c3a] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#C37D46]/20">
                                        למעבר לחנות
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(showAllOrders ? initialOrders : initialOrders.slice(0, 3)).map((order) => (
                                        <div key={order.id} className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-white/5 hover:border-[#C37D46]/30 hover:bg-[#202020] transition-all group">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-right md:text-left flex-row-reverse">
                                                <div className="flex-1 text-right">
                                                    <div className="flex items-center gap-3 flex-row-reverse mb-2">
                                                        <span className="font-mono font-black text-lg text-white tracking-wider">#{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${order.status === 'COMPLETED'
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                            }`}>
                                                            {order.status === 'COMPLETED' ? 'הושלם' : 'בטיפול'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-white/40 font-medium flex-row-reverse">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(order.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div className="font-serif font-black text-2xl text-white">₪{order.total.toFixed(0)}</div>
                                            </div>

                                            {/* Items */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5 flex-row-reverse">
                                                        <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden relative">
                                                            {item.product?.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover opacity-80" />}
                                                        </div>
                                                        <div className="flex-1 text-right min-w-0">
                                                            <div className="text-sm font-bold text-white/90 truncate">{item.product?.name}</div>
                                                            <div className="text-[10px] text-white/40">RX: {item.quantity} | {item.size || 'STD'}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Creations Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between flex-row-reverse px-2">
                                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3 flex-row-reverse">
                                    <Sparkles className="w-6 h-6 text-[#C37D46]" />
                                    הגלריה שלך
                                </h2>
                                <Link href="/expert" className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all">
                                    <Plus className="w-5 h-5" />
                                </Link>
                            </div>

                            {myImages.length === 0 ? (
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 text-center">
                                    <p className="text-white/40 text-sm">עדיין אין יצירות בגלריה.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {myImages.slice(0, 4).map((img) => (
                                        <div key={img.id} className="group aspect-square rounded-2xl overflow-hidden relative border border-white/10">
                                            <Image src={img.url} alt="User creation" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Add to cart logic here
                                                        const customMug: Product = {
                                                            id: `custom-mug-${img.id}`,
                                                            name: 'ספל בעיצוב אישי',
                                                            description: 'הדפסה אישית של יצירת ה-AI שלך.',
                                                            price: 25,
                                                            image: img.url,
                                                            category: 'Equipment'
                                                        };
                                                        addItem(customMug);
                                                    }}
                                                    className="bg-[#C37D46] text-white p-2 rounded-lg shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Shop */}
                        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-6 border border-white/5 shadow-xl">
                            <div className="flex items-center justify-between mb-6 flex-row-reverse">
                                <h3 className="text-xl font-serif font-bold text-white">טעמים חדשים</h3>
                                <Link href="/shop" className="text-xs text-[#C37D46] font-bold uppercase tracking-widest hover:text-white transition-colors">לחנות</Link>
                            </div>
                            <div className="space-y-4">
                                {PRODUCTS.slice(4, 7).map((product) => (
                                    <div key={product.id} className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl hover:bg-black/40 transition-colors group flex-row-reverse text-right">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 relative">
                                            <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                                            <p className="text-xs text-white/40 truncate">{product.category}</p>
                                        </div>
                                        <button
                                            onClick={() => addItem(product)}
                                            className="w-10 h-10 rounded-xl bg-[#C37D46] hover:bg-[#b06c3a] flex items-center justify-center text-white shadow-lg shadow-[#C37D46]/20 transition-all active:scale-95"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Premium Services */}
                        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-6 border border-amber-500/20 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-2 mb-6 flex-row-reverse">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <h3 className="text-xl font-serif font-bold text-white">שירותי פרימיום</h3>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <Link href="/alchemy" className="flex items-center justify-between p-4 rounded-2xl bg-black/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all flex-row-reverse">
                                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                                        <div className="p-2 rounded-lg bg-amber-500/20"><Beaker className="w-4 h-4 text-amber-500" /></div>
                                        <div>
                                            <div className="text-sm font-bold text-white">מעבדת האלכימיה</div>
                                            <div className="text-[10px] text-white/40">זיקוק תערובות AI</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20" />
                                </Link>

                                <Link href="/odyssey" className="flex items-center justify-between p-4 rounded-2xl bg-black/40 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all flex-row-reverse">
                                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                                        <div className="p-2 rounded-lg bg-blue-500/20"><Compass className="w-4 h-4 text-blue-400" /></div>
                                        <div>
                                            <div className="text-sm font-bold text-white">מסע הקפה</div>
                                            <div className="text-[10px] text-white/40">מפת עולם אינטראקטיבית</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20" />
                                </Link>

                                <Link href="/brewmaster" className="flex items-center justify-between p-4 rounded-2xl bg-black/40 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 transition-all flex-row-reverse">
                                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                                        <div className="p-2 rounded-lg bg-orange-500/20"><ChefHat className="w-4 h-4 text-orange-400" /></div>
                                        <div>
                                            <div className="text-sm font-bold text-white">עוזר חליטה חכם</div>
                                            <div className="text-[10px] text-white/40">מדריך חליטה וטיימר</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20" />
                                </Link>
                            </div>
                        </div>

                        {/* Subscription Card */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C37D46] to-[#8B4513] p-8 text-center text-white shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                            <Crown className="w-12 h-12 mx-auto mb-4 text-white/80" />
                            <h3 className="text-2xl font-serif font-black mb-2">מועדון ה-Pro</h3>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                {subscription?.plan ? 'המשך ליהנות מהטבות בלעדיות וממשלוחים חינם.' : 'הצטרף למועדון וקבל 20% הנחה על כל הזמנה ומשלוחים חינם.'}
                            </p>
                            <Link href="/subscription" className="block w-full py-3 bg-white text-[#8B4513] font-bold uppercase tracking-widest rounded-xl hover:bg-stone-100 transition-colors shadow-lg">
                                {subscription?.plan ? 'ניהול מנוי' : 'הצטרף עכשיו'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
