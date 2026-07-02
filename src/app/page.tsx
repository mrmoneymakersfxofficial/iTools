import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { TopDealsSection } from "@/components/home/TopDealsSection";
import { DealsSection, FeaturedSection, NewArrivalsSection } from "@/components/home/ProductSections";
import { BrandShowcase } from "@/components/home/BrandShowcase";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section data-section="Hero — Ofertas Destacadas">
          <HeroSlider />
        </section>

        <section data-section="Ofertas del Día">
          <TopDealsSection />
        </section>

        <section data-section="¿Por Qué Elegir iTools?">
          <TrustBar />
        </section>

        <section data-section="Categorías Populares">
          <CategoriesSection />
        </section>

        <section data-section="Ofertas Especiales">
          <DealsSection />
        </section>

        <section data-section="Marcas Oficiales">
          <BrandShowcase />
        </section>

        <section data-section="Productos Destacados">
          <FeaturedSection />
        </section>

        <section data-section="Nuevos Ingresos">
          <NewArrivalsSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}