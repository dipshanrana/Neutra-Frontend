import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Products } from "@/components/Products";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import { Categories } from "@/components/Categories";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ffffff] selection:bg-emerald-600 selection:text-white">
      <Navbar />
      <Hero />
      <Products />
      <Categories />
      <Features />
      <PreFooter />
      <Footer />
    </main>
  );
}
