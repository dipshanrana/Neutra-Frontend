"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api, ApiError, Category, formatBase64Image } from "@/lib/api";
import { Image as ImageIcon, X } from "lucide-react";

export default function EditInformation() {
    const router = useRouter();
    const params = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        categoryId: ""
    });

    useEffect(() => {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) { router.push('/admin/login'); return; }

        const loadInitialData = async () => {
            try {
                const id = parseInt(params.id as string);
                const [infoData, allCategories] = await Promise.all([
                    api.info.getById(id),
                    api.categories.getAll()
                ]);

                if (infoData) {
                    setFormData({
                        title: infoData.title,
                        content: infoData.content,
                        categoryId: infoData.category?.id?.toString() || ""
                    });
                    if (infoData.image) {
                        setImagePreview(formatBase64Image(infoData.image));
                    }
                }

                if (Array.isArray(allCategories)) setCategories(allCategories);
            } catch (e) {
                console.error(e);
                setError("Failed to load information page data");
            } finally {
                setFetching(false);
            }
        };

        loadInitialData();
    }, [router, params.id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const id = parseInt(params.id as string);
            const data = new FormData();
            const infoJson = {
                title: formData.title,
                content: formData.content,
                category: formData.categoryId ? { id: parseInt(formData.categoryId) } as Category : undefined
            };

            data.append('information', new Blob([JSON.stringify(infoJson)], { type: 'application/json' }));
            if (selectedImage) {
                data.append('image', selectedImage);
            }

            await api.info.update(id, data);
            router.push('/admin/information');
        } catch (err) {
            if (err instanceof ApiError) setError(err.message);
            else setError("Failed to update information page");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen bg-[#0A190E] flex items-center justify-center">
            <div className="w-10 h-10 border-t-2 border-[#38A36D] animate-spin rounded-full"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/information" className="text-white/50 hover:text-white transition-colors text-sm">← Information</Link>
                        <h1 className="text-2xl font-black tracking-tighter font-heading">
                            Edit <span className="text-[#38A36D]">Information Page</span>
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {error && (
                    <div className="mb-8 p-4 bg-red-950/50 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Contextual Image</label>
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600 transition-colors rounded-full"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-[#38A36D]/30 transition-all">
                                    <ImageIcon className="w-12 h-12 text-white/20 mb-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Drop page image or click</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Page Title</label>
                        <input
                            type="text" required
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                            placeholder="e.g. Science of Protein Synthesis"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Linked Category (optional)</label>
                        <select
                            value={formData.categoryId}
                            onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white appearance-none"
                        >
                            <option value="" className="bg-[#0A190E]">No Category Link</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#0A190E]">{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Content</label>
                        <textarea
                            required rows={12}
                            value={formData.content}
                            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20 resize-y"
                            placeholder="Write the detailed information page content here..."
                        />
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-white/10">
                        <button
                            type="submit" disabled={loading}
                            className="flex-1 py-5 bg-brand-primary text-[#0A190E] rounded-xl hover:bg-white transition-colors font-black uppercase tracking-[0.15em] text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Information Page"}
                        </button>
                        <Link
                            href="/admin/information"
                            className="px-8 py-5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/30 transition-all font-medium text-sm flex items-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
