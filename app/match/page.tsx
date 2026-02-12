"use client"

import React, { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import Navbar from "@/components/TempNavbar"
import Footer from "@/components/AppFooter"
import StepRoast from "@/components/match/StepRoast"
import StepFlavor from "@/components/match/StepFlavor"
import StepResult from "@/components/match/StepResult"
import { matchCoffee } from "@/app/actions/matchmaker"
import { useCart } from "@/lib/store"
import type { Product } from "@/lib/products"
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react"

type Step = "ROAST" | "FLAVOR" | "RESULT"
type RoastLevel = "LIGHT" | "MEDIUM" | "DARK"
type FlavorNote = "FRUITY" | "NUTTY" | "CHOCOLATY"

export default function MatchPage() {
    const [step, setStep] = useState<Step>("ROAST")
    const [roast, setRoast] = useState<RoastLevel | null>(null)
    const [flavor, setFlavor] = useState<FlavorNote | null>(null)
    const [matchedProduct, setMatchedProduct] = useState<Product | null>(null)
    const [isPending, startTransition] = useTransition()
    const { addItem } = useCart()
    const { data: session } = useSession()

    const handleMatch = async (fLevel: FlavorNote) => {
        setFlavor(fLevel)
        setStep("RESULT")

        startTransition(async () => {
            // Fake AI delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            const res = await matchCoffee({
                roastLevel: roast!,
                flavorNotes: fLevel
            })

            if (res.success && res.data) {
                setMatchedProduct(res.data as unknown as Product)
            }
        })
    }

    const restart = () => {
        setStep("ROAST")
        setRoast(null)
        setFlavor(null)
        setMatchedProduct(null)
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0]" dir="rtl">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-[#C37D46]/10 text-[#C37D46] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-[#C37D46]/20"
                    >
                        <Sparkles size={14} />
                        AI Coffee Matchmaker
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-[#2D1B14] leading-[1.1]">
                        מצא את הבלנד <br /> <span className="text-[#C37D46]">המדויק עבורך</span>
                    </h1>
                </div>

                {/* Progress Bar */}
                {step !== "RESULT" && (
                    <div className="max-w-md mx-auto mb-12 flex items-center gap-4">
                        <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step === "ROAST" || step === "FLAVOR" ? "bg-[#C37D46]" : "bg-stone-200"}`} />
                        <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step === "FLAVOR" ? "bg-[#C37D46]" : "bg-stone-200"}`} />
                    </div>
                )}

                {/* Wizard Container */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {step === "ROAST" && (
                            <motion.div
                                key="step-roast"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <StepRoast
                                    selected={roast}
                                    onSelect={(r) => {
                                        setRoast(r)
                                        setStep("FLAVOR")
                                    }}
                                />
                            </motion.div>
                        )}

                        {step === "FLAVOR" && (
                            <motion.div
                                key="step-flavor"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="flex justify-start mb-4">
                                    <button
                                        onClick={() => setStep("ROAST")}
                                        className="flex items-center gap-2 text-stone-400 hover:text-[#C37D46] transition-colors font-bold"
                                    >
                                        <ArrowRight size={18} />
                                        חזרה
                                    </button>
                                </div>
                                <StepFlavor
                                    selected={flavor}
                                    onSelect={handleMatch}
                                />
                            </motion.div>
                        )}

                        {step === "RESULT" && (
                            <motion.div
                                key="step-result"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                            >
                                <StepResult
                                    product={matchedProduct}
                                    isLoading={isPending}
                                    isLoggedIn={!!session?.user}
                                    onRestart={restart}
                                    onAddToCart={() => {
                                        if (matchedProduct) addItem(matchedProduct)
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </main>
    )
}
