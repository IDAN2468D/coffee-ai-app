import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Map, Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProductReviews from "@/components/reviews/ProductReviews";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
    // Validate ObjectID roughly (24 hex chars)
    if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
        notFound();
    }

    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: { category: true }
    });

    if (!product) {
        notFound();
    }

    const isEthiopia = product.name.toLowerCase().includes('ethiopia') || product.name.includes('אתיופיה');

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">

                {/* Back Link */}
                <div className="mb-12">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#2D1B14] transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5" />
                        חזרה לחנות
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Section */}
                    <div className="space-y-8">
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src={product.image || '/placeholder.png'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Special Badge if Ethiopia */}
                            {isEthiopia && (
                                <div className="absolute top-6 right-6 bg-yellow-400 text-[#2D1B14] px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg rotate-3">
                                    מסע למקור
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[#C37D46] font-bold tracking-widest uppercase text-sm">
                                    {typeof product.category === 'string' ? product.category : product.category?.name}
                                </span>
                                <div className="w-1 h-1 bg-stone-300 rounded-full" />
                                <div className="flex text-yellow-400 gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-serif font-black text-[#2D1B14] leading-tight">
                                {product.name}
                            </h1>
                            <div className="text-3xl font-medium text-[#C37D46]">
                                ₪{product.price.toFixed(2)}
                            </div>
                        </div>

                        <p className="text-xl text-stone-600 leading-relaxed font-light">
                            {product.description}
                        </p>


                        {/* AR Journey Card */}
                        {isEthiopia && (
                            <div className="bg-[#2D1B14] rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                                <div className="relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/30">
                                        <Map className="w-4 h-4 text-yellow-500" />
                                        <span className="text-xs font-bold text-yellow-500 uppercase">חוויה אינטראקטיבית</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold mb-2">גלו מאיפה הקפה שלכם מגיע</h3>
                                        <p className="text-white/70">צאו לסיור וירטואלי בחווה באתיופיה ופגשו את המגדלים.</p>
                                    </div>
                                    <Link
                                        href="/origin/ethiopia"
                                        className="inline-flex items-center gap-3 bg-white text-[#2D1B14] px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
                                    >
                                        התחל בסיור
                                        <ArrowLeft className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Actions */}
                        <div className="pt-8 border-t border-stone-200">
                            <button className="w-full bg-[#C37D46] text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-[#a06338] transition-all flex items-center justify-center gap-3">
                                <ShoppingBag className="w-6 h-6" />
                                הוסף לסל הקניות
                            </button>
                        </div>

                    </div>
                </div>

                <ProductReviews productId={product.id} />

            </div>

            <Footer />
        </main>
    );
}
