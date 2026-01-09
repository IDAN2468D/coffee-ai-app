'use client';

import React from 'react';
import { Coffee, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#5C3A21] text-white/80 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-20">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 text-white">
                            <Coffee className="w-8 h-8" />
                            <span className="text-2xl font-serif font-bold">Coffee</span>
                        </div>
                        <p className="text-sm font-light leading-relaxed">
                            Crafting perfection in every cup since 2026. Join us for a unique coffee experience.
                        </p>
                        <div className="flex space-x-4 pt-4">
                            <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                            <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                            <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest pt-2">Services</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><a href="#" className="hover:text-white transition-colors">Shop</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Order</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Menu</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest pt-2">About Us</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Teams</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest pt-2">Contact</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li>+00 123 456 7890</li>
                            <li>example@example.com</li>
                            <li>123 Road Name City Name, State, Country, 12345</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 text-center text-xs font-bold uppercase tracking-[0.3em] opacity-40">
                    Copyright © 2026, All rights reserved by Digital Roast
                </div>
            </div>
        </footer>
    );
}
