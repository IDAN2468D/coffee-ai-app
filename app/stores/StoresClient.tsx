'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { IProcessedBranch } from './page';

// Dynamically import StoreMap only on the client
const StoreMap = dynamic(() => import('@/components/StoreMap'), {
    loading: () => (
        <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-500 font-medium">
            הופך סניפים למפה...
        </div>
    ),
    ssr: false
});

interface StoresClientProps {
    branches: IProcessedBranch[];
}

export default function StoresClient({ branches }: StoresClientProps) {
    return (
        <div className="container mx-auto px-4 py-8" dir="rtl">
            <h1 className="text-4xl font-bold mb-8 text-center text-amber-900 font-serif">הסניפים שלנו</h1>

            <div className="max-w-4xl mx-auto mb-10 text-center">
                <p className="text-lg text-stone-600 mb-6">
                    מצאו את הסניף הקרוב אליכם של Cyber Barista. אנחנו מגישים את קפה העתיד בכל רחבי הארץ.
                </p>
            </div>

            <div className="mb-12">
                <StoreMap branches={branches} />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-right">
                {branches.length > 0 ? (
                    branches.map((branch) => (
                        <div key={branch._id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all group">
                            <h3 className="text-xl font-bold mb-2 text-amber-800 font-serif group-hover:text-[#C37D46] transition-colors">
                                {branch.name}
                            </h3>
                            <p className="text-stone-500 mb-3 text-sm">{branch.address}</p>
                            {branch.phoneNumber && (
                                <p className="text-stone-400 text-sm mb-6 flex items-center gap-2">
                                    <span className="opacity-60 text-lg">📞</span> {branch.phoneNumber}
                                </p>
                            )}
                            <a
                                href={`https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-amber-600 font-bold hover:text-amber-800 transition-colors"
                            >
                                ניווט עם Waze &larr;
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-stone-400">
                        לא נמצאו סניפים במערכת.
                    </div>
                )}
            </div>
        </div>
    );
}
