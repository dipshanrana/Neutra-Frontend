"use client";

import React, { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";
import Link from "next/link";

export function Categories({ hideHeader = false }: { hideHeader?: boolean }) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAll();
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data.map((cat: any) => ({
                        name: typeof cat === 'string' ? cat : cat.name,
                        image: typeof cat === 'string' ? null : cat.image,
                        badge: typeof cat === 'string' ? null : cat.badge,
                        shortDescription: typeof cat === 'string' ? null : cat.shortDescription,
                    }));
                    setCategories(mapped);
                }
            } catch (e) {
                console.error("Failed to fetch categories", e);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading && !categories.length) {
        return (
            <div className="py-16 bg-[#F4F5F7] flex justify-center gap-6 overflow-x-auto px-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col w-full max-w-[280px] animate-pulse">
                        <div className="aspect-[4/4] bg-black/10 w-full mb-8"></div>
                        <div className="h-8 w-3/4 bg-black/10 mx-auto rounded mb-4"></div>
                        <div className="h-4 w-1/2 bg-black/10 mx-auto rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Display the first 4 categories to match the grid layout design
    const displayCategories = categories.slice(0, 4);

    return (
        <section className="py-8 md:py-12 bg-[#F4F5F7] font-sans">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-[#3E526D] text-[18px] sm:text-[20px] tracking-[0.05em] uppercase font-normal">
                        Shop By Category
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-16">
                    {displayCategories.map((cat, index) => {
                        const hasBadge = !!cat.badge;

                        let imgSrc = "/multi-vit.png";
                        if (cat.image) {
                            if (cat.image.startsWith('http') || cat.image.startsWith('data:')) {
                                imgSrc = cat.image;
                            } else {
                                imgSrc = `data:image/png;base64,${cat.image}`;
                            }
                        }

                        return (
                            <Link
                                href={`/products?category=${cat.name}`}
                                key={index}
                                className="flex flex-col group transition-all duration-300 h-full"
                            >
                                {/* Top Image Container */}
                                <div className="relative w-full bg-[#151515] mb-8" style={{ aspectRatio: '5/4' }}>
                                    {/* Red Bottom Border */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-[#E21837] z-10"></div>

                                    {/* Category Image - Large, overlaps the bottom, starts behind badge */}
                                    <img
                                        src={imgSrc}
                                        alt={cat.name}
                                        className="absolute left-1/2 -translate-x-1/2 w-[125%] max-w-none h-[140%] object-contain object-bottom group-hover:scale-[1.04] transition-transform duration-500 will-change-transform z-20 pointer-events-none drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                                        style={{ bottom: '-25%' }}
                                    />

                                    {/* Red Badge - Top Right, Overlaps everything (z-30) */}
                                    {hasBadge && (
                                        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-[#E21837] text-white text-[11px] md:text-[13px] font-black uppercase tracking-tighter leading-[1.05] rounded-full flex flex-col items-center justify-center text-center shadow-lg z-30 w-[68px] h-[68px] md:w-[80px] md:h-[80px] px-1 pointer-events-none">
                                            {cat.badge.split(' ').map((word: string, i: number) => (
                                                <span key={i}>{word}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Content */}
                                <div className="flex flex-col flex-1 px-2 mt-6 lg:mt-8 items-center text-center z-30 relative">
                                    <h3 className="text-[24px] lg:text-[28px] xl:text-[32px] font-bold font-heading text-black uppercase tracking-tighter leading-none mb-3 max-w-[95%]">
                                        {cat.name}
                                    </h3>

                                    {cat.shortDescription && (
                                        <p className="text-[12px] font-black text-[#E21837] uppercase tracking-wide mb-5">
                                            {cat.shortDescription}
                                        </p>
                                    )}

                                    <div className={cat.shortDescription ? "mt-1" : "mt-5"}>
                                        <span className="text-[13px] font-black text-black border-b-[2.5px] border-black pb-[2px] uppercase tracking-widest group-hover:text-[#E21837] group-hover:border-[#E21837] transition-colors">
                                            SHOP NOW
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
