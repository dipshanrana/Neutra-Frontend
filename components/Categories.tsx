"use client";

import React, { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";
import Link from "next/link";

const SvgArrowRight = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M4 12H20M20 12L13 5M20 12L13 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const SvgPill = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="6" transform="rotate(-45 12 12)" strokeWidth="1" />
        <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" strokeWidth="1" strokeLinecap="round" />
    </svg>
)

const SvgHexagon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" strokeWidth="1" />
    </svg>
)

const SvgDrop = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M12 21.5C16.6944 21.5 20.5 17.6944 20.5 13C20.5 10.5 17.5 7.5 12 2.5C6.5 7.5 3.5 10.5 3.5 13C3.5 17.6944 7.30558 21.5 12 21.5Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const SvgDNA = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M4 4C4 4 9 5 12 12C15 19 20 20 20 20" strokeWidth="1" strokeLinecap="round" />
        <path d="M20 4C20 4 15 5 12 12C9 19 4 20 4 20" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="8" x2="16" y2="8" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="16" x2="16" y2="16" strokeWidth="1" strokeLinecap="round" />
        <line x1="11" y1="12" x2="13" y2="12" strokeWidth="1" strokeLinecap="round" />
    </svg>
)

const iconList = [SvgPill, SvgHexagon, SvgDrop, SvgDNA];
const defaultDescs = [
    "Foundational micronutrients engineered for maximum bioavailability.",
    "Ultra-filtered isolates optimized for immediate muscle repair.",
    "Cold-pressed, heavy-metal free lipids tailored for cognitive supremacy.",
    "Cellular ATP activators. Zero jitters, just clean kinetic output."
];

export function Categories({ hideHeader = false }: { hideHeader?: boolean }) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAll();
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data.map((cat: any, index: number) => ({
                        id: `0${index + 1}`.slice(-2),
                        name: typeof cat === 'string' ? cat : cat.name,
                        svg: typeof cat === 'string' ? null : cat.svg,
                        desc: defaultDescs[index % defaultDescs.length],
                        icon: iconList[index % iconList.length],
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

    return (
        <section className="py-24 bg-white font-sans relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#82C49C]/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {!hideHeader && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="h-px w-12 bg-emerald-600"></span>
                            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px]">Taxonomy of Performance</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-[#1D3557] font-heading leading-[1.05] mb-8">
                            Biological <span className="text-emerald-600 italic font-light">Classification.</span>
                        </h2>
                        <p className="text-[#1D3557]/50 font-sans text-xl font-light max-w-2xl leading-relaxed">
                            Every formula is systematically categorized by its primary cellular interaction mechanism. Navigate our library by specific physiological pathways.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-px bg-emerald-600/10 border border-[#1D3557]/10 rounded-[3rem] overflow-hidden shadow-2xl">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white p-12 lg:p-20 min-h-[450px] animate-pulse">
                                <div className="h-4 bg-[#F1FAEE] rounded w-1/4 mb-16"></div>
                                <div className="h-20 w-20 bg-[#F1FAEE] rounded-3xl mb-12"></div>
                                <div className="h-10 bg-[#F1FAEE] rounded w-2/3 mb-6"></div>
                                <div className="h-4 bg-[#F1FAEE] rounded w-full"></div>
                            </div>
                        ))
                    ) : categories.length > 0 ? categories.map((cat, index) => {
                        const IconComponent = cat.icon;
                        return (
                            <Link
                                href={`/products?category=${cat.name}`}
                                key={index}
                                className="bg-white p-12 lg:p-20 group cursor-pointer hover:bg-[#fcfdfc] transition-all duration-700 relative flex flex-col h-full min-h-[450px] overflow-hidden"
                            >
                                {/* Hover background effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#F1FAEE] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="flex justify-between items-start mb-16 relative z-10">
                                    <span className="text-xs font-black font-number text-[#1D3557]/20 group-hover:text-emerald-700 transition-colors duration-500 tracking-[0.4em]">
                                        PROTOCOL 0{index + 1}
                                    </span>
                                    <div className="w-14 h-14 rounded-full border border-[#1D3557]/10 flex items-center justify-center text-[#1D3557]/20 group-hover:bg-emerald-600 group-hover:border-[#1D3557] group-hover:text-white transition-all duration-700 transform group-hover:rotate-45 shadow-sm">
                                        <SvgArrowRight className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-auto relative z-10">
                                    <div className="text-[#1D3557]/20 group-hover:text-emerald-700 transition-all duration-700 mb-10 transform group-hover:scale-110 origin-left">
                                        {cat.svg ? (
                                            <span
                                                className="block w-20 h-20 [&>svg]:w-20 [&>svg]:h-20 [&>svg]:block"
                                                dangerouslySetInnerHTML={{ __html: cat.svg }}
                                            />
                                        ) : (
                                            <IconComponent className="w-20 h-20" />
                                        )}
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-medium text-[#1D3557] font-heading tracking-tight mb-6 leading-tight group-hover:translate-x-2 transition-transform duration-700">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[#1D3557]/40 font-light font-sans text-lg leading-relaxed group-hover:text-[#1D3557]/70 transition-colors duration-700 max-w-md">
                                        {cat.desc}
                                    </p>
                                </div>
                            </Link>
                        );
                    }) : (
                        <div className="col-span-2 bg-white text-center py-24">
                            <p className="text-[#1D3557]/40 font-sans text-xl font-light">Laboratory database offline. No entries found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
