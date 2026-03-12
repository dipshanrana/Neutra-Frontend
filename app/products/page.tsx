import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api, getProductMainImage, Product, Category } from "@/lib/api";
import { ShopClient } from "./ShopClient";

export const dynamic = 'force-dynamic';

export default async function ShopAll() {
    let products: Product[] = [];
    let categories: Category[] = [];

    try {
        const [p, c] = await Promise.all([
            api.products.getAll(),
            api.categories.getAll(),
        ]);
        if (Array.isArray(p)) products = p;
        if (Array.isArray(c)) categories = c;
    } catch (e) {
        console.error("Failed to load shop data on server:", e);
    }

    // Prepare SEO Schema
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Full Product Catalog | NutriCore",
        "itemListElement": products.map((p, i) => {
            const img = getProductMainImage(p);
            const absImg = img.startsWith('http') ? img : `https://nutricore.com${img}`;
            return {
                "@type": "ListItem",
                "position": i + 1,
                "item": {
                    "@type": "Product",
                    "url": `https://nutricore.com/products/${p.id}`,
                    "name": p.name,
                    "image": absImg,
                    "description": p.description,
                    "brand": {
                        "@type": "Brand",
                        "name": "NutriCore"
                    },
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "NPR",
                        "price": p.singleProductSp || p.sp || 99.99,
                        "availability": "https://schema.org/InStock",
                        "url": `https://nutricore.com/products/${p.id}`
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": p.reviews?.length ? (p.reviews.reduce((a, r) => a + r.stars, 0) / p.reviews.length).toFixed(1) : 4.8,
                        "reviewCount": p.reviews?.length || 15
                    }
                }
            };
        })
    };

    return (
        <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schemaData)
                }}
            />
            
            <Navbar />

            {/* -- Page Header --- */}
            <div className="bg-white border-b border-stone-200 pt-10 pb-10 text-center px-4 mt-[80px]">
                <div className="max-w-2xl mx-auto">
                    <span className="font-heading font-semibold text-[10px] text-brand-secondary uppercase tracking-[0.3em] block mb-3">Premium Collection</span>
                    <h1 className="font-heading font-semibold text-[#2A401E] text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3">
                        Our Best Products
                    </h1>
                    <p className="font-sans text-stone-500 text-sm sm:text-base font-medium max-w-xl mx-auto">
                        Explore the most advanced formulas crafted for peak performance and everyday wellness.
                    </p>
                </div>
            </div>

            <Suspense fallback={
                <div className="flex-1 flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-[3px] border-emerald-200 border-t-brand-primary rounded-full animate-spin" />
                </div>
            }>
                <ShopClient initialProducts={products} initialCategories={categories} />
            </Suspense>

            <Footer />
        </div>
    );
}
