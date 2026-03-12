"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Blog, formatBase64Image } from "@/lib/api";

export function HomeBlogs({ initialBlogs }: { initialBlogs?: Blog[] }) {
    const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || []);
    const [loading, setLoading] = useState(!initialBlogs);

    const fallbacks = [
        "https://images.unsplash.com/photo-1542318047-920fca5df6da?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532187863486-abf322ce36c9?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579722821273-0f6c77042f02?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512067651074-9f2d01da918a?q=80&w=2000&auto=format&fit=crop"
    ];

    useEffect(() => {
        if (!initialBlogs) {
            const fetchBlogs = async () => {
                try {
                    const data = await api.blogs.getAll();
                    if (Array.isArray(data) && data.length > 0) {
                        setBlogs(data.slice(0, 4));
                    }
                } catch (error) {
                    console.error("Failed to load blogs:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBlogs();
        }
    }, [initialBlogs]);

    if ((loading || blogs.length === 0) && !initialBlogs) {
        return null;
    }

    if (blogs.length === 0) return null;

    return (
        <section className="pt-4 pb-8 bg-[#F7FAF8] font-sans overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-12">
                    <Link href="/blog">
                        <h2 className="text-[#1b3a32] text-[22px] sm:text-[26px] md:text-[30px] font-semibold font-heading tracking-tight capitalize hover:text-[#2FAF82] transition-colors inline-block cursor-pointer">
                            Wellness Insights
                        </h2>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {blogs.map((blog, idx) => {
                        const excerptText = blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
                        const imgUrl = blog.image ? formatBase64Image(blog.image) : fallbacks[idx % fallbacks.length];

                        return (
                            <div key={blog.id || idx} className="flex flex-col group">
                                <Link href={`/blog/${blog.id}`} className="block overflow-hidden mb-6 rounded-sm">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                        <img
                                            src={imgUrl}
                                            alt={blog.title || "Blog Image"}
                                            width={400}
                                            height={300}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </Link>

                                <div className="flex flex-col flex-1 text-left">
                                    <Link href={`/blog/${blog.id}`}>
                                        <h3 className="text-black text-[15px] sm:text-[16px] font-semibold leading-[1.3] mb-4 font-outfit uppercase tracking-tight line-clamp-2">
                                            {blog.title}
                                        </h3>
                                    </Link>

                                    <p className="text-[#555555] text-[14px] font-normal leading-[1.6] mb-6 flex-1 opacity-90 font-inter line-clamp-3">
                                        {excerptText}
                                    </p>

                                    <Link
                                        href={`/blog/${blog.id}`}
                                        className="mt-auto group/btn flex items-center justify-center gap-2.5 bg-white border border-[#1b3a32]/10 hover:bg-[#1b3a32] hover:border-[#1b3a32] text-[#1b3a32] hover:text-white px-7 py-3 rounded-full transition-all duration-500 text-[11px] font-bold uppercase tracking-[0.15em] shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 w-fit"
                                    >
                                        Learn More
                                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:translate-x-1.5" stroke="currentColor">
                                            <path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
