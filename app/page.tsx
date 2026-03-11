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
import { Suspense } from "react";
import { api, getProductMainImage, Product, Blog, Information } from "@/lib/api";

export default async function Home() {
  // Fetch initial data on server for SEO schemas
  let initialProducts: Product[] = [];
  let initialBlogs: Blog[] = [];
  let initialInfo: Information[] = [];

  try {
    const [products, blogs, information] = await Promise.all([
      api.products.getAll(),
      api.blogs.getAll(),
      api.info.getAll()
    ]);
    initialProducts = Array.isArray(products) ? products.slice(0, 4) : [];
    initialBlogs = Array.isArray(blogs) ? blogs.slice(0, 4) : [];
    initialInfo = Array.isArray(information) ? information.slice(0, 3) : [];
  } catch (e) {
    console.error("Failed to fetch home page data on server:", e);
  }

  return (
    <main className="min-h-screen bg-[#ffffff] selection:bg-[#D4AF37] selection:text-white">
      {/* Featured Items Schemas - Rendered on Server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Featured Products",
              "itemListElement": initialProducts.map((p, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "url": `https://nutricore.com/products/${p.id}`,
                "name": p.name,
                "image": getProductMainImage(p)
              }))
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Wellness Insights",
              "itemListElement": initialBlogs.map((b, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "url": `https://nutricore.com/blog/${b.id}`,
                "name": b.title
              }))
            }
          ])
        }}
      />

      <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
        <Navbar />
      </Suspense>
      <Hero />
      <Products initialProducts={initialProducts} />
      <OurStory />
      <Categories />
      <HomeBlogs initialBlogs={initialBlogs} />
      <Features />
      <InformationOverview initialData={initialInfo} />
      <PreFooter />
      <Footer />
    </main>
  );
}
