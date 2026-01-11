'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
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

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '#about' },
        { name: 'Menu', href: '#menu' },
        { name: 'Shop Now', href: '/shop' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#2D1B14]/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 space-x-reverse group">
                    <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white">
                        Latte Lane
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-12 space-x-reverse">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                if (link.href.startsWith('#')) {
                                    e.preventDefault();
                                    const element = document.getElementById(link.href.substring(1));
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="text-white/90 text-sm font-semibold uppercase tracking-wider hover:text-[#C37D46] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                        {session ? (
                            <div className="flex items-center space-x-6 space-x-reverse">
                                <span className="text-white/70 text-xs font-bold uppercase">{session.user?.name?.split(' ')[0]}</span>
                                <Link href="/orders" className="text-white/70 hover:text-white text-xs font-bold uppercase transition-colors">
                                    Orders
                                </Link>
                                <button onClick={() => signOut()} className="text-white/70 hover:text-white text-xs font-bold uppercase transition-colors">Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link href="/auth?mode=signup" className="text-white font-bold text-sm hover:text-[#C37D46] transition-colors">
                                    Sign Up
                                </Link>
                                <Link href="/auth?mode=login" className="bg-white/10 border border-white/30 px-6 py-2 rounded-full text-white text-sm font-bold hover:bg-white hover:text-[#2D1B14] transition-all">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Cart */}
                    <Link href="/checkout" className="relative p-2 group">
                        <ShoppingBag className="w-6 h-6 text-white hover:text-[#C37D46] transition-colors" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-[#C37D46] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-white"
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
                        className="lg:hidden bg-[#2D1B14] border-t border-white/10"
                    >
                        <div className="flex flex-col p-6 space-y-4 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-white/80 font-semibold uppercase tracking-wider hover:text-[#C37D46] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-4" />
                            {!session ? (
                                <div className="flex flex-col space-y-4">
                                    <Link href="/auth?mode=signup" className="text-white font-bold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                                    <Link href="/auth?mode=login" className="text-white/60 font-bold" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4">
                                    <Link href="/orders" className="text-white/80 font-bold" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                                    <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-red-400 font-bold">Logout</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
