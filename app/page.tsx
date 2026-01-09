import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Highlights from "@/components/Highlights";
import BeanBanner from "@/components/BeanBanner";
import CoffeeShop from "@/components/CoffeeShop";
import Subscription from "@/components/Subscription";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/Footer";

export default async function Home() {
  const products = await prisma.product.findMany();
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
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-serif font-bold text-[#2D1B14]">Discover Our Menu</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Explore our curated selection of artisanal coffee and fresh pastries.</p>
          </div>
          <CoffeeShop initialProducts={products} />
        </div>
      </section>

      <Subscription />

      <Footer />
    </main>
  );
}
