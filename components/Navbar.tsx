'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User, ChevronDown, Sparkles, Coffee, Crown } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
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

                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-2 group relative z-50">
                    <div className={`p-2 rounded-full border transition-colors ${useDarkText
                        ? 'bg-[#2D1B14] border-[#2D1B14] group-hover:bg-[#C37D46] group-hover:border-[#C37D46]'
                        : 'bg-white/10 border-white/10 group-hover:bg-[#C37D46]'
                        }`}>
                        <Coffee className={`w-5 h-5 ${useDarkText ? 'text-white' : 'text-white'}`} />
                    </div>
                    <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors ${useDarkText ? 'text-[#2D1B14]' : 'text-white'}`}>
                        Latte Lane<span className="text-[#C37D46]">.</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className={`hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-1.5 border transition-all ${useDarkText
                    ? 'bg-stone-100/80 border-stone-200 shadow-xl shadow-stone-200/50'
                    : 'bg-white/5 border-white/10 shadow-2xl shadow-black/20 backdrop-blur-md'
                    }`}>
                    <div className="flex items-center gap-1">
                        {[
                            { name: 'Shop', href: '/shop' },
                            { name: 'Menu', href: '/#menu' },
                            { name: 'Club', href: '/subscription', icon: Crown },
                        ].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${isActive(link.href)
                                    ? (useDarkText ? 'bg-[#2D1B14] text-white shadow-lg' : 'text-white bg-white/10 shadow-inner')
                                    : (useDarkText ? 'text-[#2D1B14]/70 hover:bg-[#2D1B14]/5' : 'text-white/70 hover:bg-white/10')
                                    }`}
                            >
                                {link.icon && <link.icon className={`w-3 h-3 ${isActive(link.href) && useDarkText ? 'text-[#C37D46]' : 'text-[#C37D46]'}`} />}
                                {link.name}
                            </Link>
                        ))}

                        <div className={`w-px h-4 mx-2 ${useDarkText ? 'bg-[#2D1B14]/10' : 'bg-white/20'}`} />

                        {/* Dropdown Trigger */}
                        <div
                            className="relative"
                            onMouseEnter={() => setFeaturesOpen(true)}
                            onMouseLeave={() => setFeaturesOpen(false)}
                        >
                            <button className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${['/expert', '/fortune', '/match'].includes(pathname || '')
                                ? 'text-[#C37D46]'
                                : (useDarkText ? 'text-[#2D1B14]/70 hover:bg-[#2D1B14]/5' : 'text-white/70 hover:bg-white/10')
                                }`}>
                                <Sparkles className="w-3 h-3" />
                                <span>AI Experiences</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {featuresOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#2D1B14] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-1 z-[60]"
                                    >
                                        {[
                                            { name: 'AI Barista', href: '/expert', desc: 'Chat & Order' },
                                            { name: 'Coffee Match', href: '/match', desc: 'Find your flavor' },
                                            { name: 'Custom Blend', href: '/expert/custom-blend-lab', desc: 'Create your own' },
                                            { name: 'Bean Rater', href: '/expert/bean-rater', desc: 'Quality Check' },
                                            { name: 'Brew Calc', href: '/expert/brew-calculator', desc: 'Pro Tools' },
                                            { name: 'Oracle', href: '/fortune', desc: 'Daily reading' },
                                            { name: 'Gallery', href: '/gallery', desc: 'Community Art' },
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="block p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="font-bold text-white text-sm group-hover:text-[#C37D46] transition-colors">{item.name}</div>
                                                <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{item.desc}</div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <div className={`flex items-center gap-3 pl-4 border-l ${useDarkText ? 'border-[#2D1B14]/10' : 'border-white/10'}`}>
                                <Link
                                    href="/dashboard"
                                    className={`flex items-center gap-2 transition-colors group ${useDarkText ? 'text-[#2D1B14]/80 hover:text-[#2D1B14]' : 'text-white/80 hover:text-white'}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C37D46] to-[#E8CBAD] p-0.5">
                                        <div className="w-full h-full rounded-full bg-[#2D1B14] flex items-center justify-center overflow-hidden">
                                            {session.user?.image ? (
                                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-white">{session.user?.name?.[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden xl:block">
                                        <div className="text-xs font-bold leading-none">{session.user?.name?.split(' ')[0]}</div>
                                        <div className={`text-[9px] uppercase tracking-wider font-medium ${useDarkText ? 'text-[#2D1B14]/50' : 'text-white/50'}`}>Dashboard</div>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/auth?mode=login" className={`text-sm font-bold transition-colors ${useDarkText ? 'text-[#2D1B14]/70 hover:text-[#2D1B14]' : 'text-white/70 hover:text-white'}`}>
                                    Login
                                </Link>
                                <Link href="/auth?mode=signup" className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${useDarkText ? 'bg-[#2D1B14] text-white hover:bg-[#C37D46]' : 'bg-white text-[#2D1B14] hover:bg-[#C37D46] hover:text-white'}`}>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Cart */}
                    <Link href="/checkout" className={`relative p-2 transition-colors ${useDarkText ? 'text-[#2D1B14] hover:text-[#C37D46]' : 'text-white hover:text-[#C37D46]'}`}>
                        <ShoppingBag className="w-5 h-5" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-[#C37D46] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#2D1B14]"
                                >
                                    {cartCount}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2 transition-colors rounded-full ${useDarkText ? 'text-[#2D1B14] bg-[#2D1B14]/5' : 'text-white bg-white/5'}`}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#1A100C] border-t border-white/5 overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 space-y-2">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Shop', href: '/shop' },
                                { name: 'The Club', href: '/subscription' },
                                { name: 'Custom Blend', href: '/expert/custom-blend-lab' },
                                { name: 'Bean Rater', href: '/expert/bean-rater' },
                                { name: 'Brew Calculator', href: '/expert/brew-calculator' },
                                { name: 'Coffee Match', href: '/match' },
                                { name: 'AI Barista', href: '/expert' },
                                { name: 'Daily Oracle', href: '/fortune' },
                                { name: 'Community Gallery', href: '/gallery' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block p-4 rounded-xl hover:bg-white/5 text-white/80 hover:text-[#C37D46] font-serif text-xl border-b border-white/5 last:border-0 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {!session && (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Link href="/auth?mode=login" onClick={() => setMobileMenuOpen(false)} className="py-3 text-center border border-white/20 rounded-xl text-white font-bold text-sm">
                                        Log In
                                    </Link>
                                    <Link href="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)} className="py-3 text-center bg-[#C37D46] rounded-xl text-white font-bold text-sm">
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {session && (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl mt-4">
                                    <div className="w-10 h-10 rounded-full bg-[#C37D46] flex items-center justify-center text-white font-bold">
                                        {session.user?.name?.[0]}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">My Dashboard</div>
                                        <div className="text-white/50 text-xs text-left">View profile & orders</div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
