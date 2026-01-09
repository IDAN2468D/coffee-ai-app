'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, Sparkles, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';


export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const { items } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className={`p-2.5 rounded-xl transition-all shadow-lg ${scrolled ? 'bg-gradient-to-br from-[#8B4513] to-[#6B3410] text-white' : 'bg-white/20 backdrop-blur-md text-white border border-white/30'}`}>
                        <Coffee className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${scrolled ? 'text-[#2D1B14]' : 'text-white'}`}>
                            The Digital Roast
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${scrolled ? 'text-[#8B4513]' : 'text-white/70'}`}>
                            AI Coffee Experience
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className={`hidden lg:flex items-center space-x-8 text-sm font-semibold uppercase tracking-widest ${scrolled ? 'text-stone-600' : 'text-white/90'}`}>
                    <Link href="/" className="hover:text-[#8B4513] transition-colors">בית</Link>
                    <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#8B4513] transition-colors">תפריט</button>
                    <Link href="/gallery" className="hover:text-[#8B4513] transition-colors">גלריה</Link>
                    <Link href="/ai-barista" className="hover:text-[#8B4513] transition-colors font-bold text-[#8B4513] flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI בריסטה
                    </Link>
                    {session && (
                        <>
                            <Link href="/orders" className="hover:text-[#8B4513] transition-colors">ההזמנות שלי</Link>
                            <Link href="/dashboard" className="hover:text-[#8B4513] transition-colors">דאשבורד</Link>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                    {/* User Info */}
                    {session ? (
                        <div className="hidden md:flex items-center space-x-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled ? 'text-stone-400' : 'text-white/50'}`}>
                                שלום, {session.user?.name?.split(' ')[0]}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className={`text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors ${scrolled ? 'text-stone-600' : 'text-white/80'}`}
                            >
                                התנתק
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth" className={`hidden md:block text-xs font-bold uppercase tracking-widest hover:text-[#8B4513] transition-colors ${scrolled ? 'text-stone-600' : 'text-white/80'}`}>
                            חשבון
                        </Link>
                    )}

                    {/* Cart */}
                    <Link href="/checkout" className="relative p-2 group">
                        <ShoppingBag className={`w-6 h-6 transition-colors ${scrolled ? 'text-[#8B4513]' : 'text-white'}`} />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2 ${scrolled ? 'text-[#8B4513]' : 'text-white'}`}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                        className="lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg"
                        dir="rtl"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
                            <Link href="/" className="block text-stone-700 font-semibold hover:text-[#8B4513] transition-colors text-right" onClick={() => setMobileMenuOpen(false)}>
                                בית
                            </Link>
                            <button onClick={() => { document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-right text-stone-700 font-semibold hover:text-[#8B4513] transition-colors">
                                תפריט
                            </button>
                            <Link href="/gallery" className="block text-stone-700 font-semibold hover:text-[#8B4513] transition-colors text-right" onClick={() => setMobileMenuOpen(false)}>
                                גלריה
                            </Link>
                            <Link href="/ai-barista" className="block text-[#8B4513] font-bold flex items-center justify-end" onClick={() => setMobileMenuOpen(false)}>
                                AI בריסטה
                                <Sparkles className="w-4 h-4 ml-2" />
                            </Link>
                            {session && (
                                <>
                                    <Link href="/orders" className="block text-stone-700 font-semibold hover:text-[#8B4513] transition-colors text-right" onClick={() => setMobileMenuOpen(false)}>
                                        ההזמנות שלי
                                    </Link>
                                    <Link href="/dashboard" className="block text-stone-700 font-semibold hover:text-[#8B4513] transition-colors text-right" onClick={() => setMobileMenuOpen(false)}>
                                        דאשבורד
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                        className="block w-full text-right text-red-500 font-bold"
                                    >
                                        התנתק
                                    </button>
                                </>
                            )}
                            {!session && (
                                <Link href="/auth" className="block text-stone-700 font-semibold hover:text-[#8B4513] transition-colors text-right" onClick={() => setMobileMenuOpen(false)}>
                                    חשבון
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
