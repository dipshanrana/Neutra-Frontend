"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Blog, ApiError } from "@/lib/api";

export default function AdminBlogs() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) { router.push('/admin/login'); return; }
        loadBlogs();
    }, [router]);

    const loadBlogs = async () => {
        try {
            const data = await api.blogs.getAll();
            if (Array.isArray(data)) setBlogs(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-white/50 hover:text-white transition-colors text-sm">← Dashboard</Link>
                        <h1 className="text-2xl font-black tracking-tighter font-heading">
                            Manage <span className="text-[#38A36D]">Blogs</span>
                        </h1>
                    </div>
                    <Link
                        href="/admin/blogs/new"
                        className="px-6 py-3 bg-emerald-600 text-[#0A190E] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors"
                    >
                        + New Blog
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-32"></div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-white/40 text-lg mb-4">No blog posts yet.</p>
                        <Link href="/admin/blogs/new" className="text-[#38A36D] hover:underline font-medium">
                            Create your first blog post →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {blogs.map(blog => (
                            <div key={blog.id} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/30 transition-all">
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-medium mb-2 tracking-tight">{blog.title}</h3>
                                        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">By {blog.author}</p>
                                        <p className="text-white/60 text-sm line-clamp-2">{blog.content}</p>
                                        {blog.relatedProducts && blog.relatedProducts.length > 0 && (
                                            <div className="mt-4 flex gap-2 flex-wrap">
                                                {blog.relatedProducts.map(p => (
                                                    <span key={p.id} className="px-3 py-1 bg-emerald-600/10 border border-[#38A36D]/20 rounded-full text-[10px] font-bold text-[#38A36D] uppercase tracking-wider">
                                                        {p.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-white/20 text-sm font-number">#{blog.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
