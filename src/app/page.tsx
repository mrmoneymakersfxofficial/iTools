import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { DealsSection, FeaturedSection, NewArrivalsSection } from "@/components/home/ProductSections";
import { BrandShowcase } from "@/components/home/BrandShowcase";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <TrustBar />
        <CategoriesSection />
        <DealsSection />
        <BrandShowcase />
        <FeaturedSection />
        <NewArrivalsSection />
      </main>
      <Footer />
    </div>
  );
}