"use client";

import React, { useOptimistic, useTransition, useState } from "react";
import Image from "next/image";
import { Crown, Sparkles, Coffee, ShieldCheck } from "lucide-react";
import { Plan, Subscription } from "@/src/types";
import PlanCard from "@/components/vip/PlanCard";
import { updateSubscription } from "@/app/actions/subscription.ts";

interface VIPPageProps {
    initialSubscription: Subscription | null;
}

const PLANS = [
    {
        type: Plan.FREE,
        price: "$0",
        description: "Experience the basics of Cyber Barista AI.",
        features: ["5 AI Coffee Suggestions/day", "Basic Recipe Access", "Community Support"]
    },
    {
        type: Plan.BASIC,
        price: "$9.99",
        description: "Perfect for daily coffee enthusiasts.",
        features: ["Unlimited AI Suggestions", "Extended Recipe Library", "Personal Coffee Log", "Priority Support"]
    },
    {
        type: Plan.PRO,
        price: "$19.99",
        description: "The ultimate experience for true connoisseurs.",
        features: ["Everything in Basic", "Private Barista AI", "Exclusive Rare Blends", "Early Access to Features", "No Service Fees"]
    }
];

export default function VIPDashboard({ initialSubscription }: VIPPageProps) {
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(initialSubscription);
    const [isPending, startTransition] = useTransition();

    const [optimisticSubscription, setOptimisticSubscription] = useOptimistic(
        currentSubscription,
        (state, newPlan: Plan) => {
            if (!state) return {
                id: "temp-id",
                userId: "temp-user",
                plan: newPlan,
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Subscription;

            return { ...state, plan: newPlan };
        }
    );

    const handleUpgrade = async (plan: Plan) => {
        startTransition(async () => {
            setOptimisticSubscription(plan);
            try {
                const result = await updateSubscription({ plan });
                if (result.success) {
                    setCurrentSubscription(result.subscription);
                }
            } catch (error) {
                console.error("Failed to upgrade subscription:", error);
                // In a real app, you might show a toast error here
            }
        });
    };

    const currentPlan = optimisticSubscription?.plan || Plan.FREE;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* Hero Section */}
                <div className="text-center mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 text-sm font-medium mb-6">
                        <Crown size={16} />
                        <span>Cyber Barista VIP Club</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Coffee Ritual</span>
                    </h1>

                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
                        Join our exclusive inner circle and unlock professional-grade AI tools,
                        secret recipes, and a world-class brewing experience.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-amber-500/50" />
                            <span>Safe & Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-500/50" />
                            <span>Instant AI Activation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Coffee size={18} className="text-amber-500/50" />
                            <span>Secret VIP Blends</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {PLANS.map((plan) => (
                        <PlanCard
                            key={plan.type}
                            plan={plan}
                            isCurrent={currentPlan === plan.type}
                            onUpgrade={handleUpgrade}
                            isPending={isPending}
                        />
                    ))}
                </div>

                {/* Banner Section */}
                <div className="mt-32 relative rounded-[40px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40" />
                    <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Secret Menu Unlocked</h2>
                            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                Our PRO members get weekly shipments of beans sourced from high-altitude
                                micro-lots hidden in the mountains of Ethiopia and Colombia. Not available to the public.
                            </p>
                            <button
                                onClick={() => handleUpgrade(Plan.PRO)}
                                className="px-8 py-4 bg-white text-zinc-950 rounded-full font-bold hover:bg-zinc-200 transition-all"
                            >
                                Claim My Secret Blend
                            </button>
                        </div>
                        <div className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse" />
                            <Image
                                src="/coffee-bag.png"
                                alt="VIP Coffee Bag"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
