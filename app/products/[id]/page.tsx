import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api, productApi, getProductAllImages } from "@/lib/api";
import { ProductDetailClient } from "./ProductDetailClient";
import { Suspense } from "react";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return { title: 'Product Not Found' };
    try {
        const product = await productApi.getById(id);
        if (product && !Array.isArray(product)) {
            return {
                title: `${product.name} | NutriCore`,
                description: product.description,
            };
        }
    } catch {}
    return { title: 'Product Detail' };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const pId = parseInt(resolvedParams.id);

    if (isNaN(pId)) {
        return (
            <div className="min-h-screen flex flex-col bg-[#FAF8F3] selection:bg-emerald-100 selection:text-emerald-900">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center py-48 bg-[#FAF8F3]">
                    <h1 className="font-heading text-5xl font-semibold text-[#2A401E] mb-4">Not Found</h1>
                    <a href="/products" className="mt-2 px-8 py-3.5 bg-brand-primary text-white rounded-full font-heading font-medium hover:bg-brand-secondary transition-colors">
                        Back to Products
                    </a>
                </div>
                <Footer />
            </div>
        );
    }

    let product: any = null;
    let allProducts: any[] = [];
    let blogs: any[] = [];
    let infos: any[] = [];

    try {
        const [data, all, blogsData, infosData] = await Promise.all([
            productApi.getById(pId),
            productApi.getAll(),
            api.blogs.getAll(),
            api.info.getAll()
        ]);
        if (data && !Array.isArray(data)) product = data;
        if (Array.isArray(all)) allProducts = all;
        if (Array.isArray(blogsData)) blogs = blogsData;
        if (Array.isArray(infosData)) infos = infosData;
    } catch (e) {
        console.error(e);
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-[#FAF8F3] selection:bg-emerald-100 selection:text-emerald-900">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center py-48 bg-[#FAF8F3]">
                    <h1 className="font-heading text-5xl font-semibold text-[#2A401E] mb-4">Not Found</h1>
                    <a href="/products" className="mt-2 px-8 py-3.5 bg-brand-primary text-white rounded-full font-heading font-medium hover:bg-brand-secondary transition-colors">
                        Back to Products
                    </a>
                </div>
                <Footer />
            </div>
        );
    }

    const cCat = product.category;
    const cId = typeof cCat === 'object' ? cCat?.id : null;
    const cName = (typeof cCat === 'string' ? cCat : cCat?.name || "").toLowerCase().trim();

    const related = allProducts.filter(p => {
        if (p.id === product.id) return false;
        const tCat = p.category;
        const tId = typeof tCat === 'object' ? tCat?.id : null;
        const tName = (typeof tCat === 'string' ? tCat : tCat?.name || "").toLowerCase().trim();
        const idMatch = cId !== null && tId !== null && cId === tId;
        const nameMatch = cName !== "" && cName === tName;
        return idMatch || nameMatch;
    }).slice(0, 4);

    const images = getProductAllImages(product);
    const reviews = product.reviews ?? [];
    const avgRating = reviews.length ? +(reviews.reduce((a: any, r: any) => a + r.stars, 0) / reviews.length).toFixed(1) : 0;
    const displaySp = product.singleProductSp ?? product.sp;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": images,
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": "NutriCore"
        },
        "sku": product.id?.toString(),
        "offers": {
            "@type": "Offer",
            "url": `https://nutricore.com/products/${product.id}`,
            "priceCurrency": "NPR",
            "price": displaySp,
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": reviews.length > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": avgRating,
            "reviewCount": reviews.length
        } : undefined,
        "review": reviews.map((r: any) => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": r.username
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.stars
            },
            "reviewBody": r.comment
        }))
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F3] selection:bg-emerald-100 selection:text-emerald-900">
            {/* Server-rendered SEO Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schemaData)
                }}
            />
            
            <Suspense fallback={<div className="h-20 bg-[#FAF8F3] animate-pulse" />}>
                <Navbar />
            </Suspense>
            
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#FAF8F3]">
                    <div className="w-10 h-10 border-[3px] border-emerald-100 border-t-brand-primary rounded-full animate-spin" />
                </div>
            }>
                <ProductDetailClient 
                    initialProduct={product}
                    initialRelated={related}
                    initialBlogs={blogs}
                    initialInfos={infos}
                />
            </Suspense>
            
            <Footer />
        </div>
    );
}
