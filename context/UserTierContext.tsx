'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export type Tier = 'FREE' | 'BASIC' | 'PRO';

interface TierData {
    name: Tier;
    level: number;
}

const TIER_MAP: Record<string, number> = {
    'FREE': 1,
    'BASIC': 2,
    'PRO': 3,
};

interface UserTierContextType {
    tier: TierData;
    isLoading: boolean;
    hasAccess: (minTier: Tier) => boolean;
}

// Default to FREE (Level 1) for guests/errors
const DEFAULT_TIER: TierData = { name: 'FREE', level: 1 };

const UserTierContext = createContext<UserTierContextType | undefined>(undefined);

export function UserTierProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [tierData, setTierData] = useState<TierData>(DEFAULT_TIER);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'authenticated' && session?.user) {
            const userSubscription = (session.user as any).subscription;
            const userPlan = userSubscription?.plan || 'FREE';

            // Normalize case if needed
            const matchedTier = Object.keys(TIER_MAP).find(
                key => key.toUpperCase() === userPlan.toUpperCase()
            ) || 'FREE';

            setTierData({
                name: matchedTier as Tier,
                level: TIER_MAP[matchedTier] || 1
            });
        } else {
            // Guest -> FREE
            setTierData(DEFAULT_TIER);
        }
        setIsLoading(false);
    }, [session, status]);

    const hasAccess = (minTier: Tier): boolean => {
        const requiredLevel = TIER_MAP[minTier];
        // If loading, deny access to avoid flashing content
        if (isLoading) return false;
        return tierData.level >= requiredLevel;
    };

    return (
        <UserTierContext.Provider value={{ tier: tierData, isLoading, hasAccess }}>
            {children}
        </UserTierContext.Provider>
    );
}

export function useUserTier() {
    const context = useContext(UserTierContext);
    if (!context) {
        throw new Error('useUserTier must be used within a UserTierProvider');
    }
    return context;
}
