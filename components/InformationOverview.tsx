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
        <section className="pt-6 pb-12 bg-[#F9F9F7] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Title - Centered and Refined */}
                <div className="text-center mb-20">
                    <span className="text-emerald-600 font-bold text-[12px] uppercase tracking-[0.35em] mb-4 block">
                        KNOWLEDGE BASE
                    </span>
                    <h2 className="text-[#1b3a32] text-[34px] md:text-[44px] font-bold font-heading tracking-tight leading-[1.1]">
                        Expert Health <span className="font-light italic text-[#1b3a32]/60">&</span> <br className="hidden sm:block" /> Wellness Manuals
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col bg-white overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 rounded-sm"
                        >
                            {/* Image Section - Fully Clickable */}
                            <Link href={`/info/${item.id}`} className="block relative aspect-[3/2] w-full overflow-hidden bg-stone-200">
                                <img
                                    src={formatBase64Image(item.image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                            </Link>

                            {/* Content Section */}
                            <div className="p-10 flex flex-col items-center text-center flex-1">
                                <Link href={`/info/${item.id}`} className="block mb-8 group-hover:text-emerald-700 transition-colors">
                                    <h3 className="text-[#333333] text-[20px] md:text-[23px] font-bold font-heading leading-snug tracking-tight">
                                        {item.title}
                                    </h3>
                                </Link>

                                <Link
                                    href={`/info/${item.id}`}
                                    className="mt-auto inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-14 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 text-[14px] uppercase tracking-widest rounded-sm"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
