"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productApi, Product, getProductMainImage } from "@/lib/api";
import { Heart, Star } from "lucide-react";

const SvgArrowUpRight = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="7" y1="17" x2="17" y2="7" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
)

const SvgCheck = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data: Product[] = await productApi.getAll();
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data.slice(0, 4));
                }
            } catch (e) {
                console.error("Failed to fetch products", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="pt-12 pb-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                    <div className="max-w-xl">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 font-heading mb-6">Complete Your Routine</h2>
                        <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1D3557] font-heading leading-tight">
                            Purpose-built formulas for every physiological need.
                        </h3>
                    </div>
                    <Link href="/products" className="hidden md:inline-flex items-center gap-2 pb-1.5 border-b border-[#1D3557]/30 text-[#1D3557] font-sans font-medium hover:text-emerald-700 hover:border-emerald-600 transition-colors">
                        Shop Entire Collection <SvgArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-[#F5F5F6] rounded-sm mb-4"></div>
                                <div className="h-4 bg-[#F5F5F6] rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-[#F5F5F6] rounded w-full mb-2"></div>
                                <div className="h-8 bg-[#F5F5F6] rounded w-full mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {products.length > 0 ? products.map((p) => {
                            const imageSrc = getProductMainImage(p);
                            const currentSp = p.singleProductSp ?? p.sp;
                            const currentMp = p.singleProductMp ?? p.mp;
                            const savePct = currentMp > currentSp ? Math.round(((currentMp - currentSp) / currentMp) * 100) : 0;
                            const reviews = p.reviews ?? [];
                            const avgRating = reviews.length ? +(reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : null;

                            return (
                                <Link
                                    key={p.id}
                                    href={`/products/${p.id}`}
                                    className="group bg-[#f6f6f8] border border-transparent hover:border-stone-200 hover:shadow-lg rounded-md overflow-hidden flex flex-col transition-all cursor-pointer"
                                >
                                    {/* Card image */}
                                    <div className="relative bg-transparent aspect-square flex items-center justify-center mb-5 overflow-hidden">
                                        {savePct > 0 && (
                                            <div className="absolute top-0 left-0 bg-[#b91c1c] text-white font-sans text-[11px] font-bold px-3 pt-1.5 pb-1 uppercase tracking-wider z-10">
                                                SALE
                                            </div>
                                        )}
                                        <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#522c83] hover:text-[#b91c1c] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10" onClick={(e) => { e.preventDefault(); }}>
                                            <Heart className="w-4 h-4" />
                                        </button>

                                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                            {imageSrc.startsWith("http") || imageSrc.startsWith("data:") ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover mix-blend-multiply drop-shadow-sm"
                                                />
                                            ) : (
                                                <Image
                                                    src={imageSrc}
                                                    fill
                                                    alt={p.name}
                                                    className="object-cover mix-blend-multiply drop-shadow-sm"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="flex flex-col flex-1 px-4 pb-4">
                                        <h3 className="font-sans text-[#166534] text-[16px] leading-snug mb-1 group-hover:underline decoration-[#166534]/30 transition-all font-medium">
                                            {p.name}
                                        </h3>

                                        <span className="font-sans text-[13px] text-stone-600 mb-3 block uppercase tracking-wide">
                                            {typeof p.category === "string" ? p.category : p.category?.name ?? "Supplement"}
                                        </span>

                                        <div className="mt-auto pt-2">
                                            {/* Stars */}
                                            <div className="flex items-center gap-1 mb-3">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating ?? 4.5) ? "fill-[#F5A623] text-[#F5A623]" : "text-stone-300 fill-stone-300"}`} />
                                                    ))}
                                                </div>
                                                <span className="font-sans text-stone-500 text-[12px] ml-1">{avgRating ? avgRating.toFixed(1) : "4.5"} ({reviews.length > 0 ? reviews.length : 43})</span>
                                            </div>

                                            {/* Price Row */}
                                            <div className="mb-4">
                                                <div className="font-sans font-bold text-[#b91c1c] text-[16px] mb-0.5 tracking-tight">
                                                    Rs. {currentSp?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                                <div className="h-4">
                                                    {currentMp > currentSp && (
                                                        <span className="font-sans text-stone-500 text-[12px]">
                                                            Reg. Rs. {currentMp?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="w-full block text-center bg-[#fbbf24] hover:bg-[#f5b102] text-[#451a03] font-sans font-medium text-[15px] py-2.5 transition-colors rounded-sm shadow-sm cursor-pointer">
                                                Add to Cart
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <div className="col-span-3 text-center py-12">
                                <p className="text-[#1D3557]/60 font-sans text-lg">No products available at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
