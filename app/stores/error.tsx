'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('STORES_RUNTIME_ERROR:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-red-50 rounded-xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-800 mb-4">אופס! משהו השתבש בהצגת הסניפים</h2>
            <p className="text-red-600 mb-6 max-w-md">
                אנחנו מצטערים על התקלה. השגיאה שנרשמה: <br />
                <code className="bg-red-100 px-2 py-1 rounded mt-2 inline-block text-xs font-mono">
                    {error.message || 'שגיאת שרת לא ידועה'}
                </code>
            </p>
            {error.digest && (
                <p className="text-xs text-red-400 mb-6">Error ID: {error.digest}</p>
            )}
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-bold"
            >
                נסה שוב
            </button>
        </div>
    );
}
