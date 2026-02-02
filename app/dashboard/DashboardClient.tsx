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
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCTS, Product } from '@/lib/products';
import { useCart } from '@/lib/store';

export default function Dashboard({ initialPoints, initialOrders }: { initialPoints: number, initialOrders: any[] }) {
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
        await signOut({ callbackUrl: '/auth' });
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
                        <h1 className="text-5xl font-serif font-bold text-[#2D1B14]">
                            ברוך הבא, <span className="text-[#8B4513]">{session?.user?.name?.split(' ')[0]}</span>
                        </h1>
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

                        {/* Recent Orders Section -- ADDED */}
                        <div className="space-y-6 text-right">
                            <div className="flex items-center justify-between flex-row-reverse">
                                <h2 className="text-2xl font-serif font-bold text-[#2D1B14] flex items-center gap-2 flex-row-reverse">
                                    <ShoppingBag className="w-6 h-6 text-[#C37D46]" />
                                    ההזמנות שלי
                                </h2>
                            </div>

                            {initialOrders.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-stone-100 shadow-sm">
                                    <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                                    <p className="text-stone-400">טרם ביצעת הזמנות. זה הזמן לקפה ראשון!</p>
                                    <Link href="/shop" className="inline-block mt-4 text-[#8B4513] font-bold">למעבר לחנות &larr;</Link>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
                                    {(showAllOrders ? initialOrders : initialOrders.slice(0, 3)).map((order) => (
                                        <div key={order.id} className="p-6 border-b border-stone-50 last:border-0 hover:bg-stone-50/50 transition-colors">
                                            <div className="flex justify-between items-start mb-4 flex-row-reverse">
                                                <div className="text-right">
                                                    <div className="flex items-center gap-3 flex-row-reverse mb-1">
                                                        <span className="font-mono font-bold text-lg text-[#2D1B14]">#{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                                                            }`}>
                                                            {order.status === 'COMPLETED' ? 'הושלם' : 'בטיפול'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-stone-400 font-bold">
                                                        {new Date(order.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className="font-black text-xl text-[#2D1B14]">₪{order.total.toFixed(0)}</span>
                                            </div>

                                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide flex-row-reverse">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-3 bg-white border border-stone-100 p-2 pr-2 pl-4 rounded-xl flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden">
                                                            {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-2 flex-row-reverse mb-1">
                                                                <p className="text-xs font-bold text-[#2D1B14]">{item.product?.name || 'מוצר'}</p>
                                                                {item.size && (
                                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[9px] font-black uppercase">
                                                                        {item.size === 'S' ? 'קטן' : item.size === 'M' ? 'בינוני' : 'גדול'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-stone-400">x{item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {initialOrders.length > 3 && (
                                        <div className="p-4 text-center border-t border-stone-50">
                                            <button
                                                onClick={() => setShowAllOrders(!showAllOrders)}
                                                className="text-xs font-bold text-stone-400 hover:text-[#2D1B14] transition-colors"
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
                    </div>
                </div>
            </div>
        </main>
    );
}


