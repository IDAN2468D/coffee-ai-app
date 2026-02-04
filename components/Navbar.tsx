'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User, ChevronDown, Sparkles, Coffee, Crown, Home, Store, FlaskConical, Gavel, Scale, BrainCircuit, Bot, Activity, Image as ImageIcon, Headphones, Mic } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { NotificationBell } from './NotificationBell';



export default function Navbar() {
    // ...

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const { data: session } = useSession();
    const { items } = useCart();
    const pathname = usePathname();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Determines if the page has a light background (requiring dark text initially)
    const isLightPage = ['/shop', '/subscription', '/dashboard', '/match', '/checkout'].includes(pathname || '');

    // Logic: Use Dark Text if it's a light page AND we haven't scrolled yet.
    // Once scrolled, the navbar gets a dark glass background, so we switch back to white text.
    // EXCEPT: If you prefer the navbar to stay light on light pages when scrolled (e.g. white glass), 
    // we can adjust. But for now, let's say scrolled = dark bg theme.
    // Actually, a "Light Glass" looks better on light pages. 
    // So:
    // Light Page + Scrolled -> White/Light Glass with Dark Text? Or Dark Glass with White Text?
    // Let's go for specific themes.

    const useDarkText = false; // Always white text on the dark texture background

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    // Background logic
    // Always use the Coffee Texture Image
    const navBackgroundClass = 'bg-[linear-gradient(to_bottom,rgba(20,10,5,0.8),rgba(20,10,5,0.9)),url("/images/navbar-bg-texture.png")] bg-cover bg-center border-white/5 py-4 shadow-lg';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${navBackgroundClass}`}>
            <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between">

                {/* 1. Desktop Branding (Far Left) */}
                <Link href="/" className="hidden lg:flex items-center gap-4 group relative z-50">
                    <div className="flex flex-col text-left">
                        <div className="font-serif font-black flex flex-col tracking-tight leading-[0.85]">
                            <span className="text-2xl text-white">Cyber</span>
                            <span className="text-2xl text-[#C37D46]">Barista</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#C37D46]/60 tracking-[0.1em] mt-1 uppercase">
                            בית הקפה הדיגיטלי
                        </span>
                    </div>
                    <div className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:border-[#C37D46]/40 transition-all duration-300">
                        <Coffee className="w-5 h-5 text-white" />
                        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-500 animate-pulse" />
                    </div>
                </Link>

                {/* 2. Mobile Actions (Left/Center) - Keep as per user image */}
                <div className="flex lg:hidden items-center gap-1 sm:gap-4">
                    <ThemeToggle />
                    <NotificationBell />
                    <Link href="/checkout" className="relative p-2 text-white/70">
                        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                        {cartCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-[#C37D46] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-4 bg-white/5 rounded-full text-white mx-1"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <Link href="/" className="relative p-4 rounded-[2rem] bg-stone-900/40 border border-white/5 backdrop-blur-sm group">
                        <Coffee className="w-8 h-8 text-white stroke-[1.5]" />
                        <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-500" />
                    </Link>
                </div>

                {/* 3. Central Navigation Pill (Desktop) */}
                <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-1.5 border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md transition-all">
                    <div className="flex items-center gap-1">
                        {[
                            { name: 'חנות', href: '/shop' },
                            { name: 'סניפים', href: '/stores', icon: Store },
                            { name: 'תפריט', href: '/#menu' },
                            { name: 'מועדון', href: '/subscription', icon: Crown },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isActive(link.href)
                                    ? 'text-white bg-white/10 shadow-inner'
                                    : 'text-white/80 hover:bg-white/10'
                                    }`}
                            >
                                {link.icon && <link.icon className="w-3.5 h-3.5 text-[#C37D46]" />}
                                {link.name}
                            </Link>
                        ))}

                        <div className="w-px h-4 mx-2 bg-white/20" />

                        {/* Dropdown Trigger */}
                        <div
                            className="relative"
                            onMouseEnter={() => setFeaturesOpen(true)}
                            onMouseLeave={() => setFeaturesOpen(false)}
                        >
                            <button className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${['/expert', '/fortune', '/match'].includes(pathname || '')
                                ? 'text-[#C37D46]'
                                : 'text-white/80 hover:bg-white/10'
                                }`}>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>חוויות AI</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {featuresOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#2D1B14] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-1 z-[60]"
                                    >
                                        {[
                                            { name: 'בריסטה AI', href: '/expert', desc: 'צ\'אט והזמנה' },
                                            { name: 'התאמת קפה', href: '/match', desc: 'מצא את הטעם שלך' },
                                            { name: 'מעבדת בלנדים', href: '/expert/custom-blend-lab', desc: 'צור בעצמך' },
                                            { name: 'גלריה', href: '/gallery', desc: 'אומנות הקהילה' },
                                        ].map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="block p-3 rounded-xl hover:bg-white/5 transition-colors text-right group"
                                            >
                                                <div className="font-bold text-white text-sm group-hover:text-[#C37D46]">{item.name}</div>
                                                <div className="text-[10px] text-white/40 uppercase font-bold">{item.desc}</div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* 4. Desktop Actions (Far Right) & Mobile Logo (Match image) */}
                <div className="flex items-center gap-6">
                    {/* Mobile Branding (Match latest image spec) */}
                    <Link href="/" className="flex flex-col text-right lg:hidden">
                        <div className="font-serif font-black flex flex-col tracking-tight leading-[0.8]">
                            <span className="text-3xl text-white">Cyber</span>
                            <span className="text-3xl text-[#C37D46]">Barista</span>
                        </div>
                        <span className="text-[11px] font-bold text-white/40 tracking-wider mt-1">
                            בית הקפה הדיגיטלי
                        </span>
                    </Link>

                    {/* Desktop Actions Group */}
                    <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-white/10">
                        <ThemeToggle />
                        <NotificationBell />

                        {session ? (
                            <Link href="/dashboard" className="flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 hover:border-[#C37D46]/40 transition-all shrink-0">
                                <div className="w-8 h-8 rounded-full bg-[#C37D46] flex items-center justify-center overflow-hidden">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold text-white">{session.user?.name?.[0]}</span>
                                    )}
                                </div>
                                <div className="text-right ml-1">
                                    <div className="text-[10px] font-black text-white leading-none capitalize">{session.user?.name?.split(' ')[0]}</div>
                                    <div className="text-[8px] font-bold text-[#C37D46] tracking-widest uppercase">Member</div>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/auth?mode=login" className="px-5 py-2 rounded-full text-xs font-bold text-[#C37D46] border border-[#C37D46]/30 hover:bg-[#C37D46] hover:text-white transition-all">
                                SIGN IN
                            </Link>
                        )}

                        <Link href="/checkout" className="relative p-2.5 rounded-full bg-white/5 text-white hover:text-[#C37D46] transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-[#C37D46] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full"
                                >
                                    {cartCount}
                                </motion.div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Premium Glass Design */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] lg:hidden"
                    >
                        {/* Backdrop with Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Slide-out Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#1A100C]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col"
                            dir="rtl"
                        >
                            {/* Mobile Header with Close */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#C37D46] rounded-lg">
                                        <Coffee className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-serif font-black text-white">Cyber Barista</span>
                                </div>
                                <button
                                    aria-label="סגור תפריט"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-6 space-y-8 pb-32">
                                {/* Main Navigation Section */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-[#C37D46] uppercase tracking-[0.2em] opacity-80 mb-2 px-2">מסע וגילוי</h3>
                                    <div className="grid gap-2">
                                        {[
                                            { name: 'דף הבית', href: '/', icon: Home },
                                            { name: 'החנות הדיגיטלית', href: '/shop', icon: ShoppingBag },
                                            { name: 'הסניפים שלנו', href: '/stores', icon: Store },
                                            { name: 'מועדון הקרמה', href: '/subscription', icon: Crown },
                                            { name: 'מיקסר סאונד', href: '/ambience', icon: Headphones },
                                            { name: 'גלריית קהילה', href: '/gallery', icon: ImageIcon },
                                        ].map((link, i) => (
                                            <motion.div
                                                key={link.name}
                                                initial={{ x: 50, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 + i * 0.05 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${isActive(link.href)
                                                        ? 'bg-[#C37D46] text-white shadow-lg shadow-[#C37D46]/20'
                                                        : 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/5'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg transition-colors ${isActive(link.href) ? 'bg-white/20' : 'bg-[#2D1B14] text-[#C37D46] group-hover:bg-[#C37D46] group-hover:text-white'
                                                        }`}>
                                                        <link.icon size={20} />
                                                    </div>
                                                    <span className="font-serif text-lg font-bold">{link.name}</span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Laboratory Section */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-[#C37D46] uppercase tracking-[0.2em] opacity-80 mb-2 px-2">מעבדת ה-AI</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { name: 'הבריסטה החכם', href: '/expert', icon: Bot, action: { icon: Mic, href: '/expert?autoMic=true' } },
                                            { name: 'אורקל המזל', href: '/fortune', icon: Sparkles },
                                            { name: 'יומן קפאין', href: '/tracker', icon: Activity },
                                            { name: 'אלגוריתם התאמה', href: '/match', icon: BrainCircuit },
                                            { name: 'מעבדת הבלנדים', href: '/expert/custom-blend-lab', icon: FlaskConical },
                                        ].map((link, i) => (
                                            <motion.div
                                                key={link.name}
                                                initial={{ x: 50, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 + i * 0.05 }}
                                                className="relative group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex-grow flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#C37D46]/30 transition-all"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-[#C37D46]/10 flex items-center justify-center">
                                                            <link.icon size={16} className="text-[#C37D46]" />
                                                        </div>
                                                        <span className="text-white/80 font-medium">{link.name}</span>
                                                    </Link>

                                                    {link.action && (
                                                        <Link
                                                            aria-label="פעולה קולית"
                                                            href={link.action.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="p-4 bg-[#C37D46]/20 text-[#C37D46] rounded-2xl hover:bg-[#C37D46] hover:text-white transition-all shadow-lg"
                                                        >
                                                            <link.action.icon size={20} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky User Profile Bottom Section */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="p-6 bg-[#1A100C] border-t border-white/10"
                            >
                                {!session ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/auth?mode=login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="py-4 text-center border border-white/10 rounded-2xl text-white/90 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                                        >
                                            כניסה
                                        </Link>
                                        <Link
                                            href="/auth?mode=signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="py-4 text-center bg-white text-[#1A100C] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-[#C37D46] hover:text-white transition-all"
                                        >
                                            הרשמה
                                        </Link>
                                    </div>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                                    >
                                        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#C37D46] to-amber-200">
                                            <div className="w-full h-full rounded-full bg-[#1A100C] flex items-center justify-center overflow-hidden">
                                                {session.user?.image ? (
                                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-black text-lg">{session.user?.name?.[0]}</span>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C37D46] rounded-full flex items-center justify-center border-2 border-[#1A100C]">
                                                <Activity size={10} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-white font-bold text-lg leading-tight group-hover:text-[#C37D46] transition-colors">{session.user?.name?.split(' ')[0]}</div>
                                            <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">ניהול חשבון</div>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-white/20 -rotate-90 group-hover:text-white/50 transition-colors" />
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
