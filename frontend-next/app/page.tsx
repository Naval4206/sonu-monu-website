import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <main>
      <div id="top"></div>

      <Hero />
      <Stats />
      <FeaturedProducts />
      <About />
      <WhyChooseUs />
    </main>
  );
}
