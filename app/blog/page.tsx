"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import Image from "next/image";
import Link from "next/link";
import { api, Blog, formatBase64Image } from "@/lib/api";

export default function BlogPage() {
    const [articles, setArticles] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const fallbacks = [
        "https://images.unsplash.com/photo-1579722821273-0f6c77042f02?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532187863486-abf322ce36c9?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542318047-920fca5df6da?q=80&w=2000&auto=format&fit=crop"
    ];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await api.blogs.getAll();
                setArticles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <main className="min-h-screen bg-[#F1FAEE] selection:bg-emerald-600 selection:text-white flex flex-col font-sans">
            <Navbar />

            <section className="pt-32 pb-24 bg-white flex-1 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 font-heading mb-4 inline-block">Clinical Journal</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#1D3557] font-heading leading-[1.1] mb-6">
                            Cutting-Edge <span className="text-emerald-600 italic font-light">Research.</span>
                        </h1>
                        <p className="text-[#1D3557]/60 font-sans text-lg font-light leading-relaxed">
                            Stay updated with our internal lab reports, external clinical trials, and deep-tier biochemical analysis on performance optimization.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {loading ? (
                            <div className="col-span-full text-center text-[#1D3557]/50 font-sans py-20 flex justify-center">
                                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : articles.length > 0 ? (
                            articles.map((article, idx) => {
                                const excerptText = article.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
                                const imgUrl = article.image ? formatBase64Image(article.image) : fallbacks[idx % fallbacks.length];
                                return (
                                    <Link href={`/blog/${article.id}`} key={article.id || idx} className="group cursor-pointer flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
                                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-stone-100">
                                            <div className="absolute inset-0 bg-emerald-600/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply"></div>
                                            <img src={imgUrl} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" alt={article.title} />
                                            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#1D3557]">
                                                {article.author || "Research"}
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 pl-2">
                                            <span className="text-xs font-bold font-number text-emerald-600 tracking-widest uppercase mb-3">LATEST PUBLICATION</span>
                                            <h3 className="text-2xl font-medium text-[#1D3557] font-heading tracking-tight leading-tight mb-4 group-hover:text-emerald-700 transition-colors">{article.title}</h3>
                                            <p className="text-[#1D3557]/60 font-light text-sm leading-relaxed mb-8 flex-1">{excerptText}</p>
                                            <div className="inline-flex items-center gap-2 text-[#1D3557] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                                Read Product →
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center text-[#1D3557]/50 font-sans py-20 bg-white rounded-[3rem] border border-[#1D3557]/5 mt-4">
                                No clinical journals published yet.
                            </div>
                        )}
                    </div>

                    <div className="mt-20 flex justify-center border-t border-[#1D3557]/10 pt-16">
                        <button className="px-8 py-4 border border-[#1D3557]/20 text-[#1D3557] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 hover:text-white transition-all duration-300">
                            Load Archives
                        </button>
                    </div>
                </div>
            </section>

            <PreFooter />
            <Footer />
        </main>
    );
}
