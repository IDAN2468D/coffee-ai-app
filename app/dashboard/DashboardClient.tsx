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
    Crown
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCTS, Product } from '../../lib/products';
import { useCart } from '../../lib/store';

export default function Dashboard({
    initialPoints,
    initialOrders,
    subscription
}: {
    initialPoints: number,
    initialOrders: any[],
    subscription: { tier: string | null, status: string | null, expiry: any | null } | null
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { addItem } = useCart();
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
                favoriteCategory: "אספרסו", // Could be calculated from orders if we wanted to be fancy
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
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
                <Coffee className="w-12 h-12 text-[#2D1B14] animate-spin opacity-20" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] pb-24" dir="rtl">
            {/* Header */}
            <header className="bg-white border-b border-stone-100 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4 text-right">
                        <div className="flex items-center gap-3 flex-row-reverse">
                            <h1 className="text-5xl font-serif font-bold text-[#2D1B14]">
                                ברוך הבא, <span className="text-[#8B4513]">{session?.user?.name?.split(' ')[0]}</span>
                            </h1>
                            {subscription?.tier && (
                                <span className="px-3 py-1 bg-[#C37D46] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-900/20">
                                    {subscription.tier}
                                </span>
                            )}
                        </div>
                        <p className="text-stone-400 font-light text-lg">מרכז השליטה האישי שלך בבית הקלייה הדיגיטלי.</p>
                    </div>
                    <div className="flex items-center space-x-6 space-x-reverse">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-stone-400 hover:text-[#8B4513] transition-colors"
                            title="התנתק"
                        >
                            <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">התנתק</span>
                            <LogOut className="w-5 h-5" />
                        </button>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">נקודות Roast</p>
                            <div className="flex items-center space-x-2 space-x-reverse text-[#8B4513]">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-2xl font-black">{initialPoints} נק׳</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border-2 border-white shadow-sm">
                            <img src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name}&background=2D1B14&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Loyalty Progress */}
                <div className="bg-[#2D1B14] text-white p-6 rounded-3xl shadow-xl mb-8 flex items-center justify-between rtl:space-x-reverse">
                    <div className="flex-1 ml-8">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-70 mb-2">
                            <span>הדרך לקפה חינם</span>
                            <span>{initialPoints} / 500</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((initialPoints / 500) * 100, 100)}%` }}
                                className="h-full bg-gradient-to-r from-[#C37D46] to-[#E8CBAD]"
                            />
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-[#C37D46]" />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'יצירות AI', value: stats?.creationsCount, icon: ImageIcon, color: 'bg-blue-500' },
                        { label: 'סגנון אהוב', value: stats?.favoriteCategory, icon: Heart, color: 'bg-red-500' },
                        { label: 'הזמנות', value: initialOrders.length, icon: ShoppingBag, color: 'bg-green-500' },
                        { label: 'נקודות', value: initialPoints, icon: Star, color: 'bg-amber-500' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-stone-200/40 border border-stone-100 flex items-center justify-between flex-row-reverse"
                        >
                            <div className="space-y-1 text-right">
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
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Recent Orders Section -- REDESIGNED */}
                        <div className="space-y-6 text-right">
                            <div className="flex items-center justify-between flex-row-reverse px-2">
                                <h2 className="text-2xl font-serif font-bold text-[#2D1B14] flex items-center gap-2 flex-row-reverse">
                                    <ShoppingBag className="w-6 h-6 text-[#C37D46]" />
                                    ההזמנות שלי
                                </h2>
                            </div>

                            {initialOrders.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-stone-100 shadow-sm">
                                    <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                                    <p className="text-stone-400">טרם ביצעת הזמנות. זה הזמן לקפה ראשון!</p>
                                    <Link href="/shop" className="inline-block mt-4 text-[#8B4513] font-bold hover:underline">למעבר לחנות &larr;</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(showAllOrders ? initialOrders : initialOrders.slice(0, 3)).map((order) => (
                                        <div key={order.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-md transition-all">
                                            {/* Order Header */}
                                            <div className="flex justify-between items-start mb-4 flex-row-reverse">
                                                <div className="text-right">
                                                    <div className="flex items-center gap-3 flex-row-reverse mb-1">
                                                        <span className="font-mono font-black text-lg text-[#2D1B14] tracking-wider">#{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${order.status === 'COMPLETED'
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                                            }`}>
                                                            {order.status === 'COMPLETED' ? 'הושלם' : 'בטיפול'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-stone-400 font-bold flex items-center gap-1 flex-row-reverse">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(order.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-serif font-black text-2xl text-[#2D1B14]">₪{order.total.toFixed(0)}</span>
                                                </div>
                                            </div>

                                            {/* Items Scroll */}
                                            <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-hide flex-row-reverse">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-3 bg-stone-50/50 border border-stone-100 p-2 pr-2 pl-4 rounded-2xl flex-shrink-0 min-w-[200px]">
                                                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shadow-sm flex-shrink-0 border border-stone-100">
                                                            {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="text-right min-w-0 flex-grow">
                                                            <div className="flex items-center gap-2 flex-row-reverse mb-0.5">
                                                                <p className="text-xs font-bold text-[#2D1B14] truncate">{item.product?.name || 'מוצר'}</p>
                                                                {item.size && (
                                                                    <span className="px-1.5 py-0.5 bg-[#CAB3A3]/20 text-[#8B4513] rounded-md text-[9px] font-black uppercase flex-shrink-0">
                                                                        {item.size === 'S' ? 'S' : item.size === 'M' ? 'M' : 'L'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-stone-400 font-bold">כמות: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {initialOrders.length > 3 && (
                                        <div className="text-center pt-2">
                                            <button
                                                onClick={() => setShowAllOrders(!showAllOrders)}
                                                className="bg-white border border-stone-200 text-stone-500 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#2D1B14] hover:text-white hover:border-[#2D1B14] transition-all shadow-sm"
                                            >
                                                {showAllOrders ? 'הצג פחות' : `צפה בכל ההזמנות (${initialOrders.length})`}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>


                        {/* Recommended Blends - Quick Shop */}
                        <div className="space-y-6 text-right">
                            <div className="flex items-center justify-between flex-row-reverse">
                                <h2 className="text-2xl font-serif font-bold text-[#2D1B14] flex items-center gap-2 flex-row-reverse">
                                    <Coffee className="w-6 h-6 text-[#C37D46]" />
                                    המלצות העונה
                                </h2>
                                <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#8B4513] hover:underline flex items-center flex-row-reverse">
                                    <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                                    לכל המוצרים
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PRODUCTS.slice(4, 7).map((product) => (
                                    <div key={product.id} className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 flex flex-col group hover:shadow-lg transition-all">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-stone-100">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <button
                                                onClick={() => addItem(product)}
                                                className="absolute bottom-2 right-2 bg-white text-[#2D1B14] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                                                title="הוסף לסל"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-start mb-2 rtl:flex-row-reverse">
                                            <h3 className="font-serif font-bold text-[#2D1B14] line-clamp-1">{product.name}</h3>
                                            <span className="font-black text-[#C37D46]">₪{product.price}</span>
                                        </div>
                                        <p className="text-[10px] text-stone-400 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                                        <button
                                            onClick={() => addItem(product)}
                                            className="w-full py-3 bg-[#FDFCF0] hover:bg-[#2D1B14] hover:text-white text-[#2D1B14] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                                        >
                                            הוסף לסל
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Creations */}
                        <div className="space-y-6 text-right">
                            <div className="flex items-center justify-between flex-row-reverse">
                                <h2 className="text-2xl font-serif font-bold text-[#2D1B14] flex items-center gap-2 flex-row-reverse">
                                    <Sparkles className="w-6 h-6 text-[#C37D46]" />
                                    אוסף ה-AI שלך
                                </h2>
                                <Link href="/expert" className="text-xs font-bold uppercase tracking-widest text-[#8B4513] hover:underline flex items-center flex-row-reverse">
                                    <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                                    יצירה חדשה
                                </Link>
                            </div>

                            {myImages.length === 0 ? (
                                <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-stone-200">
                                    <Sparkles className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                                    <p className="text-stone-400 font-medium">הגלריה שלך ריקה. זה הזמן להפעיל את הבריסטה!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {myImages.slice(0, 4).map((img) => (
                                        <div key={img.id} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                                            <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                                                <p className="text-white text-xs font-medium line-clamp-1 italic opacity-80 flex-1 ml-2">"{img.prompt}"</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const customMug: Product = {
                                                            id: `custom-mug-${img.id}`,
                                                            name: 'ספל בעיצוב אישי',
                                                            description: 'הדפסה אישית של יצירת ה-AI שלך על ספל קרמיקה יוקרתי.',
                                                            price: 25,
                                                            image: img.url,
                                                            category: 'Equipment'
                                                        };
                                                        addItem(customMug);
                                                    }}
                                                    className="bg-white/20 hover:bg-white text-white hover:text-[#2D1B14] p-2 rounded-lg backdrop-blur-md transition-all shadow-lg"
                                                    title="קנה כספל"
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

                    {/* Sidebar: Recent Activity */}
                    <div className="space-y-8 text-right">
                        <h2 className="text-2xl font-serif font-bold text-[#2D1B14]">יומן פעילות</h2>
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm space-y-6">
                            {[
                                { title: 'החשבון נוצר', time: 'ממש עכשיו', icon: Clock },
                                { title: 'נקודות בונוס ראשונות', time: 'ממש עכשיו', icon: Star },
                            ].map((activity, idx) => (
                                <div key={idx} className="flex items-start space-x-4 space-x-reverse">
                                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0">
                                        <activity.icon className="w-5 h-5 text-stone-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-[#2D1B14]">{activity.title}</p>
                                        <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setShowAllActivity(!showAllActivity)} className="w-full py-4 border-2 border-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:bg-stone-50 transition-all">{showAllActivity ? 'הצג פחות' : 'צפה בכל הפעילות'}</button>
                        </div>

                        {/* Subscription Management Sidebar Item */}
                        <div className="bg-gradient-to-br from-[#2D1B14] to-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C37D46] rounded-full blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between flex-row-reverse">
                                    <div className={`p-3 rounded-2xl ${subscription?.tier ? 'bg-[#C37D46]/20 text-[#C37D46]' : 'bg-white/10 text-white/40'}`}>
                                        <Crown className="w-6 h-6" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-serif font-black text-xl">המנוי שלי</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">סטטוס מועדון</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {subscription?.tier ? (
                                        <div className="space-y-4">
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                                <div className="text-2xl font-black text-[#C37D46] mb-1">{subscription.tier}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">חבר מועדון פעיל</div>
                                            </div>
                                            <div className="flex justify-between items-center flex-row-reverse text-xs">
                                                <span className="text-white/40">בתוקף עד:</span>
                                                <span className="font-bold">{new Date(subscription.expiry).toLocaleDateString('he-IL')}</span>
                                            </div>
                                            <Link href="/subscription" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-center text-xs font-black uppercase tracking-widest transition-all">
                                                ניהול מנוי
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-sm text-white/60 text-right leading-relaxed">
                                                עדיין לא הצטרפת למועדון המנויים החכם שלנו? חסוך עד 20% בכל הזמנה.
                                            </p>
                                            <Link href="/subscription" className="block w-full py-4 bg-[#C37D46] hover:bg-[#A66330] rounded-2xl text-center text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-900/40">
                                                לצפייה בתוכניות
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


