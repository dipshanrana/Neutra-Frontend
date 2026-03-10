"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Information, formatBase64Image } from "@/lib/api";

export function InformationOverview() {
    const [data, setData] = useState<Information[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await api.info.getAll();
                if (Array.isArray(response)) {
                    // Take the latest 3 for the home overview
                    setData(response.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch information:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    if (loading || data.length === 0) return null;

    return (
        <section className="py-24 bg-white font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl text-left">
                        <h2 className="text-[#1B4332] text-[40px] md:text-[52px] font-bold font-heading leading-[1.05] tracking-tight mb-4">
                            Expert Health and <br />
                            <span className="text-[#38A36D] italic font-light">Wellness Manuals</span>
                        </h2>
                        <p className="text-black/60 text-lg max-w-lg leading-relaxed">
                            Deep dives into nutritional science and holistic living, curated by our experts.
                        </p>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {data.map((item) => (
                        <div key={item.id} className="group flex flex-col items-start text-left">
                            {/* Image Wrapper */}
                            <Link
                                href={`/info/${item.id}`}
                                className="block w-full aspect-[16/10] overflow-hidden rounded-2xl mb-8 bg-stone-100 relative group-hover:shadow-[0_20px_50px_rgba(27,67,50,0.15)] transition-all duration-500"
                            >
                                <img
                                    src={formatBase64Image(item.image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </Link>

                            {/* Text Content */}
                            <div className="flex-1 flex flex-col items-start w-full">
                                <h3 className="text-[#1B4332] text-[24px] md:text-[28px] font-bold font-heading leading-tight mb-4 group-hover:text-[#38A36D] transition-colors line-clamp-2">
                                    <Link href={`/info/${item.id}`}>
                                        {item.title}
                                    </Link>
                                </h3>

                                <p className="text-black/50 text-base leading-relaxed mb-8 line-clamp-3">
                                    {/* Stripping tags if any and showing description */}
                                    {item.description ? item.description.replace(/<[^>]+>/g, '') : "Discover detailed insights and expert advice on optimizing your health through science-backed nutrition."}
                                </p>

                                <Link
                                    href={`/info/${item.id}`}
                                    className="mt-auto group/btn flex items-center gap-2 bg-[#1B4332] hover:bg-[#38A36D] text-white px-8 py-3.5 rounded-full transition-all duration-300 text-[13px] font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(27,67,50,0.2)] hover:shadow-[0_8px_25px_rgba(56,163,109,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Read More
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" stroke="currentColor">
                                        <path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

