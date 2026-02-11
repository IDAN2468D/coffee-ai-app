"use client";

import React from "react";
import Image from "next/image";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Plan } from "@/src/types";

interface PlanCardProps {
    plan: {
        type: Plan;
        price: string;
        features: string[];
        description: string;
    };
    isCurrent: boolean;
    onUpgrade: (plan: Plan) => void;
    isPending: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrent, onUpgrade, isPending }) => {
    const isPro = plan.type === Plan.PRO;
    const isBasic = plan.type === Plan.BASIC;

    return (
        <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${isPro
                ? "border-amber-400/50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 shadow-amber-500/20"
                : "border-zinc-800 bg-zinc-900/50 backdrop-blur-xl"
            }`}>
            {isPro && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-amber-500 text-zinc-950 text-xs font-bold rounded-bl-xl flex items-center gap-1 animate-pulse">
                    <Crown size={12} /> BEST VALUE
                </div>
            )}

            <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${isPro ? "bg-amber-500/10 text-amber-500" : "bg-zinc-800 text-zinc-400"}`}>
                        {isPro ? <Crown size={24} /> : isBasic ? <Zap size={24} /> : <Star size={24} />}
                    </div>
                    <h3 className="text-2xl font-bold text-white capitalize">{plan.type.toLowerCase()}</h3>
                </div>

                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                    {plan.description}
                </p>

                <div className="mb-8">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-500 ml-2">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-300">
                            <div className={`mt-1 p-0.5 rounded-full ${isPro ? "bg-amber-500/20 text-amber-500" : "bg-zinc-800 text-zinc-500"}`}>
                                <Check size={14} />
                            </div>
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => onUpgrade(plan.type)}
                    disabled={isCurrent || isPending}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isCurrent
                            ? "bg-zinc-800 text-zinc-500 cursor-default"
                            : isPro
                                ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                : "bg-white text-zinc-950 hover:bg-zinc-200"
                        } ${isPending ? "opacity-70 cursor-wait" : ""}`}
                >
                    {isCurrent ? "Current Plan" : isPending ? "Upgrading..." : `Upgrade to ${plan.type}`}
                </button>
            </div>

            {isPro && (
                <div className="absolute -bottom-12 -right-12 opacity-5 pointer-events-none">
                    <Crown size={200} className="text-amber-500" />
                </div>
            )}
        </div>
    );
};

export default PlanCard;
