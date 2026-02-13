"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBrewProTips } from "@/app/actions/brew";
import { Timer, Play, Pause, RotateCcw, Lightbulb, ChefHat, CheckCircle } from "lucide-react";

const STEPS = [
    { id: 1, title: "חימום ושטיפה", desc: "חמם את הכלי ושטוף את פילטר הנייר במים חמים", time: 30 },
    { id: 2, title: "פריחה (Bloom)", desc: "מזוג 50 מ\"ל מים והתן לקפה 'לנשום' (להוציא גזים)", time: 45 },
    { id: 3, title: "מזיקה ראשונה", desc: "מזוג מים בתנועה מעגלית עד להגעה ל-50% מהכמות", time: 60 },
    { id: 4, title: "מזיגה סופית", desc: "השלם את המזיגה וסיים את החליטה", time: 60 },
];

import Image from "next/image";

export default function BrewMasterPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(STEPS[0].time);
    const [isActive, setIsActive] = useState(false);
    const [tips, setTips] = useState<string[]>([]);
    const [loadingTips, setLoadingTips] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && activeStep < STEPS.length - 1) {
            setIsActive(false);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft, activeStep]);

    const handleNext = () => {
        if (activeStep < STEPS.length - 1) {
            setActiveStep(prev => prev + 1);
            setTimeLeft(STEPS[activeStep + 1].time);
            setIsActive(false);
        }
    };

    const fetchTips = async () => {
        setLoadingTips(true);
        const res = await getBrewProTips("Ethiopia Gesha Village"); // Example coffee
        if (res.success && res.data) setTips(res.data);
        setLoadingTips(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans relative overflow-hidden">
            {/* Premium Background Layer */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none scale-110">
                <Image
                    src="/images/premium_hero_bg.png"
                    alt="Background"
                    fill
                    className="object-cover blur-3xl opacity-50"
                    priority
                />
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
                <div className="md:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -translate-y-16 translate-x-16" />
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/20">
                                <ChefHat className="text-amber-500 w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight">מדריך חליטה חכם</h1>
                        </div>

                        <div className="relative h-64 flex items-center justify-center bg-black/40 rounded-3xl border border-white/5 mb-8">
                            <div className="text-8xl font-mono font-bold text-amber-500">
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-full h-full rounded-3xl border-2 border-amber-500/20"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center gap-6">
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className="p-4 rounded-full bg-amber-500 text-black hover:scale-110 transition-transform"
                            >
                                {isActive ? <Pause /> : <Play />}
                            </button>
                            <button
                                onClick={() => { setTimeLeft(STEPS[activeStep].time); setIsActive(false); }}
                                className="p-4 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
                            >
                                <RotateCcw />
                            </button>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        {STEPS.map((step, idx) => (
                            <motion.div
                                key={step.id}
                                className={`p-6 rounded-2xl border transition-all ${activeStep === idx ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-900/30 border-white/5 opacity-50'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${activeStep === idx ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{step.title}</h3>
                                            <p className="text-sm text-gray-400">{step.desc}</p>
                                        </div>
                                    </div>
                                    {activeStep > idx && <CheckCircle className="text-green-500" />}
                                    {activeStep === idx && (
                                        <button
                                            onClick={handleNext}
                                            className="px-4 py-2 bg-amber-500/20 text-amber-500 rounded-lg text-sm font-bold"
                                        >
                                            הבא
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <Lightbulb className="text-amber-500" />
                            <h2 className="text-xl font-bold">טיפים מה-AI Brew Master</h2>
                        </div>

                        {!tips.length && !loadingTips ? (
                            <button
                                onClick={fetchTips}
                                className="w-full py-3 rounded-xl border border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                            >
                                קבל טיפים למקור הקפה שלך
                            </button>
                        ) : loadingTips ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-800 rounded-xl" />)}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tips.map((tip, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm italic text-amber-100"
                                    >
                                        "{tip}"
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
