"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import { api, Information, formatBase64Image } from "@/lib/api";
import { ArrowRight, ShieldCheck, Binary, Activity, Database, Fingerprint, Lock, Zap, MousePointer2 } from "lucide-react";
import Link from "next/link";

export default function InformationPage() {
    const [infoData, setInfoData] = useState<Information[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("All Content");

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await api.info.getAll();
                setInfoData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load information:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set<string>(["All Content"]);
        infoData.forEach(item => {
            if (item.category && typeof item.category !== 'string') {
                cats.add(item.category.name);
            } else if (typeof item.category === 'string') {
                cats.add(item.category);
            }
        });
        return Array.from(cats);
    }, [infoData]);

    const filteredInfo = useMemo(() => {
        if (activeCategory === "All Content") return infoData;
        return infoData.filter(item => {
            const catName = typeof item.category === 'string' ? item.category : item.category?.name;
            return catName === activeCategory;
        });
    }, [infoData, activeCategory]);

    const cardImages = [
        "/lab_microscope_macro_1772623339466.png",
        "/molecular_formula_blur_1772623357430.png",
        "/bio_data_visualization_1772623380441.png"
    ];

    return (
        <main className="min-h-screen bg-[#FBFBFA] selection:bg-emerald-600 selection:text-white flex flex-col font-inter">
            <Navbar />

            {/* Cinematic Sticky-Parallax Hero - Enhanced Layering */}
            <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#0A190E]">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/knowledge_base_hero_1772623137836.png"
                        alt="Hero background"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A190E]/60 to-[#0A190E]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A190E_70%)] opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-20">
                    <div className="max-w-5xl">
                        <div className="flex items-center gap-6 mb-12 overflow-hidden group">
                            <span className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px] whitespace-nowrap bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                DATA ARCHIVE V2.1
                            </span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent"></div>
                        </div>

                        <h1 className="text-7xl md:text-9xl lg:text-[160px] font-heading font-medium text-white leading-[0.75] tracking-tighter mb-16 select-none">
                            Deep <br />
                            <span className="text-emerald-500 italic font-light lowercase">Physiology.</span>
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                            <p className="text-white/50 text-xl font-light leading-relaxed max-w-xl border-l-[1px] border-emerald-500/20 pl-10">
                                Our central repository for validated pharmacological products, clinical synthesis methodologies, and raw biochemical optimization modules.
                            </p>
                            <div className="hidden md:flex justify-end gap-16">
                                <div className="text-right">
                                    <p className="text-emerald-500 font-black tracking-widest text-[9px] uppercase mb-2">Total Modules</p>
                                    <p className="text-white text-3xl font-heading font-medium tracking-tighter">{infoData.length.toString().padStart(2, '0')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-500 font-black tracking-widest text-[9px] uppercase mb-2">Access Status</p>
                                    <p className="text-white text-3xl font-heading font-medium tracking-tighter flex items-center gap-2">VERIFIED <ShieldCheck className="w-6 h-6 text-emerald-500" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-10 left-10 pointer-events-none opacity-20">
                    <Database className="w-40 h-40 text-emerald-500" />
                </div>
            </section>

            {/* Filter Navigation - Glassmorphism Redesign */}
            <section className="sticky top-[80px] z-[50] py-6 translate-y-[-50%] px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-2xl border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-3 rounded-[2.5rem] inline-flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-8 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeCategory === cat
                                    ? 'bg-[#1D3557] text-white shadow-xl shadow-[#1D3557]/20 scale-[1.02]'
                                    : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Grid - dossier Redesign */}
            <section className="pb-40 pt-10 flex-1">
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse bg-stone-100 h-[600px] rounded-[4rem]"></div>
                            ))}
                        </div>
                    ) : filteredInfo.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-32">
                            {filteredInfo.map((info, idx) => (
                                <Link href={`/information/${info.id}`} key={info.id || idx} className="group flex flex-col gap-8 hover:cursor-pointer transition-transform">
                                    {/* Visual speciman Holder */}
                                    <div className="aspect-[16/10] w-full bg-stone-100 rounded-[3rem] overflow-hidden relative border border-stone-200 shadow-sm group-hover:shadow-[0_60px_100px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-1000">
                                        <img
                                            src={info.image ? formatBase64Image(info.image) : cardImages[idx % cardImages.length]}
                                            alt="Specimen view"
                                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A190E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                        {/* Dynamic UI Overlay */}
                                        <div className="absolute top-8 left-8 flex flex-col gap-2">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black tracking-widest text-[#0A190E] border border-stone-100">
                                                MOD-{info.id?.toString().padStart(3, '0') || 'ARCH'}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-8 right-8 text-white/40 group-hover:text-emerald-400 transition-colors">
                                            <Binary className="w-8 h-8" />
                                        </div>
                                    </div>

                                    {/* Info Panel */}
                                    <div className="px-4">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
                                                    {typeof info.category === 'string' ? info.category : info.category?.name || "Uncategorized"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100">
                                                <Activity className="w-3 h-3 text-stone-300" />
                                                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Active Report</span>
                                            </div>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-heading font-medium text-[#1D3557] tracking-tight leading-[1.05] mb-8 break-words group-hover:text-emerald-700 transition-colors">
                                            {info.title}
                                        </h3>

                                        <p className="text-stone-500 text-lg leading-relaxed font-light mb-12 line-clamp-3">
                                            {info.content}
                                        </p>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t border-stone-100">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-stone-300 uppercase tracking-widest mb-1.5 font-bold italic">Integrity Verification</span>
                                                    <div className="flex items-center gap-2">
                                                        <Fingerprint className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-[10px] font-black text-[#1D3557] uppercase tracking-tighter">DATA-MATCH: 100%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="relative overflow-hidden px-10 py-5 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] group/btn hover:bg-emerald-600 transition-all duration-500 pointer-events-none">
                                                <span className="relative z-10 flex items-center gap-3 group-hover/btn:translate-x-2 transition-transform duration-500">
                                                    Launch Product <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-60 border-2 border-dashed border-stone-100 rounded-[5rem]">
                            <Binary className="w-16 h-16 text-stone-100 mx-auto mb-8" />
                            <p className="text-stone-300 font-light text-2xl italic tracking-tighter">No database modules found for filtering criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Ultra-Premium Portal CTA */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto p-12 lg:p-32 bg-[#0A190E] rounded-[5rem] overflow-hidden relative group">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/molecular_formula_blur_1772623357430.png"
                            alt="Background accent"
                            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-[3000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0A190E] via-[#0A190E]/60 to-transparent"></div>
                    </div>

                    <div className="max-w-3xl relative z-10">
                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                                <Lock className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="text-white text-xs font-black uppercase tracking-[0.4em]">Level 04 Security</h4>
                                <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">RSA-4096 Encrypted</p>
                            </div>
                        </div>

                        <h2 className="text-6xl lg:text-8xl font-heading font-medium text-white tracking-tighter mb-12 leading-[0.85]">
                            Full Vault <br />
                            <span className="text-emerald-500 italic font-light lowercase">access.</span>
                        </h2>

                        <p className="text-white/40 text-xl font-light leading-relaxed mb-16 max-w-xl">
                            Verified research institutes and clinical partners may request administrative clearance to access full biochemical assay archives.
                        </p>

                        <div className="flex flex-wrap gap-8 items-center">
                            <button className="group/cta relative px-16 py-8 bg-emerald-600 text-[#0A190E] rounded-full font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden transition-all duration-500 hover:scale-105 shadow-2xl shadow-emerald-500/20">
                                <span className="relative z-10 flex items-center gap-4">
                                    Authenticate Access <Zap className="w-4 h-4 fill-current" />
                                </span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover/cta:translate-y-0 transition-transform duration-500"></div>
                            </button>
                            <Link href="/contact" className="text-white/40 hover:text-emerald-400 transition-colors py-4 px-8 text-[11px] font-black uppercase tracking-[0.3em] border-b border-white/10 hover:border-emerald-500/50">
                                Product Inquiry
                            </Link>
                        </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 p-20 hidden lg:block">
                        <Binary className="w-64 h-64 text-white/5 opacity-40 group-hover:rotate-12 transition-transform duration-[5s]" />
                    </div>
                </div>
            </section>

            <PreFooter />
            <Footer />
        </main>
    );
}
