"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Information, formatBase64Image } from "@/lib/api";

export function InformationOverview({ initialData }: { initialData?: Information[] }) {
    const [data, setData] = useState<Information[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            const fetchInfo = async () => {
                try {
                    const response = await api.info.getAll();
                    if (Array.isArray(response)) {
                        setData(response.slice(0, 3));
                    }
                } catch (error) {
                    console.error("Failed to fetch information:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInfo();
        }
    }, [initialData]);

    if ((loading || data.length === 0) && !initialData) return null;
    if (data.length === 0) return null;

    return (
        <section className="pt-8 pb-24 bg-[#FAF9F6] font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="max-w-2xl text-left">
                        <Link href="/information">
                            <h2 className="text-[#1B4332] text-[32px] md:text-[42px] font-semibold font-heading leading-[1.05] tracking-tight mb-4 hover:text-[#2FAF82] transition-colors cursor-pointer">
                                Expert Health and <br />
                                <span className="text-[#2FAF82] italic font-light">Wellness Manuals</span>
                            </h2>
                        </Link>
                        <p className="text-black/60 text-lg max-w-lg leading-relaxed">
                            Deep dives into nutritional science and holistic living, curated by our experts.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {data.map((item) => (
                        <div key={item.id} className="group flex flex-col items-start text-left">
                            <Link
                                href={`/information/${item.id}`}
                                className="block w-full aspect-[16/10] overflow-hidden rounded-2xl mb-8 bg-stone-100 relative group-hover:shadow-[0_20px_50px_rgba(27,67,50,0.15)] transition-all duration-500"
                            >
                                <img
                                    src={formatBase64Image(item.image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </Link>

                            <div className="flex-1 flex flex-col items-start w-full">
                                <h3 className="text-black text-[17px] md:text-[19px] font-semibold font-heading leading-tight mb-4 line-clamp-2">
                                    <Link href={`/information/${item.id}`}>
                                        {item.title}
                                    </Link>
                                </h3>

                                <p className="text-black/50 text-base leading-relaxed mb-8 line-clamp-3">
                                    {item.description ? item.description.replace(/<[^>]+>/g, '') : "Discover detailed insights and expert advice on optimizing your health through science-backed nutrition."}
                                </p>

                                <Link
                                    href={`/information/${item.id}`}
                                    className="mt-auto group/btn flex items-center justify-center gap-3 bg-white border border-[#1B4332]/20 hover:bg-[#1B4332] hover:border-[#1B4332] text-[#1B4332] hover:text-white px-8 py-3.5 rounded-full transition-all duration-500 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:-translate-y-1"
                                >
                                    Learn More
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1.5" stroke="currentColor">
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
