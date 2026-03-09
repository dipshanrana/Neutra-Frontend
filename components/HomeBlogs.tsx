"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Blog, formatBase64Image } from "@/lib/api";

export function HomeBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const fallbacks = [
        "https://images.unsplash.com/photo-1542318047-920fca5df6da?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532187863486-abf322ce36c9?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579722821273-0f6c77042f02?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512067651074-9f2d01da918a?q=80&w=2000&auto=format&fit=crop"
    ];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await api.blogs.getAll();
                if (Array.isArray(data) && data.length > 0) {
                    setBlogs(data.slice(0, 4)); // Showing exactly 4 blogs in one row
                }
            } catch (error) {
                console.error("Failed to load blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading || blogs.length === 0) {
        return null;
    }

    return (
        <section className="pt-12 pb-12 bg-white font-sans overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

                {/* Section Heading - Meaningful, Soft, and Refined */}
                <div className="text-center mb-12">
                    <h2 className="text-[#1b3a32] text-[26px] sm:text-[30px] md:text-[34px] font-bold font-heading tracking-tight capitalize">
                        Wellness Insights
                    </h2>
                </div>

                {/* 4 Blogs in One Row Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {blogs.map((blog, idx) => {
                        const excerptText = blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
                        const imgUrl = blog.image ? formatBase64Image(blog.image) : fallbacks[idx % fallbacks.length];

                        return (
                            <div key={blog.id || idx} className="flex flex-col group">
                                {/* Image Container - Scaled for 4 columns */}
                                <Link href={`/blog/${blog.id}`} className="block overflow-hidden mb-6 rounded-sm">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                        <img
                                            src={imgUrl}
                                            alt={blog.title}
                                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </Link>

                                <div className="flex flex-col flex-1 text-left">
                                    <Link href={`/blog/${blog.id}`}>
                                        <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#10243E] leading-[1.3] mb-4 group-hover:text-brand-secondary transition-colors font-outfit uppercase tracking-tight line-clamp-2">
                                            {blog.title}
                                        </h3>
                                    </Link>

                                    <p className="text-[#555555] text-[14px] font-normal leading-[1.6] mb-6 flex-1 opacity-90 font-inter line-clamp-3">
                                        {excerptText}
                                    </p>

                                    <Link
                                        href={`/blog/${blog.id}`}
                                        className="inline-block text-[#0066CC] font-bold text-[14px] hover:text-[#D4AF37] transition-colors w-fit"
                                    >
                                        Check It Out
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

