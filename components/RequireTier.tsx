'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

/**
 * Membership Club Tier Hierarchy
 * Higher number = Higher privilege
 */
const TIER_LEVELS: Record<string, number> = {
    'BASIC': 1,
    'PRO': 2,
};

interface RequireTierProps {
    /** The minimum tier required to see the content */
    minTier: 'BASIC' | 'PRO';
    /** Content to render if requirements are met */
    children: React.ReactNode;
}

/**
 * A strict visibility control component for the Membership Club.
 * It strictly returns NULL if the user does not meet the required tier level.
 * No "locked" icons, no placeholders - complete invisibility.
 */
export default function RequireTier({ minTier, children }: RequireTierProps) {
    const { data: session, status } = useSession();

    // 1. Loading/Unauthenticated State:
    // For strict invisibility, we treat loading/unauth as "Access Denied" (null).
    if (status === 'loading' || status === 'unauthenticated') {
        return null;
    }

    // 2. Data Retrieval:
    // Get the user's plan from the session.user.subscription (defaults to level 0 if undefined)
    const userTier = (session?.user as any)?.subscription?.plan;
    const userLevel = userTier ? (TIER_LEVELS[userTier] || 0) : 0;

    // 3. Hierarchy Check:
    // Get the numeric requirement for the requested minTier
    const requiredLevel = TIER_LEVELS[minTier];

    // 4. Strict Enforcement:
    // If user's level is BELOW the required level, return null immediately.
    if (userLevel < requiredLevel) {
        return null;
    }

    // 5. Access Granted:
    // User meets or exceeds the requirement. Render the content.
    return <>{children}</>;
}
