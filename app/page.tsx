import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Highlights from "@/components/Highlights";
import BeanBanner from "@/components/BeanBanner";
import CoffeeShop from "@/components/CoffeeShop";
import Subscription from "@/components/Subscription";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/Footer";

// Force dynamic rendering to ensure DB access happens at runtime, not build time
export const dynamic = 'force-dynamic';

export default async function Home() {
  let products = [];
  try {
    products = await prisma.product.findMany();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Fallback to empty array if DB fails (e.g. during build or connection error)
  }
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Hero />

      <div id="about">
        <AboutSection />
      </div>

      <Highlights />

      <BeanBanner />

      <section id="menu" className="py-24 bg-[#FDFCF0]">
        <div className="max-w-7xl mx-auto px-6 space-y-16" dir="rtl">
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2D1B14]">גלו את התפריט שלנו</h2>
            <p className="text-stone-500 text-xl max-w-2xl mx-auto">מבחר נאצר של קפה ארטיזנלי ומאפים טריים שנאפים במקום.</p>
          </div>
          <CoffeeShop initialProducts={products} />
        </div>
      </section>

      <Subscription />

      <Footer />
    </main>
  );
}
