import { getGiftCardByCode } from "@/app/actions/giftcard";
import GiftRedeemClient from "./GiftRedeemClient";

interface GiftPageProps {
    params: Promise<{ code: string }>;
}

export default async function GiftPage({ params }: GiftPageProps) {
    const { code } = await params;
    const result = await getGiftCardByCode(code);

    if (!result.success || !result.data) {
        return (
            <main className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-8" dir="rtl">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-6xl">😕</div>
                    <h1 className="text-3xl font-serif font-bold text-[#2D1B14]">
                        גיפט קארד לא נמצא
                    </h1>
                    <p className="text-stone-500">
                        {result.error || "הקוד שהזנת לא תקין או שפגה תוקפו"}
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-[#2D1B14] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                    >
                        חזרה לחנות
                    </a>
                </div>
            </main>
        );
    }

    return <GiftRedeemClient giftCard={result.data} />;
}
