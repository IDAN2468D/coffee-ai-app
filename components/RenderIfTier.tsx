'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

/**
 * Tier hierarchy mapping.
 * higher number = higher privilege.
 */
const TIER_LEVELS: Record<string, number> = {
    'SILVER': 0,
    'GOLD': 1,
    'PLATINUM': 2,
};

interface RenderIfTierProps {
    /** The minimum tier required to see the content */
    minTier: 'SILVER' | 'GOLD' | 'PLATINUM';
    /** Content to render if requirements are met */
    children: React.ReactNode;
    /** Optional fallback for unauthorized users (usually null per requirements) */
    fallback?: React.ReactNode;
}

/**
 * A strict tier-based rendering component.
 * Content is only rendered if the user's tier is greater than or equal to the minTier.
 */
export default function RenderIfTier({ minTier, children, fallback = null }: RenderIfTierProps) {
    const { data: session, status } = useSession();

    // While loading or unauthenticated, we don't render restricted content
    if (status === 'loading' || status === 'unauthenticated') {
        return <>{fallback}</>;
    }

    const userTier = (session?.user as any)?.subscription?.plan || 'BASIC';

    // Get numeric levels
    const userLevel = TIER_LEVELS[userTier] || 0;
    const requiredLevel = TIER_LEVELS[minTier];

    // strict check: if user level is less than required, render nothing (or fallback)
    if (userLevel < requiredLevel) {
        return <>{fallback}</>;
    }

    // Requirements met, render children
    return <>{children}</>;
}
