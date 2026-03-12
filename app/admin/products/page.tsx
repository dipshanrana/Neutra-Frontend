"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Product, ApiError, getProductMainImage } from "@/lib/api";

const SvgPlus = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" />
        <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" />
    </svg>
);

const SvgEdit = ({ className }:     { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1.5" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="1.5" />
    </svg>
);

const SvgTrash = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <polyline points="3 6 5 6 21 6" strokeWidth="1.5" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="1.5" />
        <line x1="10" y1="11" x2="10" y2="17" strokeWidth="1.5" />
        <line x1="14" y1="11" x2="14" y2="17" strokeWidth="1.5" />
    </svg>
);

const SvgBack = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function AdminProducts() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) {
            router.push('/admin/login');
            return;
        }
        loadProducts();
    }, [router]);

    const loadProducts = async () => {
        try {
            const data = await api.products.getAll();
            setProducts(data);
        } catch (err) {
            setError("Failed to load products");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await api.products.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            if (err instanceof ApiError) {
                alert(`Failed to delete: ${err.message}`);
            } else {
                alert("Failed to delete product");
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header with Back Arrow */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                            <SvgBack className="w-5 h-5 text-white/70" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-medium">Manage Products</h1>
                            <p className="text-sm text-white/40">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#38A36D] text-white rounded-lg hover:bg-[#38A36D]/80 transition-colors font-medium text-sm"
                    >
                        <SvgPlus className="w-4 h-4" />
                        Add New
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-white/60">Loading products.. .</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/60 mb-4">No products found</p>
                        <Link
                            href="/admin/products/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/80 transition-colors font-medium"
                        >
                            <SvgPlus className="w-5 h-5" />
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={getProductMainImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className="text-xl font-medium mb-1">{product.name}</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <p className="text-sm text-[#38A36D]">
                                                        {typeof product.category === 'string' ? product.category : product.category.name}
                                                    </p>
                                                    {product.badge && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#38A36D]/20 text-[#38A36D] border border-[#38A36D]/30">
                                                            {product.badge}
                                                        </span>
                                                    )}
                                                    {product.categoryBadge && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/80 border border-white/20">
                                                            {product.categoryBadge}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-medium font-number">
                                                    <span className="text-xs mr-0.5 opacity-50">Rs.</span>
                                                    {(product.singleProductSp ?? product.sp).toLocaleString()}
                                                </p>
                                                {(product.singleProductMp ?? product.mp) > (product.singleProductSp ?? product.sp) && (
                                                    <p className="text-sm text-white/40 font-number line-through decoration-white/20">Rs. {(product.singleProductMp ?? product.mp).toLocaleString()}</p>
                                                )}
                                                {/* Capsule Information */}
                                                {(product.servingSize || product.capsulesPerContainer) && (
                                                    <div className="mt-4 pt-3 border-t border-[#38A36D]/20">
                                                        <div className="space-y-2">
                                                            {product.servingSize && (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Serving</span>
                                                                    <span className="text-xs text-white/80 font-semibold font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                                        {product.servingSize}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {product.capsulesPerContainer && (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Container</span>
                                                                    <span className="text-xs text-[#38A36D] font-semibold font-mono bg-[#38A36D]/10 px-2 py-0.5 rounded border border-[#38A36D]/20">
                                                                        {product.capsulesPerContainer}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/products/edit/${product.id}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm"
                                            >
                                                <SvgEdit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id!, product.name)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/40"
                                            >
                                                <SvgTrash className="w-4 h-4" />
                                                Delete
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

