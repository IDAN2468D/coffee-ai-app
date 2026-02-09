'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center" dir="rtl">
            <h2 className="text-2xl font-bold text-[#2D1B14] mb-4">שגיאה בטעינת הדף</h2>
            <p className="text-red-500 mb-6 bg-red-50 p-4 rounded-lg text-left" dir="ltr">
                {error.message || 'שגיאה לא ידועה'}
            </p>
            <button
                onClick={() => reset()}
                className="bg-[#2D1B14] text-white px-6 py-2 rounded-lg hover:bg-black transition-colors"
            >
                נסה שוב
            </button>
        </div>
    );
}
