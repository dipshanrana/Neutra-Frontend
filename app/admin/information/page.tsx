"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Information } from "@/lib/api";

export default function AdminInformation() {
    const router = useRouter();
    const [infoPages, setInfoPages] = useState<Information[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) { router.push('/admin/login'); return; }
        loadInfo();
    }, [router]);

    const loadInfo = async () => {
        try {
            const data = await api.info.getAll();
            if (Array.isArray(data)) setInfoPages(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this information page?")) return;
        try {
            await api.info.delete(id);
            loadInfo();
        } catch (e) {
            console.error(e);
            alert("Failed to delete information page");
        }
    };

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-white/50 hover:text-white transition-colors text-sm">← Dashboard</Link>
                        <h1 className="text-2xl font-black tracking-tighter font-heading">
                            Manage <span className="text-[#38A36D]">Information</span>
                        </h1>
                    </div>
                    <Link
                        href="/admin/information/new"
                        className="px-6 py-3 bg-emerald-600 text-[#0A190E] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors"
                    >
                        + New Page
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
                ) : infoPages.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-white/40 text-lg mb-4">No information pages yet.</p>
                        <Link href="/admin/information/new" className="text-[#38A36D] hover:underline font-medium">
                            Create your first information page →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {infoPages.map(info => (
                            <div key={info.id} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/30 transition-all">
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-medium mb-2 tracking-tight">{info.title}</h3>
                                        {info.category && (
                                            <span className="inline-block px-3 py-1 bg-emerald-600/10 border border-[#38A36D]/20 rounded-full text-[10px] font-bold text-[#38A36D] uppercase tracking-wider mb-3">
                                                {info.category.name}
                                            </span>
                                        )}
                                        <p className="text-white/60 text-sm line-clamp-2">{info.content}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-4">
                                        <span className="text-white/20 text-sm font-number">#{info.id}</span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/information/edit/${info.id}`}
                                                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-all"
                                                title="Edit Page"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(info.id!)}
                                                className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete Page"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
