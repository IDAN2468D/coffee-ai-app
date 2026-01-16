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
}
