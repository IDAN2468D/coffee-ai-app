
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Archive, Truck, CheckCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
    { status: 'PENDING', label: 'הזמנה התקבלה', icon: ClipboardList },
    { status: 'BREWING', label: 'בהכנה', icon: Package }, // Or Coffee icon
    { status: 'OUT_FOR_DELIVERY', label: 'בדרך אליך', icon: Truck },
    { status: 'DELIVERED', label: 'נמסר', icon: CheckCircle },
];

interface OrderTrackerProps {
    currentStatus: string; // 'PENDING' | 'BREWING' | ...
}

export default function OrderTracker({ currentStatus }: OrderTrackerProps) {
    // Determine active index based on status
    const activeIndex = STEPS.findIndex(s => s.status === currentStatus);
    // If not found (e.g. CANCELLED), maybe -1 or 0?
    // If CANCELLED, showing red or error might be better. 
    // For now assume happy path or standard enum.

    return (
        <div className="w-full py-8 px-4">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[#C37D46] -z-10 transform -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {STEPS.map((step, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.status} className="flex flex-col items-center gap-2 relative bg-[#FDFCF0] px-2">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? '#C37D46' : '#E5E5E5',
                                    borderColor: isCurrent ? '#B26D3B' : 'transparent'
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm border-4",
                                    isActive ? "text-white" : "text-stone-400"
                                )}
                            >
                                <Icon size={20} />
                            </motion.div>

                            <motion.div
                                className="text-xs font-bold text-stone-600 text-center absolute top-14 w-24"
                                animate={{ opacity: isActive ? 1 : 0.5 }}
                            >
                                {step.label}
                            </motion.div>

                            {isCurrent && (
                                <span className="absolute -top-1 right-0 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 text-center">
                {currentStatus === 'BREWING' && (
                    <p className="text-[#C37D46] animate-pulse font-medium">הבריסטה שלנו מכין את הקפה שלך באהבה... ☕</p>
                )}
                {currentStatus === 'OUT_FOR_DELIVERY' && (
                    <p className="text-[#C37D46] animate-bounce font-medium">השליח כבר בדרך! 🛵</p>
                )}
            </div>
        </div>
    );
}
