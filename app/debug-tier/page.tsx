'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateSubscription } from '@/app/actions/subscription';

export default function DebugTierPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [updating, setUpdating] = useState(false);

    const updateTier = async (tier: 'SILVER' | 'GOLD' | 'PLATINUM') => {
        setUpdating(true);
        try {
            const plan = tier === 'SILVER' ? 'BASIC' : 'PRO';
            const result = await updateSubscription({
                plan: plan as any,
                tier: tier
            });

            if (result.success) {
                // Force session update
                await update();
                router.refresh();
                alert(`Tier updated to ${tier}! Please refresh the page.`);
            } else {
                alert(result.error || 'Error updating tier');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating tier');
        } finally {
            setUpdating(false);
        }
    };

    if (!session) {
        return <div className="p-8">Please log in first</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8" dir="rtl">
            <h1 className="text-3xl font-bold mb-6">בדיקת Tier</h1>

            <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h2 className="text-xl mb-4">מצב נוכחי:</h2>
                <p className="text-lg">
                    <strong>שם:</strong> {session.user?.name}
                </p>
                <p className="text-lg">
                    <strong>אימייל:</strong> {session.user?.email}
                </p>
                <p className="text-lg">
                    <strong>Plan נוכחי:</strong>{' '}
                    <span className="text-yellow-400">
                        {(session.user as any)?.tier || 'SILVER'}
                    </span>
                </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl mb-4">עדכן Plan:</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => updateTier('SILVER')}
                        disabled={updating}
                        className="px-6 py-3 bg-stone-500 hover:bg-stone-600 rounded-lg disabled:opacity-50 font-bold"
                    >
                        SILVER
                    </button>
                    <button
                        onClick={() => updateTier('GOLD')}
                        disabled={updating}
                        className="px-6 py-3 bg-[#C37D46] hover:bg-[#A66330] rounded-lg disabled:opacity-50 font-bold"
                    >
                        GOLD
                    </button>
                    <button
                        onClick={() => updateTier('PLATINUM')}
                        disabled={updating}
                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg disabled:opacity-50 font-bold"
                    >
                        PLATINUM
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                    חזור לדף הבית
                </button>
            </div>
        </div>
    );
}
