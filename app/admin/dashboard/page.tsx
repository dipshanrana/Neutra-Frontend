"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, logout } from "@/lib/api";
import { AdminLanguageSwitcher } from "@/components/AdminLanguageSwitcher";

const SvgBox = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="1.5" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeWidth="1.5" />
        <line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="1.5" />
    </svg>
);

const SvgUsers = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" />
        <circle cx="9" cy="7" r="4" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="1.5" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="1.5" />
    </svg>
);

const SvgTag = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeWidth="1.5" />
        <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" />
    </svg>
);

const SvgLogout = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="1.5" />
        <polyline points="16 17 21 12 16 7" strokeWidth="1.5" />
        <line x1="21" y1="12" x2="9" y2="12" strokeWidth="1.5" />
    </svg>
);

export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [stats, setStats] = useState({ products: 0, categories: 0, users: 0, totalVisits: 0 });
    const [countryStats, setCountryStats] = useState<{ country: string; clicks: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if admin is logged in
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) {
            router.push('/admin/login');
            return;
        }

        const adminData = JSON.parse(adminStr);
        if (adminData.role !== 'ADMIN') {
            router.push('/admin/login');
            return;
        }

        setAdmin(adminData);
        loadStats();
    }, [router]);

    const loadStats = async () => {
        // Fetch each stat independently so a 403 on one doesn't crash the others
        let productCount = 0;
        let categoryCount = 0;
        let userCount = 0;

        try {
            const products = await api.products.getAll();
            productCount = Array.isArray(products) ? products.length : 0;
        } catch (e) { console.warn("Could not load products count", e); }

        try {
            const categories = await api.categories.getAll();
            categoryCount = Array.isArray(categories) ? categories.length : 0;
        } catch (e) { console.warn("Could not load categories count", e); }

        try {
            const users = await api.admin.getAllUsers();
            userCount = Array.isArray(users) ? users.length : 0;
        } catch (e) { console.warn("Could not load users count (may need re-login)", e); }

        let totalVisits = 0;
        try {
            const analytics = await api.analytics.getStats();
            totalVisits = analytics.totalVisits || 0;
            setCountryStats(analytics.byCountry || []);
        } catch (e) { console.warn("Could not load analytics stats", e); }

        setStats({ products: productCount, categories: categoryCount, users: userCount, totalVisits });
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    if (loading || !admin) {
        return (
            <div className="min-h-screen bg-[#0A190E] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-black tracking-tighter text-white font-heading">
                            Nutri<span className="text-[#38A36D]">Core</span> Admin
                        </h1>
                        <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                            {admin.username}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <AdminLanguageSwitcher />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <SvgLogout className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                                <SvgBox className="w-6 h-6 text-[#38A36D]" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-white/40 font-bold">Products</h3>
                        </div>
                        <p className="text-4xl font-medium tracking-tight text-white">{stats.products}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                                <SvgTag className="w-6 h-6 text-[#38A36D]" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-white/40 font-bold">Categories</h3>
                        </div>
                        <p className="text-4xl font-medium tracking-tight text-white">{stats.categories}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                                <SvgUsers className="w-6 h-6 text-[#38A36D]" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-white/40 font-bold">Users</h3>
                        </div>
                        <p className="text-4xl font-medium tracking-tight text-white">{stats.users}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:col-span-3 lg:col-span-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#D19E52]/20 rounded-xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#D19E52]" stroke="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm uppercase tracking-widest text-white/40 font-bold">Total Store Visits</h3>
                                    <p className="text-4xl font-medium tracking-tight mt-1">{stats.totalVisits}</p>
                                </div>
                            </div>

                            <div className="flex-1 max-w-xl">
                                <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-black mb-3">Traffic by Region</h4>
                                <div className="flex flex-wrap gap-2">
                                    {countryStats.length > 0 ? countryStats.map((c, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-white/80">{c.country === "Unknown" ? "Global" : c.country}</span>
                                            <span className="text-[10px] text-[#38A36D] font-mono">{c.clicks}</span>
                                        </div>
                                    )) : (
                                        <span className="text-xs text-white/20 italic">No region data yet</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/admin/products"
                        className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/50 transition-all"
                    >
                        <SvgBox className="w-12 h-12 mb-6 text-[#38A36D] group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-medium mb-2 tracking-tight">Manage Products</h2>
                        <p className="text-white/60 text-sm font-light">Add, edit, or remove products from your catalog</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[#38A36D] text-sm font-medium group-hover:gap-4 transition-all">
                            Go to Products ?
                        </div>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/50 transition-all"
                    >
                        <SvgTag className="w-12 h-12 mb-6 text-[#38A36D] group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-medium mb-2 tracking-tight">Manage Categories</h2>
                        <p className="text-white/60 text-sm font-light">Create and organize your product categories</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[#38A36D] text-sm font-medium group-hover:gap-4 transition-all">
                            Go to Categories ?
                        </div>
                    </Link>

                    <Link
                        href="/admin/blogs"
                        className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/50 transition-all"
                    >
                        <div className="w-12 h-12 mb-6 text-[#38A36D] group-hover:scale-110 transition-transform">
                            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" stroke="currentColor">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeWidth="1.5" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeWidth="1.5" />
                                <line x1="8" y1="6" x2="16" y2="6" strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="8" y1="10" x2="14" y2="10" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium mb-2 tracking-tight">Manage Blogs</h2>
                        <p className="text-white/60 text-sm font-light">Create and manage blog posts with product links</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[#38A36D] text-sm font-medium group-hover:gap-4 transition-all">
                            Go to Blogs ?
                        </div>
                    </Link>

                    <Link
                        href="/admin/information"
                        className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/50 transition-all"
                    >
                        <div className="w-12 h-12 mb-6 text-[#38A36D] group-hover:scale-110 transition-transform">
                            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <line x1="12" y1="16" x2="12" y2="12" strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium mb-2 tracking-tight">Manage Information</h2>
                        <p className="text-white/60 text-sm font-light">Create informational pages linked to categories</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[#38A36D] text-sm font-medium group-hover:gap-4 transition-all">
                            Go to Information ?
                        </div>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/50 transition-all"
                    >
                        <SvgUsers className="w-12 h-12 mb-6 text-[#38A36D] group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-medium mb-2 tracking-tight">View Users</h2>
                        <p className="text-white/60 text-sm font-light">View all registered users and admins</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[#38A36D] text-sm font-medium group-hover:gap-4 transition-all">
                            Go to Users ?
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 hover:border-[#38A36D]/50 transition-all"
                    >
                        <div className="w-12 h-12 mb-6 bg-white/10 rounded-xl flex items-center justify-center text-[#38A36D] group-hover:scale-110 transition-transform">
                            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="1.5" />
                                <polyline points="9 22 9 12 15 12 15 22" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium mb-2 tracking-tight">View Store</h2>
                        <p className="text-white/60 text-sm font-light">Preview the customer-facing website</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[#38A36D] text-sm font-medium group-hover:gap-4 transition-all">
                            Go to Store ?
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}

