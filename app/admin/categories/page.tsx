"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Category, logout } from "@/lib/api";

const SvgArrowLeft = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M20 12H4M4 12L11 5M4 12L11 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgPlus = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M12 5V19M5 12H19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
);

const SvgTrash = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgEdit = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function AdminCategories() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editSvg, setEditSvg] = useState("");

    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newSvg, setNewSvg] = useState("");

    useEffect(() => {
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
        loadCategories();
    }, [router]);

    const loadCategories = async () => {
        try {
            const data = await api.categories.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.categories.delete(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete category");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newCat = await api.categories.create({ name: newName, svg: newSvg });
            setCategories([...categories, newCat]);
            setIsCreating(false);
            setNewName("");
            setNewSvg("");
        } catch (err) {
            alert("Failed to create category");
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const updated = await api.categories.update(id, { name: editName, svg: editSvg });
            setCategories(categories.map(c => c.id === id ? updated : c));
            setIsEditing(null);
        } catch (err) {
            alert("Failed to update category");
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0A190E] text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard" className="text-white/40 hover:text-white transition-colors">
                            <SvgArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-black tracking-tighter text-white font-heading">
                            Manage <span className="text-[#38A36D]">Categories</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-[#0A190E] rounded-lg hover:bg-white font-bold text-xs uppercase transition-all"
                    >
                        <SvgPlus className="w-4 h-4" /> Add Category
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">

                {isCreating && (
                    <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-medium mb-6">Create New Category</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-white/40 mb-2">Category Name</label>
                                <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#38A36D]" placeholder="e.g. Vitamins" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-white/40 mb-2">SVG Icon Code (Optional)</label>
                                <textarea value={newSvg} onChange={e => setNewSvg(e.target.value)} className="w-full h-32 bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#38A36D] font-mono text-xs" placeholder="<svg>...</svg>" />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 border border-white/10 text-white rounded-xl text-xs uppercase font-bold hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-emerald-600 text-[#0A190E] rounded-xl text-xs uppercase font-bold hover:bg-white">Create</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase text-white/40 font-bold border-b border-white/10">
                            <tr>
                                <th className="p-6">ID</th>
                                <th className="p-6">Name</th>
                                <th className="p-6">Icon Preview</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 font-mono text-white/60">#{cat.id}</td>
                                    <td className="p-6">
                                        {isEditing === cat.id ? (
                                            <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/50 border border-[#38A36D] rounded px-3 py-2 text-white outline-none" />
                                        ) : (
                                            <span className="font-medium text-lg tracking-tight">{cat.name}</span>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        {isEditing === cat.id ? (
                                            <textarea value={editSvg} onChange={e => setEditSvg(e.target.value)} className="w-full h-20 bg-black/50 border border-[#38A36D] rounded px-3 py-2 text-white font-mono text-xs outline-none" />
                                        ) : (
                                            <div className="w-10 h-10 text-[#38A36D] [&>svg]:w-10 [&>svg]:h-10 [&>svg]:block" dangerouslySetInnerHTML={{ __html: cat.svg || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="1.5"/></svg>' }} />
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        {isEditing === cat.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleUpdate(cat.id!)} className="text-[#38A36D] hover:text-white font-bold text-xs uppercase tracking-wider px-3 py-1 border border-[#38A36D] rounded">Save</button>
                                                <button onClick={() => setIsEditing(null)} className="text-white/40 hover:text-white font-bold text-xs uppercase tracking-wider px-3 py-1 border border-white/10 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-4">
                                                <button onClick={() => { setIsEditing(cat.id!); setEditName(cat.name); setEditSvg(cat.svg || ""); }} className="text-white/40 hover:text-white transition-colors">
                                                    <SvgEdit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id!)} className="text-red-500/70 hover:text-red-500 transition-colors">
                                                    <SvgTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </main>
    )
}
