"use client";

import { useState, useTransition, useOptimistic } from 'react';
import { User, UserTier } from '@/src/types';
import { upgradeUserTier } from '@/app/actions/subscription';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VIPDashboardProps {
    user: User;
}

const TIER_STYLES: Record<UserTier, { color: string; border: string; glow: string; icon: React.ElementType }> = {
    SILVER: {
        color: "text-slate-300",
        border: "border-slate-500",
        glow: "shadow-slate-500/20",
        icon: Star
    },
    GOLD: {
        color: "text-yellow-400",
        border: "border-yellow-500",
        glow: "shadow-yellow-500/20",
        icon: Crown
    },
    PLATINUM: {
        color: "text-cyan-300",
        border: "border-cyan-400",
        glow: "shadow-cyan-400/20",
        icon: Crown
    }
};

export default function VIPDashboard({ user }: VIPDashboardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [optimisticTier, updateOptimisticTier] = useOptimistic<UserTier, UserTier>(
        user.tier,
        (_, newTier) => newTier
    );

    // Fallback for missing tier styles if any
    const activeStyle = TIER_STYLES[optimisticTier as UserTier] || TIER_STYLES.SILVER;
    const Icon = activeStyle.icon;

    const handleUpgrade = (tier: UserTier) => {
        if (tier === optimisticTier) return; // Already on this tier

        startTransition(async () => {
            // Optimistic update
            updateOptimisticTier(tier);

            // Server Action
            const result = await upgradeUserTier(user.id, tier);

            if (!result.success) {
                // Handle error (toast or alert)
                console.error(result.error);
                // In a real app, we would revert optimistic state or show error
                alert(result.error || "Failed to upgrade");
            } else {
                router.refresh();
            }
        });
    };

    const tiers: { id: UserTier; name: string; price: string; features: string[] }[] = [
        {
            id: 'SILVER',
            name: 'Silver Barista',
            price: 'Free',
            features: ['Basic Support', 'Standard Shipping', 'Access to Daily Brews']
        },
        {
            id: 'GOLD',
            name: 'Gold Connoisseur',
            price: '$9.99/mo',
            features: ['Priority Support', 'Free Shipping', 'Early Access to Beans', '5% Discount']
        },
        {
            id: 'PLATINUM',
            name: 'Platinum Master',
            price: '$19.99/mo',
            features: ['Dedicated Concierge', 'Same-Day Shipping', 'Exclusive Rare Origins', '15% Discount', 'Personalized Blends']
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <header className="mb-12 flex flex-col items-center justify-center space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-full border-2 ${activeStyle.border} ${activeStyle.glow} shadow-2xl bg-neutral-900`}
                >
                    <Icon className={`w-12 h-12 ${activeStyle.color}`} />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
                    VIP Dashboard
                </h1>
                <p className="text-neutral-400">
                    Current Status: <span className={`font-semibold ${activeStyle.color}`}>{optimisticTier}</span>
                </p>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier) => {
                    const isCurrent = optimisticTier === tier.id;
                    const style = TIER_STYLES[tier.id];

                    return (
                        <motion.div
                            key={tier.id}
                            whileHover={{ y: -5 }}
                            className={`
                                relative overflow-hidden rounded-2xl p-8 border 
                                ${isCurrent ? `${style.border} bg-neutral-900/50` : 'border-neutral-800 bg-neutral-900/20'}
                                transition-all duration-300
                            `}
                        >
                            {isCurrent && (
                                <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold ${style.color} bg-neutral-800 rounded-bl-xl`}>
                                    CURRENT
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <style.icon className={`w-6 h-6 ${style.color}`} />
                                <h3 className={`text-xl font-semibold ${style.color}`}>{tier.name}</h3>
                            </div>

                            <div className="mb-6">
                                <span className="text-3xl font-bold">{tier.price}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleUpgrade(tier.id)}
                                disabled={isPending || isCurrent}
                                className={`
                                    w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2
                                    transition-all duration-200
                                    ${isCurrent
                                        ? 'bg-neutral-800 text-neutral-500 cursor-default'
                                        : `bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-${style.color.split('-')[1]}-500`
                                    }
                                `}
                            >
                                {isPending && !isCurrent ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    isCurrent ? 'Active Plan' : 'Select Plan'
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </main>
        </div>
    );
}
