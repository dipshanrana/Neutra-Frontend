import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Products } from "@/components/Products";
import { OurStory } from "@/components/OurStory";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import { Categories } from "@/components/Categories";
import { HomeBlogs } from "@/components/HomeBlogs";
import { InformationOverview } from "@/components/InformationOverview";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ffffff] selection:bg-[#D4AF37] selection:text-white">
      <Navbar />
      <Hero />
      <Products />
      <OurStory />
      <Categories />
      <HomeBlogs />
      <Features />
      <InformationOverview />
      <PreFooter />
      <Footer />
    </main>
  );
}

