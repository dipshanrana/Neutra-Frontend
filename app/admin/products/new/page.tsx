"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { api, Product, Category, ApiError, API_BASE_URL, getAdminToken, formatBase64Image } from "@/lib/api";

const SvgBack = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgUpload = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 8 12 3 7 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="3" x2="12" y2="15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgX = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <line x1="18" y1="6" x2="6" y2="18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="6" y1="6" x2="18" y2="18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgImage = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
        <polyline points="21 15 16 10 5 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgPlus = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default function ProductForm() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id ? parseInt(params.id as string) : null;
    const isEdit = productId !== null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        categoryName: "",
        categorySvg: "",
        description: "",
        mp: "", // Fallback
        sp: "", // Fallback
        singleProductMp: "",
        singleProductSp: "",
        twoProductMp: "",
        twoProductSp: "",
        threeProductMp: "",
        threeProductSp: "",
        discount: "0",
        images: [] as string[],
        featuredImages: ["", ""] as string[], // Previews/URLs (Exactly 2)
        singleProductImage: "",
        twoProductImage: "",
        threeProductImage: "",
        benefits: [] as { svg: string, nutrientName: string, benefitDescription: string }[],
        link: "",
        servingSize: "",
        capsulesPerContainer: "",
        supplementFacts: [] as { nutrientName: string, amountPerServing: string, amount: string }[],
        freebies: [] as string[],
        reviews: [] as { username: string, stars: number, comment: string }[],
        howToUse: ["", "", "", ""]
    });

    // File states for multipart submission
    const [featuredImageFiles, setFeaturedImageFiles] = useState<(File | null)[]>([null, null]);
    const [singleProductImageFile, setSingleProductImageFile] = useState<File | null>(null);
    const [twoProductImageFile, setTwoProductImageFile] = useState<File | null>(null);
    const [threeProductImageFile, setThreeProductImageFile] = useState<File | null>(null);

    useEffect(() => {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) {
            router.push('/admin/login');
            return;
        }
        loadCategories();
        if (isEdit) {
            loadProduct();
        }
    }, [router, isEdit]);

    const loadCategories = async () => {
        try {
            const data = await api.categories.getAll();
            if (Array.isArray(data)) setCategories(data);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const loadProduct = async () => {
        try {
            const product = await api.products.getById(productId!);
            if (!product || Array.isArray(product)) {
                setError("Product not found");
                setLoadingData(false);
                return;
            }
            const category = typeof product.category === 'string'
                ? { name: product.category }
                : product.category;

            setFormData({
                name: product.name,
                categoryId: typeof product.category === 'object' && product.category.id ? product.category.id.toString() : "",
                categoryName: category.name,
                categorySvg: typeof product.category === 'object' ? product.category.svg : "",
                description: product.description,
                mp: product.mp?.toString() ?? "",
                sp: product.sp?.toString() ?? "",
                singleProductMp: product.singleProductMp?.toString() ?? "",
                singleProductSp: product.singleProductSp?.toString() ?? "",
                twoProductMp: product.twoProductMp?.toString() ?? "",
                twoProductSp: product.twoProductSp?.toString() ?? "",
                threeProductMp: product.threeProductMp?.toString() ?? "",
                threeProductSp: product.threeProductSp?.toString() ?? "",
                discount: product.discount?.toString() ?? "0",
                images: product.images && product.images.length > 0 ? product.images : [],
                featuredImages: product.featuredImages && product.featuredImages.length > 0
                    ? [...product.featuredImages, ...Array(2).fill("")].slice(0, 2)
                    : ["", ""],
                singleProductImage: product.singleProductImage || "",
                twoProductImage: product.twoProductImage || "",
                threeProductImage: product.threeProductImage || "",
                benefits: product.benefits && product.benefits.length > 0 ? product.benefits : [],
                link: product.link || "",
                servingSize: product.servingSize || "",
                capsulesPerContainer: product.capsulesPerContainer || "",
                supplementFacts: product.supplementFacts && product.supplementFacts.length > 0 ? product.supplementFacts : [],
                freebies: product.freebies && product.freebies.length > 0 ? product.freebies : [],
                reviews: product.reviews && product.reviews.length > 0 ? product.reviews : [],
                howToUse: product.howToUse && product.howToUse.length > 0
                    ? [...product.howToUse, ...Array(Math.max(0, 4 - product.howToUse.length)).fill("")]
                    : ["", "", "", ""]
            });
        } catch (err) {
            setError("Failed to load product");
            console.error(err);
        } finally {
            setLoadingData(false);
        }
    };

    // Upload a file to the backend or convert to data URL
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);

        const newImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                continue;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError(`File "${file.name}" exceeds 5MB limit`);
                continue;
            }

            try {
                // Try uploading to backend first
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const token = getAdminToken();
                const uploadRes = await fetch(`${API_BASE_URL}/products/upload`, {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: formDataUpload,
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    // Backend returns the URL of the uploaded image
                    newImages.push(data.url || data.imageUrl || data);
                } else {
                    // Fallback: convert to base64 data URL if backend upload fails
                    const dataUrl = await fileToDataUrl(file);
                    newImages.push(dataUrl);
                }
            } catch {
                // Fallback: convert to base64 data URL
                const dataUrl = await fileToDataUrl(file);
                newImages.push(dataUrl);
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
        setUploading(false);
    };

    const uploadIndividualFile = async (file: File): Promise<string | null> => {
        if (!file.type.startsWith('image/')) return null;
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            const token = getAdminToken();
            const uploadRes = await fetch(`${API_BASE_URL}/products/upload`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formDataUpload,
            });
            if (uploadRes.ok) {
                const data = await uploadRes.json();
                return data.url || data.imageUrl || data;
            }
            return await fileToDataUrl(file);
        } catch {
            return await fileToDataUrl(file);
        }
    };

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleUrlAdd = () => {
        const url = prompt("Enter image URL:");
        if (url && url.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, url.trim()]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate How To Use fields (must not be empty)
        if (formData.howToUse.some(step => step.trim() === "")) {
            setError("Please fill out all 'How To Use' steps. Remove any extra empty steps if not needed.");
            setLoading(false);
            return;
        }

        try {
            const productData = {
                name: formData.name,
                category: formData.categoryId
                    ? { name: formData.categoryName, svg: formData.categorySvg }
                    : { name: formData.categoryName, svg: formData.categorySvg || "" },
                description: formData.description,
                mp: formData.mp ? parseFloat(formData.mp) : 0,
                sp: formData.sp ? parseFloat(formData.sp) : 0,
                singleProductMp: formData.singleProductMp ? parseFloat(formData.singleProductMp) : undefined,
                singleProductSp: formData.singleProductSp ? parseFloat(formData.singleProductSp) : undefined,
                twoProductMp: formData.twoProductMp ? parseFloat(formData.twoProductMp) : undefined,
                twoProductSp: formData.twoProductSp ? parseFloat(formData.twoProductSp) : undefined,
                threeProductMp: formData.threeProductMp ? parseFloat(formData.threeProductMp) : undefined,
                threeProductSp: formData.threeProductSp ? parseFloat(formData.threeProductSp) : undefined,
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                images: formData.images.filter(img => img.trim() !== ""),
                // We don't send featuredImages, singleProductImage, etc. in the JSON if they are being sent as Files
                // But for Edit mode, if we haven't changed the file, we might want to keep the URL.
                // However, the backend doc says it expects File parts. If not included, existing is kept?
                // Typically, if sent as strings in the JSON 'product', the backend uses them.
                featuredImages: formData.featuredImages.filter(img => img && img.startsWith('http')),
                singleProductImage: formData.singleProductImage && formData.singleProductImage.startsWith('http') ? formData.singleProductImage : undefined,
                twoProductImage: formData.twoProductImage && formData.twoProductImage.startsWith('http') ? formData.twoProductImage : undefined,
                threeProductImage: formData.threeProductImage && formData.threeProductImage.startsWith('http') ? formData.threeProductImage : undefined,
                benefits: formData.benefits.filter(b => b.nutrientName.trim() !== ""),
                link: formData.link,
                servingSize: formData.servingSize,
                capsulesPerContainer: formData.capsulesPerContainer,
                supplementFacts: formData.supplementFacts.filter(sf => sf.nutrientName.trim() !== ""),
                freebies: formData.freebies.filter(f => f.trim() !== ""),
                reviews: formData.reviews.filter(r => r.username.trim() !== "" && r.comment.trim() !== ""),
                howToUse: formData.howToUse.map(step => step.trim())
            };

            const multiFormData = new FormData();
            multiFormData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

            // Append pack images if they are new files
            if (singleProductImageFile) multiFormData.append('singleProductImage', singleProductImageFile);
            if (twoProductImageFile) multiFormData.append('twoProductImage', twoProductImageFile);
            if (threeProductImageFile) multiFormData.append('threeProductImage', threeProductImageFile);

            // Append featured images
            // Backend might expect exactly 5 or just the ones provided
            featuredImageFiles.forEach((file) => {
                if (file) multiFormData.append('featuredImages', file);
            });

            if (isEdit) {
                await api.products.update(productId!, multiFormData);
            } else {
                await api.products.create(multiFormData);
            }

            router.push('/admin/products');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Failed to save product");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-[#0A190E] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A190E] text-white font-sans">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products" className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <SvgBack className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-medium tracking-tight">
                            {isEdit ? "Edit Product" : "Add New Product"}
                        </h1>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Product Name */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Product Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                            placeholder="Whey Protein Isolate"
                        />
                    </div>

                    {/* Product Link */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Purchase/Official Link</label>
                        <input
                            type="url"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                            placeholder="https://example.com/buy-now"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Category *</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => {
                                const cat = categories.find(c => c.id?.toString() === e.target.value);
                                setFormData({
                                    ...formData,
                                    categoryId: e.target.value,
                                    categoryName: cat?.name || "",
                                    categorySvg: cat?.svg || ""
                                });
                            }}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white"
                        >
                            <option value="">Select or create new category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <p className="text-xs text-white/30 mt-3 mb-2">Or create a new category:</p>
                        <input
                            type="text"
                            value={formData.categoryName}
                            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value, categoryId: "" })}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                            placeholder="Category Name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors resize-none text-white placeholder-white/20"
                            placeholder="High quality whey protein isolate for muscle recovery..."
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Global Discount (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                            placeholder="20"
                        />
                        <p className="text-xs text-white/30 mt-2">Applied as a display badge/visual cue across all packs, pricing logic handled per pack below.</p>
                    </div>

                    {/* Bundle Prices */}
                    <div className="pt-8 border-t border-white/10">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-4">Bundle Dynamic Pricing (Backend synced)</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* 1 Pack */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/10 pb-2">Single Pack</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">MP (Original)</label>
                                        <input
                                            type="number" step="0.01"
                                            value={formData.singleProductMp}
                                            onChange={(e) => setFormData({ ...formData, singleProductMp: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                            placeholder="3500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">SP (Sale Price)</label>
                                        <input
                                            type="number" step="0.01"
                                            value={formData.singleProductSp}
                                            onChange={(e) => setFormData({ ...formData, singleProductSp: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                            placeholder="2800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2 Pack */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/10 pb-2">Double Pack</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Bundle MP</label>
                                        <input
                                            type="number" step="0.01"
                                            value={formData.twoProductMp}
                                            onChange={(e) => setFormData({ ...formData, twoProductMp: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                            placeholder="7000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Bundle SP</label>
                                        <input
                                            type="number" step="0.01"
                                            value={formData.twoProductSp}
                                            onChange={(e) => setFormData({ ...formData, twoProductSp: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3 Pack */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/10 pb-2">Triple Pack</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Bundle MP</label>
                                        <input
                                            type="number" step="0.01"
                                            value={formData.threeProductMp}
                                            onChange={(e) => setFormData({ ...formData, threeProductMp: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                            placeholder="10500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Bundle SP</label>
                                        <input
                                            type="number" step="0.01"
                                            value={formData.threeProductSp}
                                            onChange={(e) => setFormData({ ...formData, threeProductSp: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                            placeholder="7000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== BUNDLE & FEATURED IMAGES SECTION ==================== */}
                    <div className="space-y-8 pt-8 border-t border-white/10">
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#38A36D]">Dynamic Product Media</label>

                        {/* Pack Specific Images */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "1-Pack Image", key: "singleProductImage" },
                                { label: "2-Pack Image", key: "twoProductImage" },
                                { label: "3-Pack Image", key: "threeProductImage" }
                            ].map((item) => (
                                <div key={item.key} className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-wider text-white/40">{item.label}</label>
                                    <div
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = async (e) => {
                                                const files = (e.target as HTMLInputElement).files;
                                                if (files && files[0]) {
                                                    const file = files[0];
                                                    // Store the file for multipart submission
                                                    if (item.key === 'singleProductImage') setSingleProductImageFile(file);
                                                    if (item.key === 'twoProductImage') setTwoProductImageFile(file);
                                                    if (item.key === 'threeProductImage') setThreeProductImageFile(file);

                                                    // Create a local preview
                                                    const previewUrl = await fileToDataUrl(file);
                                                    setFormData(prev => ({ ...prev, [item.key]: previewUrl }));
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="relative aspect-square bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#38A36D]/50 transition-all group overflow-hidden"
                                    >
                                        {(formData as any)[item.key] ? (
                                            <>
                                                <img src={formatBase64Image((formData as any)[item.key]) || "/multi-vit.png"} className="w-full h-full object-cover" alt={item.label} />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                <SvgPlus className="w-6 h-6 text-white/20 mx-auto mb-2" />
                                                <span className="text-[9px] text-white/30 uppercase font-black tracking-tighter">Add</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Featured Images (max 2) */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40">Featured Images (Display on Product Page - Exactly 2)</label>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = async (e) => {
                                                const files = (e.target as HTMLInputElement).files;
                                                if (files && files[0]) {
                                                    const file = files[0];
                                                    // Store the file
                                                    const newFiles = [...featuredImageFiles];
                                                    newFiles[i] = file;
                                                    setFeaturedImageFiles(newFiles);

                                                    // Create preview
                                                    const previewUrl = await fileToDataUrl(file);
                                                    const newFeatured = [...formData.featuredImages];
                                                    newFeatured[i] = previewUrl;
                                                    setFormData(prev => ({ ...prev, featuredImages: newFeatured }));
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="relative aspect-square bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#38A36D]/50 transition-all group overflow-hidden"
                                    >
                                        {formData.featuredImages[i] ? (
                                            <>
                                                <img src={formatBase64Image(formData.featuredImages[i]) || "/multi-vit.png"} className="w-full h-full object-cover" alt="Featured" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newFeatured = [...formData.featuredImages];
                                                        newFeatured[i] = ""; // Clear preview
                                                        setFormData(prev => ({ ...prev, featuredImages: newFeatured }));

                                                        const newFiles = [...featuredImageFiles];
                                                        newFiles[i] = null; // Clear file
                                                        setFeaturedImageFiles(newFiles);
                                                    }}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <SvgX className="w-3 h-3 text-white" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <SvgPlus className="w-4 h-4 text-white/20 mx-auto" />
                                                <span className="text-[8px] text-white/20 uppercase font-bold">Slot {i + 1}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* General Gallery Images */}
                        <div className="space-y-4 pt-4">
                            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40">General Gallery Images</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                                        <img src={formatBase64Image(img)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <SvgX className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#38A36D]/50 transition-all group"
                                >
                                    <div className="text-center">
                                        <SvgPlus className="w-4 h-4 text-white/20 mx-auto group-hover:text-[#38A36D] transition-colors" />
                                        <span className="text-[8px] text-white/20 uppercase font-bold tracking-tighter group-hover:text-[#38A36D] transition-colors block mt-1">Add Image</span>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e.target.files)}
                            />
                        </div>
                    </div>

                    {/* ==================== BENEFITS SECTION ==================== */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D]">Product Benefits</label>
                        {formData.benefits.map((benefit, index) => (
                            <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 relative">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        benefits: prev.benefits.filter((_, i) => i !== index)
                                    }))}
                                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/20 rounded-lg text-white/40 hover:text-white transition-colors text-xs font-bold"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={benefit.nutrientName}
                                        onChange={(e) => {
                                            const newBenefits = [...formData.benefits];
                                            newBenefits[index].nutrientName = e.target.value;
                                            setFormData(prev => ({ ...prev, benefits: newBenefits }));
                                        }}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                        placeholder="Nutrient Name (e.g. Protein)"
                                    />
                                    <input
                                        type="text"
                                        value={benefit.svg}
                                        onChange={(e) => {
                                            const newBenefits = [...formData.benefits];
                                            newBenefits[index].svg = e.target.value;
                                            setFormData(prev => ({ ...prev, benefits: newBenefits }));
                                        }}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                        placeholder="SVG Icon Code (<svg>...</svg>)"
                                    />
                                    <textarea
                                        value={benefit.benefitDescription}
                                        onChange={(e) => {
                                            const newBenefits = [...formData.benefits];
                                            newBenefits[index].benefitDescription = e.target.value;
                                            setFormData(prev => ({ ...prev, benefits: newBenefits }));
                                        }}
                                        rows={2}
                                        className="w-full md:col-span-2 px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20 resize-none"
                                        placeholder="Benefit Description"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, benefits: [...prev.benefits, { svg: "", nutrientName: "", benefitDescription: "" }] }))}
                            className="text-xs text-[#38A36D] hover:text-white/80 transition-colors font-medium uppercase tracking-wider"
                        >
                            + Add Benefit
                        </button>
                    </div>

                    {/* ==================== SUPPLEMENT FACTS ==================== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Serving Size</label>
                            <input
                                type="text"
                                value={formData.servingSize}
                                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                placeholder="e.g. 1 Scoop (30g) or 2 Capsules"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Servings per Container (Capsules/Scoops)</label>
                            <input
                                type="text"
                                value={formData.capsulesPerContainer}
                                onChange={(e) => setFormData({ ...formData, capsulesPerContainer: e.target.value })}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                placeholder="e.g. 30"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D]">Supplement Facts Table</label>
                        {formData.supplementFacts.map((fact, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-2 relative p-4 sm:p-0 bg-white/5 sm:bg-transparent border border-white/10 sm:border-none rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        supplementFacts: prev.supplementFacts.filter((_, i) => i !== index)
                                    }))}
                                    className="absolute top-2 right-2 sm:hidden w-8 h-8 flex flex-shrink-0 items-center justify-center bg-black/20 rounded-lg text-white/40 hover:text-white transition-colors text-xs font-bold"
                                >
                                    ✕
                                </button>
                                <input
                                    type="text"
                                    value={fact.nutrientName}
                                    onChange={(e) => {
                                        const newFacts = [...formData.supplementFacts];
                                        newFacts[index].nutrientName = e.target.value;
                                        setFormData(prev => ({ ...prev, supplementFacts: newFacts }));
                                    }}
                                    className="flex-[2] px-4 py-3 bg-white/5 sm:bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                    placeholder="Nutrient (e.g. Vitamin C)"
                                />
                                <input
                                    type="text"
                                    value={fact.amountPerServing}
                                    onChange={(e) => {
                                        const newFacts = [...formData.supplementFacts];
                                        newFacts[index].amountPerServing = e.target.value;
                                        setFormData(prev => ({ ...prev, supplementFacts: newFacts }));
                                    }}
                                    className="flex-1 px-4 py-3 bg-white/5 sm:bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                    placeholder="Amount (e.g. 50mg)"
                                />
                                <input
                                    type="text"
                                    value={fact.amount}
                                    onChange={(e) => {
                                        const newFacts = [...formData.supplementFacts];
                                        newFacts[index].amount = e.target.value;
                                        setFormData(prev => ({ ...prev, supplementFacts: newFacts }));
                                    }}
                                    className="flex-1 px-4 py-3 bg-white/5 sm:bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                    placeholder="% DV (e.g. 55%)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        supplementFacts: prev.supplementFacts.filter((_, i) => i !== index)
                                    }))}
                                    className="hidden sm:block px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white/40 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, supplementFacts: [...prev.supplementFacts, { nutrientName: "", amountPerServing: "", amount: "" }] }))}
                            className="text-xs text-[#38A36D] hover:text-white/80 transition-colors font-medium uppercase tracking-wider"
                        >
                            + Add Supplement Fact
                        </button>
                    </div>

                    {/* ==================== FREEBIES ==================== */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">Freebies / Shipping Perks</label>
                        {formData.freebies.map((freebie, index) => (
                            <div key={index} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={freebie}
                                    onChange={(e) => {
                                        const newFreebies = [...formData.freebies];
                                        newFreebies[index] = e.target.value;
                                        setFormData(prev => ({ ...prev, freebies: newFreebies }));
                                    }}
                                    className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                    placeholder="e.g. Free shipping over NPR 5000"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        freebies: prev.freebies.filter((_, i) => i !== index)
                                    }))}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white/40 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, freebies: [...prev.freebies, ""] }))}
                            className="text-xs text-[#38A36D] hover:text-white/80 transition-colors font-medium uppercase tracking-wider"
                        >
                            + Add Freebie
                        </button>
                    </div>

                    {/* ==================== HOW TO USE ==================== */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D] mb-3">How To Use</label>
                        <div className="space-y-3">
                            {formData.howToUse && formData.howToUse.map((step, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => {
                                            const newHowToUse = [...formData.howToUse];
                                            newHowToUse[index] = e.target.value;
                                            setFormData(prev => ({ ...prev, howToUse: newHowToUse }));
                                        }}
                                        className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#38A36D] transition-colors text-white placeholder-white/20"
                                        placeholder={`Step ${index + 1} description`}
                                    />
                                    {formData.howToUse.length > 4 && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                howToUse: prev.howToUse.filter((_, i) => i !== index)
                                            }))}
                                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white/40 text-xs font-bold"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, howToUse: [...prev.howToUse, ""] }))}
                            className="mt-3 text-xs text-[#38A36D] hover:text-white/80 transition-colors font-medium uppercase tracking-wider"
                        >
                            + Add Step
                        </button>
                    </div>

                    {/* ==================== REVIEWS ==================== */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#38A36D]">Customer Reviews</label>
                        {formData.reviews.map((review, index) => (
                            <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 relative">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        reviews: prev.reviews.filter((_, i) => i !== index)
                                    }))}
                                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/20 rounded-lg text-white/40 hover:text-white transition-colors text-xs font-bold"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <input
                                        type="text"
                                        value={review.username}
                                        onChange={(e) => {
                                            const newReviews = [...formData.reviews];
                                            newReviews[index].username = e.target.value;
                                            setFormData(prev => ({ ...prev, reviews: newReviews }));
                                        }}
                                        className="w-full md:col-span-3 px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                        placeholder="Customer Name (e.g. Sarah J.)"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={review.stars}
                                        onChange={(e) => {
                                            const newReviews = [...formData.reviews];
                                            newReviews[index].stars = parseInt(e.target.value) || 5;
                                            setFormData(prev => ({ ...prev, reviews: newReviews }));
                                        }}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20"
                                        placeholder="Stars (1-5)"
                                    />
                                    <textarea
                                        value={review.comment}
                                        onChange={(e) => {
                                            const newReviews = [...formData.reviews];
                                            newReviews[index].comment = e.target.value;
                                            setFormData(prev => ({ ...prev, reviews: newReviews }));
                                        }}
                                        rows={2}
                                        className="w-full md:col-span-4 px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#38A36D] transition-colors text-sm text-white placeholder-white/20 resize-none"
                                        placeholder="Detailed review comment..."
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, reviews: [...prev.reviews, { username: "", stars: 5, comment: "" }] }))}
                            className="text-xs text-[#38A36D] hover:text-white/80 transition-colors font-medium uppercase tracking-wider"
                        >
                            + Add Review
                        </button>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-5 bg-emerald-600 text-[#0A190E] rounded-xl hover:bg-white transition-colors font-black uppercase tracking-[0.15em] text-[11px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(56,163,109,0.3)]"
                        >
                            {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                        </button>
                        <Link
                            href="/admin/products"
                            className="px-8 py-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-bold text-center uppercase tracking-wider text-[11px]"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div >
        </main >
    );
}
