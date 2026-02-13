import Navbar from "@/components/TempNavbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CoffeeShop from "@/components/CoffeeShop";
import PopularTaste from "@/components/PopularTaste";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/AppFooter";
import Subscription from "@/components/Subscription";
import HappyHourBanner from "@/components/HappyHourBanner";
import { getContextData } from "@/app/actions/brewmaster";
import type { ContextData, Product } from "@/src/types";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: Product[] = [];
  let contextData: ContextData | null = null;

  try {
    const [productsResult, contextResult] = await Promise.all([
      prisma.product.findMany({ include: { category: true } }),
      getContextData(),
    ]);
    products = productsResult.map(p => ({
      ...p,
      image: p.image || '',
      category: (p.category?.name as any) || 'Hot'
    }));
    if (contextResult.success && contextResult.data) {
      contextData = contextResult.data;
    }
  } catch (error) {
    console.error("Failed to fetch page data:", error);
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      <Hero context={contextData} />

      <HappyHourBanner />

      <AboutSection />

      <PopularTaste products={products as any} />

      <CoffeeShop initialProducts={products} />

      <Subscription />

      <Footer />
    </main>
  );
}

