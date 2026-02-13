'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserTier, TIER_BENEFITS } from '@/lib/tiers';

interface FeatureLockProps {
    children: React.ReactNode;
    userTier: UserTier;
    requiredTier: UserTier;
    message?: string;
}

const TIER_ORDER: UserTier[] = ['SILVER', 'GOLD', 'PLATINUM'];

export const FeatureLock: React.FC<FeatureLockProps> = ({
    children,
    userTier,
    requiredTier,
    message
}) => {
    const userTierIndex = TIER_ORDER.indexOf(userTier);
    const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
    const isLocked = userTierIndex < requiredTierIndex;

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative group">
            <div className="blur-sm pointer-events-none select-none opacity-50 transition-all">
                {children}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-background/80 backdrop-blur-md border border-border p-6 rounded-2xl shadow-2xl max-w-xs"
                >
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">שדרגו ל-{requiredTier}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {message || `תכונה זו זמינה לחברי ${requiredTier} ומעלה`}
                    </p>
                    <button
                        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        onClick={() => window.location.href = '/dashboard/subscription'}
                    >
                        גלו את ההטבות
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
