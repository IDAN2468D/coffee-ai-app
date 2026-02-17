
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SafeUser } from "@/src/types";
import { redirect } from "next/navigation";
import PunchCard from "@/components/loyalty/PunchCard";
import Navbar from "@/components/TempNavbar";
import Footer from "@/components/AppFooter";
import { Crown } from "lucide-react";

export default async function LoyaltyPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth/signin?callbackUrl=/loyalty");
    }



    // ...

    const user = (await prisma.user.findUnique({
        where: { email: session.user.email },
    })) as unknown as SafeUser;

    if (!user) {
        // Should not happen if session is valid usually
        redirect("/auth/signin");
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center">
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#2D1B14]/5 px-4 py-2 rounded-full border border-[#2D1B14]/10 text-[#2D1B14]">
                        <Crown size={18} />
                        <span className="text-sm font-bold tracking-widest uppercase">מועדון הנאמנות</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-black text-[#2D1B14] tracking-tight">
                        הכרטיסייה <span className="text-[#C37D46]">שלך</span>
                    </h1>
                    <p className="text-xl text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
                        קנה 9 משקאות, וקבל את העשירי עלינו! כי מגיע לך להתפנק.
                    </p>
                </div>

                <PunchCard currentPoints={user.loyaltyPoints || 0} />

                <div className="mt-12 text-center text-sm text-stone-500">
                    <p>* תקף לכל המשקאות בגודל בסיסי.</p>
                    <p>* ההטבה מתעדכנת אוטומטית בחשבונך.</p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
