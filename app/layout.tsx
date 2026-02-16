import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AIPairingPopup from "@/components/AIPairingPopup";
import VirtualCafe from "@/components/VirtualCafe";
import DailyScratchCard from "@/components/DailyScratchCard";
import AIChatWidget from "@/components/AIChatWidget";

export const metadata: Metadata = {
  title: "Cyber Barista | בית קלייה וקפה פרימיום",
  description: "חווית קפה דיגיטלית מתקדמת עם בריסטה AI ומשלוחים עד הבית",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    return (
      <html lang="he" dir="rtl">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        </head>
        <body className="antialiased font-sans">
          <Providers>
            {children}
            <AIPairingPopup />
            <VirtualCafe />
            <DailyScratchCard />
            <AIChatWidget />
          </Providers>
        </body>
      </html>
    );
  } catch (error) {
    // 🚨 THIS IS THE SPY: Trap the critical layout crash
    console.error("🔥 CRITICAL LAYOUT CRASH:", error);

    return (
      <html lang="he" dir="rtl">
        <body className="bg-[#0F0F0F] text-white flex items-center justify-center min-h-screen p-10 text-center">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-black text-red-500">SYSTEM CRITICAL ERROR</h1>
            <p className="text-stone-400 font-mono text-sm leading-relaxed">
              האפליקציה קרסה בשלב הטעינה הראשוני (Root Layout).
              <br />
              השגיאה נרשמה בשרת.
            </p>
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <code className="text-[10px] text-red-200">
                Check Render console logs for "🔥 CRITICAL LAYOUT CRASH"
              </code>
            </div>
          </div>
        </body>
      </html>
    );
  }
}
