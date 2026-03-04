"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productApi, Product, getProductMainImage } from "@/lib/api";

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
                    setProducts(data.slice(0, 3));
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
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
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-[#F1FAEE] rounded-[2rem] mb-8"></div>
                                <div className="h-6 bg-[#F1FAEE] rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-[#F1FAEE] rounded w-full mb-2"></div>
                                <div className="h-4 bg-[#F1FAEE] rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {products.length > 0 ? products.map((p) => {
                            const image = getProductMainImage(p);
                            const allImages = p.featuredImages || p.images || [];
                            const categoryName = typeof p.category === 'string' ? p.category : p.category?.name || 'Supplement';
                            const benefits = p.benefits && p.benefits.length > 0 ? p.benefits.slice(0, 3) : [];
                            const currentSp = p.singleProductSp ?? p.sp;
                            const currentMp = p.singleProductMp ?? p.mp;
                            const hasDiscount = p.discount > 0;
                            const hasPriceReduction = currentMp > currentSp;

                            return (
                                <Link href={`/products/${p.id}`} key={p.id} className="group cursor-pointer flex flex-col h-full">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] bg-[#F1FAEE]/60 rounded-t-[2rem] rounded-b-none overflow-hidden mb-6 flex items-end justify-center transition-shadow duration-500 border-x border-t border-[#1D3557]/5">
                                        {/* Category Label */}
                                        <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-heading z-10">
                                            {categoryName}
                                        </span>

                                        {/* Discount Badge */}
                                        {hasDiscount && (
                                            <span className="absolute top-6 right-6 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg z-10 backdrop-blur-sm border border-white/10">
                                                {p.discount}% OFF
                                            </span>
                                        )}

                                        {/* Product Image */}
                                        <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
                                            {image.startsWith('http') || image.startsWith('data:') ? (
                                                <img src={image} className="w-full h-full object-cover mix-blend-multiply" alt={p.name} />
                                            ) : (
                                                <Image src={image} fill className="object-cover mix-blend-multiply" alt={p.name} />
                                            )}
                                        </div>

                                        {/* Image Count Badge */}
                                        {allImages.length > 1 && (
                                            <span className="absolute bottom-6 right-6 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-[9px] font-bold tracking-wide z-10">
                                                +{allImages.length - 1} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col">
                                        {/* Name */}
                                        <h4 className="text-xl font-medium text-[#1D3557] font-heading tracking-tight leading-tight group-hover:text-emerald-700 transition-colors mb-2">
                                            {p.name}
                                        </h4>

                                        {/* Price Row */}
                                        <div className="flex items-baseline gap-3 mb-4">
                                            <span className="text-2xl font-medium text-[#1D3557] font-number tracking-tighter">
                                                <span className="text-sm mr-0.5 opacity-60">Rs.</span>
                                                {currentSp?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            {hasPriceReduction && (
                                                <span className="text-xs text-[#1D3557]/30 font-number line-through decoration-1">
                                                    Rs. {currentMp?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Description (truncated) */}
                                        <p className="text-[#1D3557]/55 font-sans text-sm font-light leading-relaxed mb-4 line-clamp-2 flex-1">
                                            {p.description}
                                        </p>

                                        {/* Benefits (up to 3) */}
                                        {benefits.length > 0 && (
                                            <div className="space-y-1.5 mb-5">
                                                {benefits.map((b, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-4 h-4 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                                                            <SvgCheck className="w-2.5 h-2.5 text-emerald-600" />
                                                        </div>
                                                        <span className="text-xs text-[#1D3557]/60 truncate">{b.nutrientName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* CTA Button */}
                                        <span className="w-full py-4 rounded-full bg-emerald-600 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-700 hover:shadow-[0_15px_30px_rgba(5,150,105,0.2)] transition-all duration-500 flex items-center justify-center gap-2 group-hover:-translate-y-1">
                                            Explore Product
                                        </span>
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
