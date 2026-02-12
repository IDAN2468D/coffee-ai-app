"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sparkles, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react"

interface StepResultProps {
    product: any
    isLoading: boolean
    onRestart: () => void
    onAddToCart: () => void
}

export default function StepResult({ product, isLoading, onRestart, onAddToCart }: StepResultProps) {
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 border-4 border-[#C37D46]/20 border-t-[#C37D46] rounded-full"
                    />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#C37D46] animate-pulse" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-black text-[#2D1B14]">מנתחים את פרופיל הטעם...</h2>
                    <p className="text-stone-400">הבריסטה הדיגיטלי שלנו בוחן את כל הפולים במחסן</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <RefreshCw className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-black text-[#2D1B14]">משהו השתבש...</h2>
                    <p className="text-stone-400">לא הצלחנו למצוא התאמה כרגע. נסו שוב?</p>
                </div>
                <button
                    onClick={onRestart}
                    className="px-8 py-3 bg-[#C37D46] text-white rounded-xl font-bold hover:bg-[#a86535] transition-all"
                >
                    התחל מחדש
                </button>
            </div>
        )
    }

    return (
        <div className="py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-[#E8CBAD]/30"
            >
                <div className="grid md:grid-cols-2">
                    <div className="relative aspect-square md:aspect-auto h-full">
                        <img
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 right-6 bg-yellow-400 text-[#2D1B14] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                            התאמה מושלמת!
                        </div>
                    </div>

                    <div className="p-10 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[#C37D46] text-xs font-black tracking-widest uppercase">
                                <Sparkles size={14} />
                                המלצת ה-AI
                            </div>
                            <h2 className="text-3xl font-serif font-black text-[#2D1B14] leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                {product.description}
                            </p>
                            <div className="text-2xl font-black text-[#2D1B14]">₪{product.price.toFixed(2)}</div>
                        </div>

                        <div className="space-y-4 pt-8">
                            <button
                                onClick={onAddToCart}
                                className="w-full bg-[#C37D46] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#a86535] transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                הוסף לסל עכשיו
                            </button>
                            <button
                                onClick={onRestart}
                                className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-stone-600 font-bold transition-all"
                            >
                                <RefreshCw size={14} />
                                נסו שוב
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
