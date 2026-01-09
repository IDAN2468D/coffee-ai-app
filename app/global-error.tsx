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
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">משהו השתבש...</h2>
                    <button
                        onClick={() => reset()}
                        className="bg-[#2D1B14] text-white px-6 py-3 rounded-xl"
                    >
                        נסה שוב
                    </button>
                </div>
            </body>
        </html>
    );
}
