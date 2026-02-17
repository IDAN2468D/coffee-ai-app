
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addLoyaltyPoint } from '@/app/actions/loyalty'; // Assuming this exists from previous step

interface PunchCardProps {
    currentPoints: number; // 0-9 usually, or 0-10
}

export default function PunchCard({ currentPoints = 0 }: PunchCardProps) {
    const totalSlots = 10;
    const [points, setPoints] = useState(currentPoints);
    const [loading, setLoading] = useState(false);

    const handlePunch = async () => {
        setLoading(true);
        // Optimistic update? Or wait for server?
        // Let's wait for server to confirm "Stamp".

        try {
            // In real app, this is triggered by Order Completion, not user click usually.
            // However, for "PunchCard" component demo/admin, we might add a button? 
            // Or just display?
            // The prompt says: "Use Framer Motion to 'stamp' the slot when a user buys coffee."
            // This implies it might be a passive display or interactive Demo.
            // Let's make it interactive for testing "Buy 9 Get 1".

            const res = await addLoyaltyPoint();
            if (res.success && res.data) {
                setPoints(res.data.points);
                if (res.data.rewardEarned) {
                    triggerConfetti();
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return (
        <div className="bg-[#2D1B14] p-6 rounded-3xl w-full max-w-md shadow-2xl border border-gold/20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-bold font-serif">Coffee Loyalty</h2>
                <span className="text-gold bg-white/10 px-3 py-1 rounded-full text-sm">
                    {points} / {totalSlots}
                </span>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-6">
                {Array.from({ length: totalSlots }).map((_, i) => {
                    const isFilled = i < points;
                    return (
                        <div key={i} className="relative aspect-square">
                            {/* Empty Slot */}
                            <div className="absolute inset-0 bg-white/5 rounded-full border-2 border-dashed border-white/20" />

                            {/* Filled Stamp */}
                            {isFilled && (
                                <motion.div
                                    initial={{ scale: 2, opacity: 0, rotate: -45 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    className="absolute inset-0 bg-[#C37D46] rounded-full flex items-center justify-center shadow-lg border-2 border-[#E5B585]"
                                >
                                    <Coffee className="text-[#2D1B14] w-3/5 h-3/5" strokeWidth={2.5} />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={handlePunch}
                disabled={loading}
                className="w-full py-3 bg-[#C37D46] hover:bg-[#B26D3B] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
                {loading ? "Punching..." : "Simulate Purchase (+1)"}
            </button>
        </div>
    );
}
