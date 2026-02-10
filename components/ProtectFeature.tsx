'use client';

import React from 'react';
import { useUserTier, Tier } from '@/context/UserTierContext';

interface ProtectFeatureProps {
    /** Minimum tier required to see the content */
    minTier: Tier;
    /** Content to protect */
    children: React.ReactNode;
    /** Optional content to show if access is denied */
    fallback?: React.ReactNode;
}

/**
 * Context-aware feature protection component.
 * Uses the global UserTierContext to determine visibility.
 */
export default function ProtectFeature({ minTier, children, fallback = null }: ProtectFeatureProps) {
    const { hasAccess, isLoading } = useUserTier();

    // While loading, we can either show nothing or a loading spinner.
    // For security/privacy, showing nothing (or the fallback) is usually safer.
    if (isLoading) {
        return null;
    }

    if (!hasAccess(minTier)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
