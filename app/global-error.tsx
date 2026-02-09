'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="he" dir="rtl">
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" dir="rtl">
                    <h2 className="text-2xl font-bold mb-4 text-[#2D1B14]">שגיאה מערכתית</h2>
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6 max-w-md w-full text-left" dir="ltr">
                        <p className="font-bold">Error: {error.message || 'Unknown error'}</p>
                        {error.digest && <p className="text-xs mt-2 text-gray-500">Digest: {error.digest}</p>}
                    </div>
                    <button
                        onClick={() => reset()}
                        className="bg-[#2D1B14] text-white px-6 py-3 rounded-xl hover:bg-black transition-colors"
                    >
                        נסה שוב
                    </button>
                </div>
            </body>
        </html>
    );
}
