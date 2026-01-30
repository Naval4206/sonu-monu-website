import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div id="top"></div>
        <Hero />
        <Stats />
        <FeaturedProducts />
        <About />
        <WhyChooseUs />
      </main>
    </>
  );
}
