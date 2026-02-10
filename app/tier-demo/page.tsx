'use client';

import React from 'react';
import ProtectFeature from '@/components/ProtectFeature';
import { useUserTier } from '@/context/UserTierContext';

export default function TierDemoPage() {
    const { tier, isLoading } = useUserTier();

    if (isLoading) return <div className="p-8">Loading tier data...</div>;

    return (
        <div className="p-8 space-y-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">Context-Based Tier System Demo</h1>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Current User Status</h2>
                <p><strong>Tier Name:</strong> {tier.name}</p>
                <p><strong>Numeric Level:</strong> {tier.level}</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Feature Visibility Tests</h2>

                {/* Silver Feature */}
                <div className="p-4 border rounded relative">
                    <span className="absolute top-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded">Silver+</span>
                    <ProtectFeature minTier="Silver">
                        <div className="text-green-600 font-bold">✅ Visible to Silver, Gold, Platinum</div>
                    </ProtectFeature>
                </div>

                {/* Gold Feature */}
                <div className="p-4 border rounded relative">
                    <span className="absolute top-2 right-2 text-xs bg-yellow-200 px-2 py-1 rounded">Gold+</span>
                    <ProtectFeature minTier="Gold" fallback={<div className="text-red-400">⛔ Hidden (Requires Gold)</div>}>
                        <div className="text-green-600 font-bold">✅ Visible to Gold & Platinum</div>
                    </ProtectFeature>
                </div>

                {/* Platinum Feature */}
                <div className="p-4 border rounded relative">
                    <span className="absolute top-2 right-2 text-xs bg-purple-200 px-2 py-1 rounded">Platinum+</span>
                    <ProtectFeature minTier="Platinum" fallback={<div className="text-red-400">⛔ Hidden (Requires Platinum)</div>}>
                        <div className="text-green-600 font-bold">✅ Visible ONLY to Platinum</div>
                    </ProtectFeature>
                </div>
            </div>
        </div>
    );
}
