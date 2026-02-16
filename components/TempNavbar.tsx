'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User, ChevronDown, Sparkles, Coffee, Crown, Home, Store, FlaskConical, Gavel, Scale, BrainCircuit, Bot, Activity, Image as ImageIcon, Headphones, Mic, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/context/useCartStore';
import type { CartItem } from '@/src/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { NotificationBell } from './NotificationBell';
import UserAvatar from './UserAvatar';



// Tier hierarchy for checking access
const TIERS = {
    'SILVER': 0,
    'GOLD': 1,
    'PLATINUM': 2
};

type Tier = keyof typeof TIERS;

interface Feature {
    name: string;
    href: string;
    icon?: any;
    minTier?: Tier; // Minimum tier required to access
    action?: any;
}

const FEATURES: Feature[] = [
    { name: 'בריסטה AI', href: '/expert', icon: Bot, action: { icon: Mic, href: '/expert?autoMic=true' } },
    { name: 'התאמת קפה', href: '/match', icon: BrainCircuit },
    { name: 'יוצר הבלנדים', href: '/my-blend', icon: FlaskConical },
    { name: 'דרכון הקפה', href: '/passport', icon: Globe, minTier: 'PLATINUM' },
    { name: 'מיקסר סאונד', href: '/ambience', icon: Headphones, minTier: 'SILVER' },
    { name: 'אורקל המזל', href: '/fortune', icon: Sparkles, minTier: 'PLATINUM' },
    { name: 'יומן קפאין', href: '/tracker', icon: Activity, minTier: 'PLATINUM' },
    { name: 'גלריה', href: '/gallery', icon: ImageIcon },
];

export default function Navbar() {
    // ...

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const { data: session } = useSession();
    const { items } = useCartStore();
    const pathname = usePathname();
    const cartCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

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

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Add class to body when mobile menu is open to allow widgets to hide
        if (mobileMenuOpen) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('mobile-menu-open');
        };
    }, [mobileMenuOpen]);

    if (!mounted) return null;

    const isActive = (path: string) => pathname === path;

    const checkAccess = (minTier?: Tier) => {
        if (!minTier) return true; // No tier required
        if (!session?.user) return false; // Must be logged in

        const userTier = (session.user as any).tier as Tier;

        // Debugging Log
        if (minTier) {
            console.log(`Checking Access for ${minTier}: User Tier = ${userTier}, Access = ${userTier && TIERS[userTier] >= TIERS[minTier]}`);
        }

        if (!userTier || TIERS[userTier] === undefined) return false;

        return TIERS[userTier] >= TIERS[minTier];
    };

    // Background logic
    // Always use the Coffee Texture Image
    const navBackgroundClass = 'bg-[linear-gradient(to_bottom,rgba(20,10,5,0.8),rgba(20,10,5,0.9)),url("/images/navbar-bg-texture.png")] bg-cover bg-center border-white/5 py-4 shadow-lg';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out border-b flex items-center justify-between px-4 lg:px-8 ${navBackgroundClass}`}>
            {/* ==================== DESKTOP LAYOUT (lg:flex) ==================== */}

            {/* 1. Desktop Branding (Left) */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-6 relative z-50 group">
                {/* Holographic Background Aura (Hover Only) */}
                <div
                    className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(195,125,70,0.15) 0%, transparent 70%)' }}
                />

                {/* Cyber Coffee Icon Block */}
                <Link href="/" className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                        className="relative"
                    >
                        {/* The "Cyber" Squircle */}
                        <div className="relative p-3 sm:p-3.5 rounded-[1.25rem] bg-[#1A100C] border border-white/10 shadow-[0_0_30px_rgba(195,125,70,0.15)] overflow-hidden">
                            {/* Digital Grid Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4px_4px]" />

                            <div className="relative z-10 flex items-center justify-center">
                                <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.5] group-hover:text-amber-400 transition-colors" />

                                {/* Digital Steam Effect */}
                                <div className="absolute -top-1 flex space-x-0.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -8, -12],
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1, 0.8]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.4,
                                                ease: "easeOut"
                                            }}
                                            className="w-0.5 h-2 bg-amber-400/60 rounded-full blur-[1px]"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Luxury Reflection Sweep */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                            />
                        </div>

                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 rounded-[1.25rem] border border-amber-500/0 group-hover:border-amber-500/30 transition-colors duration-500 ring-1 ring-white/5" />
                    </motion.div>
                </Link>

                {/* Signature Typography */}
                <Link href="/" className="flex flex-col text-left relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="flex flex-col leading-[0.8]">
                            <span className="text-[10px] sm:text-[11px] font-black text-amber-500/80 tracking-[0.4em] uppercase mb-1.5 transition-all group-hover:tracking-[0.5em] duration-500">
                                Cyber
                            </span>
                            <div className="relative">
                                <motion.span
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-2xl sm:text-4xl font-serif font-black italic bg-gradient-to-r from-white via-amber-200 to-white bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                                >
                                    Barista
                                </motion.span>

                                {/* Decorative Underline */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0"
                                />
                            </div>
                        </div>

                        {/* Floating AI Glass Badge */}
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex self-start mt-0.5 items-center justify-center px-1.5 py-0.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] ring-1 ring-white/10 overflow-hidden"
                        >
                            <span className="text-[7px] sm:text-[8px] font-black text-white/60 tracking-tighter group-hover:text-amber-400 transition-colors">AI 2.0</span>
                            <motion.div
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-amber-500/10"
                            />
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                        <div className="h-[1px] w-4 sm:w-6 bg-gradient-to-r from-amber-500/40 to-transparent" />
                        <span className="text-[8px] sm:text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase leading-none whitespace-nowrap">
                            The Future of Coffee
                        </span>
                    </div>
                </Link>
            </div>

            {/* 2. Desktop Navigation (Center) */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 z-40">
                <div className="flex items-center bg-[#1A100C]/80 backdrop-blur-md rounded-full px-6 py-2 border border-white/5 shadow-xl">
                    {[
                        { name: 'חנות', href: '/shop' },
                        { name: 'סניפים', href: '/stores', icon: Store },
                        { name: 'תפריט', href: '/#menu' },
                        { name: 'מועדון', href: '/subscription', icon: Crown },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-1.5 text-sm font-bold transition-all flex items-center gap-2 rounded-full hover:bg-white/5 ${isActive(link.href)
                                ? 'text-[#C37D46] bg-white/5'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            {link.icon && <link.icon className="w-4 h-4" />}
                            {link.name}
                        </Link>
                    ))}

                    <div className="w-px h-4 mx-3 bg-white/10" />

                    {/* Simple Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setFeaturesOpen(true)}
                        onMouseLeave={() => setFeaturesOpen(false)}
                    >
                        <button className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full hover:bg-white/5 transition-all ${['/expert', '/fortune', '/match'].includes(pathname || '')
                            ? 'text-[#C37D46]'
                            : 'text-white/70 hover:text-white'
                            }`}>
                            <Sparkles className="w-4 h-4" />
                            <span>AI Zone</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${featuresOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {featuresOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-[#1A100C] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5"
                                >
                                    {FEATURES.map((item) => {
                                        const hasAccess = checkAccess(item.minTier);
                                        return (
                                            <div key={item.href} className="relative group">
                                                <Link
                                                    href={hasAccess ? item.href : '#'}
                                                    onClick={(e) => {
                                                        if (!hasAccess) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-sm font-medium
                                                        ${hasAccess
                                                            ? 'text-white/80 hover:text-[#C37D46] hover:bg-white/5'
                                                            : 'text-white/30 cursor-not-allowed pointer-events-none'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {item.name}
                                                        {item.minTier && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider
                                                                ${item.minTier === 'SILVER' ? 'bg-stone-400/20 text-stone-300' : ''}
                                                                ${item.minTier === 'PLATINUM' ? 'bg-amber-400/20 text-amber-300' : ''}
                                                            `}>
                                                                {item.minTier}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {!hasAccess && <Lock className="w-3 h-3 text-white/30" />}
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* 3. Desktop Actions Group (Right) - Refined Layout */}
            <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-white/10 z-50">
                {/* 3.1. Shopping Bag */}
                <Link href="/checkout" className="relative p-2.5 rounded-full bg-white/5 text-white hover:text-[#C37D46] hover:bg-white/10 transition-all border border-white/5 hover:border-[#C37D46]/30">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-[#C37D46] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0F0806] shadow-lg">
                            {cartCount}
                        </div>
                    )}
                </Link>

                {/* 3.2. User Profile / Session - Premium Redesign */}
                {session ? (
                    <Link href="/dashboard" className="relative group/profile">
                        {/* Dynamic Background Glow */}
                        <div className="absolute inset-0 bg-[#C37D46]/0 group-hover/profile:bg-[#C37D46]/10 blur-xl transition-all duration-500 rounded-full" />

                        <div className="relative flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 group-hover/profile:border-[#C37D46]/40 transition-all duration-300 shadow-2xl overflow-hidden group/pill">
                            {/* Glass Shimmer Reflection */}
                            <motion.div
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none"
                            />

                            <span className="text-sm font-serif font-black tracking-wider text-white uppercase group-hover/profile:text-[#C37D46] transition-colors relative z-10">
                                {session.user?.name?.split(' ')[0]}
                            </span>

                            {/* VIP PRO Badge - Gold Shimmer */}
                            {(session.user as any).tier === 'PLATINUM' && (
                                <div className="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] shadow-lg shadow-[#FFD700]/20 overflow-hidden">
                                    <Crown className="w-3 h-3 text-[#1a1005]" />
                                    <span className="text-[9px] font-black text-[#1a1005] uppercase tracking-wider">VIP</span>
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                                    />
                                </div>
                            )}

                            <UserAvatar
                                src={session.user?.image}
                                name={session.user?.name}
                                size={36}
                                className="ring-2 ring-offset-2 ring-[#C37D46] ring-offset-[#0F0806] shadow-[0_0_15px_rgba(195,125,70,0.3)] transition-transform duration-300 group-hover/profile:scale-105"
                            />
                        </div>
                    </Link>
                ) : (
                    <Link href="/auth?mode=login" className="px-6 py-2 rounded-full bg-[#C37D46] hover:bg-[#a66a3a] text-white text-sm font-bold transition-all shadow-lg shadow-[#C37D46]/20 border border-white/10">
                        התחברות
                    </Link>
                )}

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-white/10" />

                {/* 3.3. Utilities */}
                <div className="flex items-center gap-1">
                    <NotificationBell />
                </div>
            </div>


            {/* ==================== MOBILE LAYOUT (lg:hidden) ==================== */}
            <div className="flex lg:hidden items-center justify-between w-full px-4 h-full relative z-50">
                {/* Mobile Branding (Left - Rich Cyber Style) */}
                <div className="flex items-center gap-2 relative z-50 group">
                    {/* Holographic Background Aura (Hover Only) */}
                    <div
                        className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(195,125,70,0.15) 0%, transparent 70%)' }}
                    />

                    {/* Cyber Coffee Icon Block */}
                    <Link href="/" className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                            className="relative"
                        >
                            {/* The "Cyber" Squircle */}
                            <div className="relative p-2.5 rounded-[1rem] bg-[#1A100C] border border-white/10 shadow-[0_0_30px_rgba(195,125,70,0.15)] overflow-hidden">
                                {/* Digital Grid Overlay */}
                                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4px_4px]" />

                                <div className="relative z-10 flex items-center justify-center">
                                    <Coffee className="w-5 h-5 text-white stroke-[1.5] group-hover:text-amber-400 transition-colors" />

                                    {/* Digital Steam Effect */}
                                    <div className="absolute -top-1 flex space-x-0.5">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    y: [0, -8, -12],
                                                    opacity: [0, 1, 0],
                                                    scale: [0.5, 1, 0.8]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.4,
                                                    ease: "easeOut"
                                                }}
                                                className="w-0.5 h-2 bg-amber-400/60 rounded-full blur-[1px]"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Luxury Reflection Sweep */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                                />
                            </div>

                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-[1rem] border border-amber-500/0 group-hover:border-amber-500/30 transition-colors duration-500 ring-1 ring-white/5" />
                        </motion.div>
                    </Link>

                    {/* Signature Typography */}
                    <Link href="/" className="flex flex-col text-left relative z-10">
                        <div className="flex items-center gap-1.5">
                            <div className="flex flex-col leading-[0.8]">
                                <span className="text-[8px] font-black text-amber-500/80 tracking-[0.4em] uppercase mb-1 transition-all group-hover:tracking-[0.5em] duration-500">
                                    Cyber
                                </span>
                                <div className="relative">
                                    <motion.span
                                        animate={{
                                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-xl font-serif font-black italic bg-gradient-to-r from-white via-amber-200 to-white bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                                    >
                                        Barista
                                    </motion.span>

                                    {/* Decorative Underline */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0"
                                    />
                                </div>
                            </div>

                            {/* Floating AI Glass Badge (Simplified for Mobile) */}
                            <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="flex self-start mt-0 items-center justify-center px-1 py-0.5 rounded bg-white/5 border border-white/10 backdrop-blur-md shadow-sm"
                            >
                                <span className="text-[6px] font-black text-white/60 tracking-tighter">AI 2.0</span>
                            </motion.div>
                        </div>
                    </Link>
                </div>

                {/* Mobile Actions (Right) */}
                <div className="flex items-center gap-3">
                    <Link href="/checkout" className="relative p-2 text-white hover:text-[#C37D46] transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <div className="absolute top-0 right-0 bg-[#C37D46] text-white text-[9px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-lg">
                                {cartCount}
                            </div>
                        )}
                    </Link>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </motion.button>
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
                            {/* Mobile Header with Close and Centered Logo */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 relative">
                                <button
                                    aria-label="סגור תפריט"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2.5 rounded-full bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                                    <span className="text-xl font-serif font-black text-white">Cyber Barista</span>
                                    <div className="p-2 bg-[#C37D46] rounded-lg">
                                        <Coffee className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* Empty div for flex spacing balance */}
                                <div className="w-10" />
                            </div>

                            <div className="flex-grow overflow-y-auto p-6 space-y-8 pb-32">
                                {/* Main Navigation Section */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-[#C37D46]/80 uppercase tracking-[0.4em] mb-4 text-center">מסע וגילוי</h3>
                                    <div className="grid gap-3">
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
                                                    className={`relative flex items-center justify-between p-5 rounded-2xl transition-all group overflow-hidden ${isActive(link.href)
                                                        ? 'bg-gradient-to-r from-[#C37D46] to-[#a66a3a] text-white shadow-xl shadow-[#C37D46]/20'
                                                        : 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/5'
                                                        }`}
                                                >
                                                    <span className="font-serif text-xl font-bold relative z-10">{link.name}</span>

                                                    <div className={`p-2.5 rounded-xl transition-colors relative z-10 ${isActive(link.href)
                                                        ? 'bg-white/20'
                                                        : 'bg-[#2D1B14] text-[#C37D46]'
                                                        }`}>
                                                        <link.icon size={22} strokeWidth={1.5} />
                                                    </div>

                                                    {isActive(link.href) && (
                                                        <motion.div
                                                            layoutId="activeGlow"
                                                            className="absolute inset-0 bg-[radial-gradient(circle_at_30%,rgba(255,255,255,0.2),transparent)]"
                                                        />
                                                    )}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Laboratory Section */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-[#C37D46]/80 uppercase tracking-[0.4em] mb-4 text-center">מעבדת ה-AI</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {FEATURES.map((link, i) => {
                                            const hasAccess = checkAccess(link.minTier);
                                            return (
                                                <motion.div
                                                    key={link.name}
                                                    initial={{ x: 50, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 + i * 0.05 }}
                                                    className="relative group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Link
                                                            href={hasAccess ? link.href : '#'}
                                                            onClick={(e) => {
                                                                if (!hasAccess) {
                                                                    e.preventDefault();
                                                                } else {
                                                                    setMobileMenuOpen(false);
                                                                }
                                                            }}
                                                            className={`flex-grow flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all group/item
                                                                ${hasAccess
                                                                    ? 'bg-white/5 border-white/10 hover:border-[#C37D46]/30'
                                                                    : 'bg-white/[0.02] border-white/5 cursor-not-allowed pointer-events-none'
                                                                }`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                                                                ${hasAccess
                                                                    ? 'bg-[#C37D46]/10 group-hover/item:bg-[#C37D46]/20'
                                                                    : 'bg-white/5'
                                                                }`}>
                                                                {hasAccess ? (
                                                                    <link.icon size={18} className="text-[#C37D46]" />
                                                                ) : (
                                                                    <Lock size={18} className="text-white/20" />
                                                                )}
                                                            </div>
                                                            <span className={`font-medium text-lg leading-none ${hasAccess ? 'text-white' : 'text-white/40'} flex items-center gap-2`}>
                                                                {link.name}
                                                                {link.minTier && (
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                                                                        ${link.minTier === 'SILVER' ? 'bg-stone-400/10 text-stone-400 border-stone-400/20' : ''}
                                                                        ${link.minTier === 'PLATINUM' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : ''}
                                                                    `}>
                                                                        {link.minTier}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </Link>

                                                        {link.action && hasAccess && (
                                                            <Link
                                                                aria-label="פעולה קולית"
                                                                href={link.action.href}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className="p-4 bg-[#C37D46]/10 text-[#C37D46] border border-[#C37D46]/20 rounded-2xl hover:bg-[#C37D46] hover:text-white transition-all shadow-lg"
                                                            >
                                                                <link.action.icon size={22} />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
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
                                        className="relative flex items-center gap-4 p-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all group shadow-2xl"
                                    >
                                        {/* Luxury Gradient Glow behind avatar */}
                                        <div className="absolute top-1/2 left-6 -translate-y-1/2 w-24 h-24 bg-[#C37D46]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10">
                                            <UserAvatar
                                                src={session?.user?.image}
                                                name={session?.user?.name}
                                                size={64}
                                                className="p-0.5 bg-gradient-to-tr from-[#C37D46] via-amber-200 to-[#C37D46] shadow-[0_0_20px_rgba(195,125,70,0.4)]"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#C37D46] rounded-full flex items-center justify-center border-2 border-[#1A100C] shadow-lg z-20"
                                            >
                                                <Activity size={12} className="text-white" />
                                            </motion.div>
                                        </div>

                                        <div className="flex-grow z-10">
                                            <h4 className="text-white font-serif font-black text-2xl tracking-tight mb-1 group-hover:text-[#C37D46] transition-colors">
                                                {session?.user?.name?.split(' ')[0]}
                                            </h4>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">ניהול חשבון</span>
                                            </div>
                                        </div>

                                        <motion.div
                                            whileHover={{ x: -3 }}
                                            className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#C37D46] group-hover:text-white transition-all shadow-inner"
                                        >
                                            <ChevronDown className="w-6 h-6 text-white/40 -rotate-90 group-hover:text-white transition-colors" />
                                        </motion.div>
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}
