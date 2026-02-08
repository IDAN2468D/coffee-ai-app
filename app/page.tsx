import Navbar from "@/components/AppNavbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CoffeeShop from "@/components/CoffeeShop";
import PopularTaste from "@/components/PopularTaste";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import Footer from "@/components/AppFooter";
import Highlights from "@/components/Highlights";
import Subscription from "@/components/Subscription";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      <Hero />

      {/* Optional: Features/Highlights strip if fits design, keeping simpler for now */}

      <AboutSection />

      <PopularTaste products={products} />

      <CoffeeShop initialProducts={products} />

      <Subscription />

      <Footer />
    </main>
  );
}
