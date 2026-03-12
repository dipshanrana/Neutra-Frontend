"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { api, Product, Category, getProductMainImage } from "@/lib/api";
import { Search, SlidersHorizontal, Heart, Star } from "lucide-react";
import { useCurrency } from "@/components/CurrencyContext";

export function ShopClient({ 
    initialProducts, 
    initialCategories 
}: { 
    initialProducts: Product[], 
    initialCategories: Category[] 
}) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [categories] = useState<Category[]>(initialCategories);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParam || "");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const { formatPrice } = useCurrency();

    useEffect(() => {
        if (categoryParam || searchParam) {
            handleSearchData(searchParam, categoryParam);
        } else {
            setProducts(initialProducts);
        }
    }, [categoryParam, searchParam, initialProducts]);

    const handleSearchData = async (search?: string | null, category?: string | null) => {
        setLoading(true);
        try {
            let results: Product[] = [];
            if (search) {
                results = await api.products.searchByName(search);
                setSearchQuery(search);
                setSelectedCategory("");
            } else if (category) {
                results = await api.products.searchByCategory(category);
                setSelectedCategory(category);
                setSearchQuery("");
            }
            setProducts(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let results: Product[] = [];
            if (searchQuery) {
                results = await api.products.searchByName(searchQuery);
            } else if (selectedCategory) {
                results = await api.products.searchByCategory(selectedCategory);
            } else if (minPrice || maxPrice) {
                const min = minPrice ? parseFloat(minPrice) : 0;
                const max = maxPrice ? parseFloat(maxPrice) : 999999;
                results = await api.products.searchByPriceRange(min, max);
            } else {
                results = await api.products.getAll();
            }
            setProducts(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* -- Filter Bar --- */}
            <div className="bg-white border-b border-stone-200 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
                    <form onSubmit={handleFilterSubmit} className="flex flex-col lg:flex-row gap-3 items-center">

                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); }}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-stone-200 rounded-xl text-[#2A401E] text-sm placeholder:text-stone-400 font-sans font-medium focus:outline-none focus:border-brand-accent transition-colors"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Category */}
                            <select
                                value={selectedCategory}
                                onChange={e => { setSelectedCategory(e.target.value); setSearchQuery(""); setMinPrice(""); setMaxPrice(""); }}
                                className="px-4 py-2.5 bg-[#FAF8F3] border border-stone-200 rounded-xl text-[#2A401E] text-sm font-sans font-medium focus:outline-none focus:border-brand-accent transition-colors w-full sm:w-48"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>

                            {/* Price range */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <input
                                    type="number" placeholder="Min"
                                    value={minPrice}
                                    onChange={e => { setMinPrice(e.target.value); setSearchQuery(""); setSelectedCategory(""); }}
                                    className="flex-1 sm:w-24 px-3 py-2.5 bg-[#FAF8F3] border border-stone-200 rounded-xl text-[#2A401E] text-sm font-sans font-medium focus:outline-none focus:border-brand-accent transition-colors"
                                />
                                <input
                                    type="number" placeholder="Max"
                                    value={maxPrice}
                                    onChange={e => { setMaxPrice(e.target.value); setSearchQuery(""); setSelectedCategory(""); }}
                                    className="flex-1 sm:w-24 px-3 py-2.5 bg-[#FAF8F3] border border-stone-200 rounded-xl text-[#2A401E] text-sm font-sans font-medium focus:outline-none focus:border-brand-accent transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-2.5 bg-[#D48D0B] hover:bg-[#B87A00] text-white rounded-full font-heading font-bold text-[13px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                            >
                                <SlidersHorizontal className="w-4 h-4 text-white" />
                                Filter
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* -- Product Grid --- */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-[3px] border-emerald-200 border-t-brand-primary rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-stone-200">
                        <h3 className="font-heading font-semibold text-[#2A401E] text-2xl mb-2">No Products Found</h3>
                        <p className="font-sans text-stone-500">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {products.map((p) => {
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
                                    <div className="relative bg-transparent aspect-square flex items-center justify-center mb-5 overflow-hidden">
                                        {p.categoryBadge && (
                                            <div className="absolute top-0 left-0 bg-[#b91c1c] text-white font-sans text-[9px] font-bold px-3 pt-1.5 pb-1 uppercase tracking-wider z-10 shadow-sm">
                                                {p.categoryBadge}
                                            </div>
                                        )}
                                        <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#522c83] hover:text-[#b91c1c] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10" onClick={(e) => { e.preventDefault(); }}>
                                            <Heart className="w-4 h-4" />
                                        </button>

                                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                            {imageSrc.startsWith("http") || imageSrc.startsWith("data:") ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={p.name || "Product Image"}
                                                    width={400}
                                                    height={400}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover mix-blend-multiply drop-shadow-sm"
                                                />
                                            ) : (
                                                <Image
                                                    src={imageSrc}
                                                    width={400}
                                                    height={400}
                                                    alt={p.name || "Product Image"}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover mix-blend-multiply drop-shadow-sm"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1 px-4 pb-4">
                                        <h3 className="font-sans text-[#166534] text-[16px] leading-snug mb-1 group-hover:underline decoration-[#166534]/30 transition-all font-medium">
                                            {p.name}
                                        </h3>

                                        <span className="font-sans text-[13px] text-stone-600 mb-3 block uppercase tracking-wide">
                                            {typeof p.category === "string" ? p.category : p.category?.name ?? "Supplement"}
                                        </span>

                                        <div className="mt-auto pt-2">
                                            <div className="flex items-center gap-1 mb-3">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating ?? 4.5) ? "fill-[#F5A623] text-[#F5A623]" : "text-stone-300 fill-stone-300"}`} />
                                                    ))}
                                                </div>
                                                <span className="font-sans text-stone-500 text-[12px] ml-1">{avgRating ? avgRating.toFixed(1) : "4.5"} ({reviews.length > 0 ? reviews.length : 43})</span>
                                            </div>

                                            <div className="mb-4">
                                                {currentMp > currentSp && (
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="font-sans text-stone-500 text-[12px] uppercase tracking-wider">MRP :</span>
                                                        <span className="font-sans text-stone-400 text-[12px] line-through decoration-stone-300">
                                                            {formatPrice(currentMp)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="font-sans font-bold text-[#1D3557] text-[15px]">Price:</span>
                                                    <span className="font-sans font-bold text-[#1D3557] text-[20px]">
                                                        {formatPrice(currentSp)}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-[#D4AF37] font-medium mt-0.5">
                                                    Inclusive of all taxes
                                                </div>
                                            </div>

                                            <span className="w-full block text-center bg-[#fbbf24] hover:bg-[#f5b102] text-[#451a03] font-sans font-medium text-[15px] py-2.5 transition-colors rounded-sm shadow-sm cursor-pointer">
                                                Add to Cart
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}
