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
    const [editBadge, setEditBadge] = useState("");
    const [editShortDesc, setEditShortDesc] = useState("");
    const [editImageFile, setEditImageFile] = useState<File | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newSvg, setNewSvg] = useState("");
    const [newBadge, setNewBadge] = useState("");
    const [newShortDesc, setNewShortDesc] = useState("");
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

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
        } catch (err: any) {
            console.error("Delete Category Error:", err);
            alert(`Failed to delete category: ${err.message || "Unknown error"}`);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const categoryBlob = new Blob([JSON.stringify({ name: newName, svg: newSvg, badge: newBadge, shortDescription: newShortDesc })], { type: 'application/json' });
            formData.append('category', categoryBlob);
            if (newImageFile) {
                formData.append('image', newImageFile);
            }

            const newCat = await api.categories.create(formData);
            setCategories([...categories, newCat]);
            setIsCreating(false);
            setNewName("");
            setNewSvg("");
            setNewBadge("");
            setNewShortDesc("");
            setNewImageFile(null);
        } catch (err: any) {
            console.error("Create Category Error:", err);
            alert(`Failed to create category: ${err.message || "Unknown error"}`);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const formData = new FormData();
            const categoryBlob = new Blob([JSON.stringify({ id, name: editName, svg: editSvg, badge: editBadge, shortDescription: editShortDesc })], { type: 'application/json' });
            formData.append('category', categoryBlob);
            if (editImageFile) {
                formData.append('image', editImageFile);
            }

            const updated = await api.categories.update(id, formData);
            setCategories(categories.map(c => c.id === id ? updated : c));
            setIsEditing(null);
            setEditBadge("");
            setEditShortDesc("");
            setEditImageFile(null);
        } catch (err: any) {
            console.error("Update Category Error:", err);
            alert(`Failed to update category: ${err.message || "Unknown error"}`);
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
                        className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A190E] rounded-lg hover:bg-white font-bold text-xs uppercase transition-all"
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
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 mb-2">Category Name</label>
                                        <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#38A36D]" placeholder="e.g. Vitamins" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-white/40 mb-2">Category Brand Image</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setNewImageFile(e.target.files?.[0] || null)}
                                                className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20"
                                            />
                                            {newImageFile && (
                                                <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0">
                                                    <img src={URL.createObjectURL(newImageFile)} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-white/40 mb-2">SVG Icon Code (Optional)</label>
                                    <textarea value={newSvg} onChange={e => setNewSvg(e.target.value)} className="w-full h-40 bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#38A36D] font-mono text-xs" placeholder="<svg>...</svg>" />
                                    <div className="mt-4">
                                        <label className="block text-xs uppercase text-white/40 mb-2">Badge</label>
                                        <input value={newBadge} onChange={e => setNewBadge(e.target.value)} className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-white" placeholder="Badge (e.g., BESTSELLER)" />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-xs uppercase text-white/40 mb-2">Short Description</label>
                                        <input value={newShortDesc} onChange={e => setNewShortDesc(e.target.value)} className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-white" placeholder="Short description" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 border border-white/10 text-white rounded-xl text-xs uppercase font-bold hover:bg-white/5">Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-[#D4AF37] text-[#0A190E] rounded-xl text-xs uppercase font-bold hover:bg-white">Create</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#111] text-[11px] uppercase text-white/40 tracking-widest font-black border-b border-white/10">
                            <tr>
                                <th className="p-5 pl-8 font-medium">Image</th>
                                <th className="p-5 font-medium">Category Name</th>
                                <th className="p-5 font-medium">Dynamic Content</th>
                                <th className="p-5 pr-8 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/20">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/[0.04] transition-colors group">
                                    <td className="p-5 pl-8 align-top">
                                        <div className="relative group/img w-[80px] h-[80px]">
                                            <div className="w-full h-full rounded-xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                                                {cat.image ? (
                                                    <img src={cat.image.startsWith('data:') ? cat.image : `data:image/png;base64,${cat.image}`} alt={cat.name} className="w-full h-[150%] object-contain object-bottom pt-2" />
                                                ) : (
                                                    <span className="text-[10px] text-white/20 uppercase font-black">No img</span>
                                                )}
                                            </div>
                                            {isEditing === cat.id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl backdrop-blur-sm cursor-pointer border border-[#38A36D]">
                                                    <label className="cursor-pointer p-2 w-full h-full flex items-center justify-center">
                                                        <SvgPlus className="w-6 h-6 text-[#38A36D]" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={e => setEditImageFile(e.target.files?.[0] || null)} />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        {isEditing === cat.id && editImageFile && (
                                            <div className="mt-2 text-[10px] text-[#38A36D] font-black uppercase tracking-wider text-center">
                                                File Ready
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 align-top">
                                        {isEditing === cat.id ? (
                                            <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/80 border border-white/20 focus:border-[#38A36D] rounded-lg px-4 py-3 text-white outline-none w-full text-sm font-medium transition-colors" placeholder="Category Name" />
                                        ) : (
                                            <div>
                                                <span className="font-bold text-xl tracking-tight text-white mb-1 block uppercase font-heading">{cat.name}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 align-top">
                                        {isEditing === cat.id ? (
                                            <div className="space-y-3">
                                                <input value={editBadge} onChange={e => setEditBadge(e.target.value)} className="w-full bg-black/80 border border-white/20 focus:border-[#38A36D] rounded-lg px-4 py-2 text-white text-sm outline-none transition-colors" placeholder="Badge (e.g., BESTSELLER)" />
                                                <input value={editShortDesc} onChange={e => setEditShortDesc(e.target.value)} className="w-full bg-black/80 border border-white/20 focus:border-[#38A36D] rounded-lg px-4 py-2 text-white text-sm outline-none transition-colors" placeholder="Short description" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {(cat as any).badge ? (
                                                    <span className="inline-flex max-w-max items-center px-2 py-1 bg-[#E21837]/10 text-[#E21837] text-[10px] font-black uppercase tracking-wider rounded border border-[#E21837]/20">
                                                        Badge: {(cat as any).badge}
                                                    </span>
                                                ) : <span className="text-white/20 text-xs italic">No Badge</span>}

                                                {(cat as any).shortDescription ? (
                                                    <span className="text-sm text-white/60">
                                                        {(cat as any).shortDescription}
                                                    </span>
                                                ) : <span className="text-white/20 text-xs italic">No Description</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 pr-8 text-right align-top">
                                        {isEditing === cat.id ? (
                                            <div className="flex justify-end gap-3 pt-1">
                                                <button onClick={() => setIsEditing(null)} className="text-white/40 hover:text-white font-bold text-xs uppercase tracking-wider px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg transition-colors">Cancel</button>
                                                <button onClick={() => handleUpdate(cat.id!)} className="bg-[#38A36D] text-[#0A190E] hover:bg-emerald-400 font-black text-xs uppercase tracking-wider px-4 py-2 border border-[#38A36D] rounded-lg transition-colors shadow-lg shadow-[#38A36D]/20">Save</button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-3 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setIsEditing(cat.id!); setEditName(cat.name); setEditSvg(cat.svg || ""); setEditBadge((cat as any).badge || ""); setEditShortDesc((cat as any).shortDescription || ""); setEditImageFile(null); }} className="p-2 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                    <SvgEdit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id!)} className="p-2 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all">
                                                    <SvgTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-white/40 font-medium">
                                        No categories found. Create your first category above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </main>
    )
}

