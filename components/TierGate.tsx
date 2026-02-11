'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

/**
 * Membership Tier Hierarchy (Numeric System)
 * 1 = BASIC
 * 2 = PRO
 */
const TIER_LEVELS: Record<string, number> = {
    'BASIC': 1,
    'PRO': 2,
};

interface TierGateProps {
    /** The strict minimum tier required to render the content */
    requiredTier: 'BASIC' | 'PRO';
    /** The content to be gated */
    children: React.ReactNode;
}

/**
 * A Strict Feature Gating Component.
 * 
 * Logic:
 * - Checks the current user's subscription tier.
 * - If user's tier level >= requiredTier level -> Renders children.
 * - If user's tier level < requiredTier level -> Returns NULL (Nothing rendered).
 */
export default function TierGate({ requiredTier, children }: TierGateProps) {
    const { data: session, status } = useSession();

    // 1. Handle Loading/Unauthenticated states securely (Default to Deny)
    if (status === 'loading' || status === 'unauthenticated') {
        return null;
    }

    // 2. Determine User's Tier Level
    // Access plan from session.user.subscription. Default to 0 if missing.
    const userTierName = (session?.user as any)?.subscription?.plan;
    const userLevel = userTierName ? (TIER_LEVELS[userTierName] || 0) : 0;

    // 3. Determine Required Level
    const requiredLevel = TIER_LEVELS[requiredTier];

    // 4. Strict Comparison Rule
    if (userLevel < requiredLevel) {
        // Access Denied: Render absolutely nothing.
        return null;
    }

    // 5. Access Granted
    return <>{children}</>;
}
