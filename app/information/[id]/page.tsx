"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import Link from "next/link";
import { api, Information, formatBase64Image } from "@/lib/api";
import { ArrowLeft, Binary, Lock, ShieldCheck, Activity, Fingerprint, ExternalLink, Download } from "lucide-react";

export default function InformationDetailPage() {
    const params = useParams();
    const [info, setInfo] = useState<Information | null>(null);
    const [loading, setLoading] = useState(true);

    const fallbacks = [
        "/lab_microscope_macro_1772623339466.png",
        "/molecular_formula_blur_1772623357430.png",
        "/bio_data_visualization_1772623380441.png"
    ];

    useEffect(() => {
        const fetchInfoDetail = async () => {
            try {
                const id = parseInt(params.id as string);
                if (!isNaN(id)) {
                    const data = await api.info.getById(id);
                    setInfo(data);
                }
            } catch (error) {
                console.error("Failed to load information:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfoDetail();
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex justify-center items-center py-40 bg-[#0A190E]">
                    <div className="w-12 h-12 border-2 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!info) {
        return (
            <main className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center py-40 text-center px-4 bg-[#0A190E]">
                    <Binary className="w-16 h-16 text-brand-accent/30 mb-8 blur-[1px]" />
                    <h1 className="text-4xl md:text-5xl font-heading text-white font-medium mb-6 tracking-tight">Report Unavailable</h1>
                    <p className="text-brand-accent/60 mb-10 max-w-md font-mono text-sm tracking-widest uppercase">ERR_MODULE_NOT_FOUND</p>
                    <Link href="/information" className="px-10 py-4 bg-brand-primary/10 text-brand-accent border border-brand-accent/30 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary hover:text-[#0A190E] transition-all">
                        Initialize Return
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const imgUrl = info.image ? formatBase64Image(info.image) : fallbacks[(info.id || 0) % fallbacks.length];
    const catName = typeof info.category === 'string' ? info.category : info.category?.name || "Uncategorized";

    return (
        <main className="min-h-screen bg-[#FBFBFA] selection:bg-brand-primary selection:text-white flex flex-col font-sans">
            <Navbar />

            {/* Back Navigation Bar - Tech Aesthetic */}
            <div className="bg-[#0A190E] border-b border-[#1A2E20] sticky top-0 z-40">
                <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/information" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent/60 hover:text-emerald-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Vault
                    </Link>
                    <div className="flex items-center gap-6 hidden sm:flex">
                        <span className="text-[9px] font-mono text-brand-accent/40 uppercase tracking-widest">
                            SYS.STATUS: <span className="text-emerald-400">SECURE</span>
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_10px_#10B981] animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Cinematic Tech Hero */}
            <section className="relative pt-16 lg:pt-24 pb-32 bg-[#0A190E] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.05)_0%,_transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full mb-10">
                        <ShieldCheck className="w-4 h-4 text-brand-accent" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Level 1 Clearance</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-medium text-white tracking-tighter leading-[0.9] mb-12 text-balance">
                        {info.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 border-t border-[#1A2E20] pt-10">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mb-2">Module ID</span>
                            <span className="text-brand-accent font-bold tracking-widest">MOD-{info.id?.toString().padStart(3, '0') || 'ARCH'}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mb-2">Category</span>
                            <span className="text-brand-accent font-bold uppercase tracking-widest">{catName}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mb-2">Data Integrity</span>
                            <span className="text-brand-accent font-bold uppercase tracking-widest flex items-center gap-1">
                                <Fingerprint className="w-3.5 h-3.5" /> 100% MATCH
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Split Content Area */}
            <section className="relative -mt-16 z-20 pb-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-4xl mx-auto">

                        {/* Left Column: Image & Text */}
                        <div className="space-y-12">
                            {/* Main Specimen Visual */}
                            <div className="rounded-[3rem] overflow-hidden bg-stone-100 shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-stone-200 aspect-[16/9] relative group">
                                <img
                                    src={imgUrl}
                                    alt="Specimen view"
                                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-[2000ms] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]"></div>
                                {/* Tech overlay hud */}
                                <div className="absolute top-6 left-6 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-brand-accent animate-ping rounded-full"></div>
                                    <span className="text-[9px] font-mono font-black uppercase text-white tracking-widest bg-black/50 px-3 py-1.5 rounded backdrop-blur-sm">Live Feed</span>
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <Binary className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            {/* Main Content Render */}
                            <div className="bg-white rounded-[3rem] p-10 lg:p-16 border border-stone-100 shadow-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-8 border-b border-stone-100 pb-4">
                                    Primary Analysis Report
                                </h3>

                                <div
                                    className="prose prose-lg prose-stone max-w-none
                                        prose-headings:font-heading prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#252422] prose-headings:mb-6
                                        prose-p:font-sans prose-p:leading-[1.8] prose-p:text-stone-600 prose-p:mb-8
                                        prose-a:text-brand-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-[#252422] prose-strong:font-bold
                                        prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3 prose-li:flex prose-li:items-start prose-li:gap-3
                                        prose-li:before:content-[''] prose-li:before:block prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:rounded-full prose-li:before:bg-brand-accent prose-li:before:mt-2.5"
                                    dangerouslySetInnerHTML={{ __html: info.content.replace(/<ul/g, '<ul class="protocol-list"').replace(/<li/g, '<li class="protocol-item"') }} // basic html injection styling
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PreFooter />
            <Footer />
        </main>
    );
}
