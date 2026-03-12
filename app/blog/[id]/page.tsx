"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import Link from "next/link";
import { api, Blog, formatBase64Image } from "@/lib/api";
import { ArrowLeft, User, Calendar, Share2, BookmarkPlus } from "lucide-react";

export default function BlogDetailPage() {
    const params = useParams();
    const [article, setArticle] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    const fallbacks = [
        "https://images.unsplash.com/photo-1579722821273-0f6c77042f02?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532187863486-abf322ce36c9?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542318047-920fca5df6da?q=80&w=2000&auto=format&fit=crop"
    ];

    const [related, setRelated] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const id = parseInt(params.id as string);
                if (!isNaN(id)) {
                    const data = await api.blogs.getById(id);
                    setArticle(data);
                }
            } catch (error) {
                console.error("Failed to load blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [params.id]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const all = await api.blogs.getAll();
                if (Array.isArray(all) && article) {
                    // Filter out current and take 3
                    const filtered = all
                        .filter(b => b.id !== article.id)
                        .slice(0, 3);
                    setRelated(filtered);
                }
            } catch { }
        };
        if (article) fetchRelated();
    }, [article]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#FFFCF2] flex flex-col font-sans">
                <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
                    <Navbar />
                </Suspense>
                <div className="flex-1 flex justify-center items-center py-40">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!article) {
        return (
            <main className="min-h-screen bg-[#FFFCF2] flex flex-col font-sans">
                <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
                    <Navbar />
                </Suspense>
                <div className="flex-1 flex flex-col items-center justify-center py-40 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-heading text-[#252422] mb-6 tracking-tight">Publication Not Found</h1>
                    <p className="text-[#252422]/60 mb-8 max-w-md">The specific research article you're looking for could not be located in our clinical journal archives.</p>
                    <Link href="/blog" className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-secondary transition-colors">
                        Return to Journals
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const imgUrl = article.image ? formatBase64Image(article.image) : fallbacks[(article.id || 0) % fallbacks.length];

    return (
        <main className="min-h-screen bg-[#FBFBFA] selection:bg-brand-primary selection:text-white flex flex-col font-sans">
            <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
                <Navbar />
            </Suspense>

            {/* Blog SEO Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": article.title,
                        "image": imgUrl,
                        "author": {
                            "@type": "Person",
                            "name": article.author || "Clinical Team"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "NutriCore",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://nutricore.com/logo.png"
                            }
                        },
                        "datePublished": "2026-03-10",
                        "articleBody": article.content.replace(/<[^>]+>/g, '')
                    })
                }}
            />

            {/* Back Navigation */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/blog" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-brand-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Journal
                    </Link>
                    <div className="flex items-center gap-4 hidden sm:flex">
                        <button className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-emerald-200 transition-all">
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-emerald-200 transition-all">
                            <BookmarkPlus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <article className="flex-1 bg-white">
                <div className="max-w-4xl mx-auto px-6 pt-16 lg:pt-24 pb-12 text-center">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary bg-emerald-50 px-4 py-1.5 rounded-full mb-8">
                        Research Paper
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-medium text-[#252422] tracking-tight leading-[1.1] mb-10 text-pretty">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm text-stone-500 font-medium">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-stone-400" />
                            </div>
                            <span className="text-[#252422] font-bold">{article.author || "Clinical Team"}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            <span>Published {(article.id ? (2024 - (article.id % 2)) : 2024)}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200 hidden sm:block"></div>
                        <span className="uppercase tracking-widest text-[10px] font-black">5 MIN READ</span>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 lg:mb-24">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-stone-200/50">
                        <img
                            src={imgUrl}
                            alt={article.title}
                            className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem]"></div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="max-w-3xl mx-auto px-6 pb-32">
                    <div
                        className="prose prose-lg md:prose-xl prose-stone max-w-none
                            prose-headings:font-heading prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#252422]
                            prose-p:font-sans prose-p:leading-relaxed prose-p:text-stone-600 prose-p:mb-8
                            prose-a:text-brand-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-[#252422] prose-strong:font-bold
                            prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-brand-accent
                            prose-img:rounded-3xl prose-img:border prose-img:border-stone-100 prose-img:shadow-sm"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Tags & Actions */}
                    <div className="mt-20 pt-10 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 shrink-0">TAGS:</span>
                            {['Clinical', 'Optimization', 'Science'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-[11px] font-bold text-[#252422] uppercase tracking-widest shrink-0">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">SHARE:</span>
                            <div className="flex gap-2">
                                {/* Simulated social icons */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 hover:text-brand-primary transition-colors cursor-pointer">
                                        <Share2 className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Read Next Section */}
            {related.length > 0 && (
                <section className="bg-stone-50 border-t border-stone-200 py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-heading font-medium text-[#252422] tracking-tight">Continue Reading</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {related.map(rel => {
                                const relImg = rel.image ? formatBase64Image(rel.image) : fallbacks[(rel.id || 0) % fallbacks.length];
                                return (
                                    <Link href={`/blog/${rel.id}`} key={rel.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-500">
                                        <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                                            <img src={relImg} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={rel.title} />
                                        </div>
                                        <div className="p-6">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary mb-3 block">RELATED REVIEW</span>
                                            <h3 className="text-xl font-heading font-medium text-[#252422] leading-tight group-hover:text-brand-secondary transition-colors line-clamp-2">
                                                {rel.title}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <PreFooter />
            <Footer />
        </main>
    );
}
