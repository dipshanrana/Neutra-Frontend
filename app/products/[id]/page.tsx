"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { api, productApi, Product, formatBase64Image, getProductAllImages, getProductMainImage } from "@/lib/api";
import {
    ShoppingCart, Star, ChevronRight, Truck, ShieldCheck,
    RotateCcw, Plus, Minus, Check, Heart,
    Leaf, FlaskConical, Award, ExternalLink,
    HelpCircle, ChevronDown
} from "lucide-react";

/* ── Star Rating ─────────────────────────────── */
function StarRating({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "lg" }) {
    const sz = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} strokeWidth={0}
                        className={`${sz} ${i < Math.round(rating) ? "fill-[#F5A623]" : "fill-stone-200"}`} />
                ))}
            </div>
            {count !== undefined && (
                <span className="font-sans text-stone-500 text-sm">({count})</span>
            )}
        </div>
    );
}

/* ── Main Content ─────────────────────────────── */
function ProductDetailContent() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [bundleQty, setBundleQty] = useState<1 | 2 | 3>(1);
    const [quantity, setQuantity] = useState(1);
    const [relatedBlog, setRelatedBlog] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const id = parseInt(params.id as string);
                if (!isNaN(id)) {
                    const [data, all, blogs] = await Promise.all([
                        productApi.getById(id),
                        productApi.getAll(),
                        api.blogs.getAll()
                    ]);

                    if (data && !Array.isArray(data)) {
                        setProduct(data);

                        // Find a blog that mentions this product
                        if (blogs && Array.isArray(blogs)) {
                            const found = blogs.find(b => b.relatedProducts?.some(rp => rp.id === data.id));
                            if (found) setRelatedBlog(found);
                        }

                        if (all && Array.isArray(all)) {
                            const currentCatName = (typeof data.category === "string" ? data.category : data.category?.name || "").toLowerCase().trim();
                            const same = all.filter(p => {
                                const pCatName = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase().trim();
                                return p.id !== data.id && pCatName === currentCatName && currentCatName !== "";
                            }).slice(0, 4);
                            const extra = all.filter(p => p.id !== data.id && !same.find(s => s.id === p.id)).slice(0, 4 - same.length);
                            setRelated([...same, ...extra]);
                        }
                    }
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, [params.id]);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center min-h-screen bg-[#FAF8F3]">
            <div className="w-10 h-10 border-[3px] border-emerald-200 border-t-brand-primary rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-48 bg-[#FAF8F3]">
            <h1 className="font-heading text-5xl font-semibold text-[#2A401E] mb-4">Not Found</h1>
            <Link href="/products" className="mt-2 px-8 py-3.5 bg-brand-primary text-white rounded-full font-heading font-medium hover:bg-brand-secondary transition-colors">
                Back to Products
            </Link>
        </div>
    );

    // Determine the main display image based on bundle selection if not manually overridden
    let bundleImage = "";
    if (bundleQty === 1) bundleImage = formatBase64Image(product.singleProductImage);
    else if (bundleQty === 2) bundleImage = formatBase64Image(product.twoProductImage);
    else if (bundleQty === 3) bundleImage = formatBase64Image(product.threeProductImage);

    const images = getProductAllImages(product);
    const img = selectedImg ?? (bundleImage || images[0]);
    const cat = typeof product.category === "string" ? product.category : product.category?.name ?? "Supplement";
    const reviews = product.reviews ?? [];
    const avgRating = reviews.length ? +(reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : 0;

    let displaySp = product.singleProductSp ?? product.sp;
    let displayMp = product.singleProductMp ?? product.mp;
    if (bundleQty === 2) {
        displaySp = product.twoProductSp ?? (product.singleProductSp ?? product.sp) * 2;
        displayMp = product.twoProductMp ?? (product.singleProductMp ?? product.mp) * 2;
    } else if (bundleQty === 3) {
        displaySp = product.threeProductSp ?? (product.singleProductSp ?? product.sp) * 3;
        displayMp = product.threeProductMp ?? (product.singleProductMp ?? product.mp) * 3;
    }
    const savePct = displayMp > displaySp ? Math.round(((displayMp - displaySp) / displayMp) * 100) : 0;
    const freebies = product.freebies ?? [];
    const benefits = product.benefits ?? [];
    const facts = product.supplementFacts ?? [];
    const howToUse = product.howToUse ?? [];

    return (
        <div className="flex-1 bg-[#FAF8F3]">
            {/* ── BREADCRUMB ─────────────────── */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-11 flex items-center">
                    <nav className="flex items-center gap-2 text-[13px] text-stone-400 font-sans font-medium">
                        <Link href="/" className="hover:text-[#2A401E] transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        <Link href="/products" className="hover:text-[#2A401E] transition-colors">Products</Link>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        <span className="text-[#2A401E] font-semibold truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Decorative Full-Width Cover Section */}
            <div className="relative bg-gradient-to-br from-emerald-50/40 via-stone-50/20 to-amber-50/20 border-b border-stone-200/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                                <Leaf className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.3em]">Premium Quality</p>
                                <p className="font-sans text-[13px] text-stone-700 font-semibold">100% Natural Ingredients</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="font-sans text-[12px] text-stone-600">Lab Tested</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-emerald-600" />
                                <span className="font-sans text-[12px] text-stone-600">Premium Grade</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300/30 to-transparent"></div>
            </div>

            {/* ── MAIN SURFACE: Hero + Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 mt-8 mb-16">
                <div className="bg-white rounded-[3rem] border border-stone-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                    {/* HERO SECTION */}
                    <div className="pt-12 lg:pt-16 pb-0">
                        <div className="px-6 lg:px-12 flex flex-col lg:flex-row gap-10 xl:gap-12 items-stretch">
                    {/* LEFT COLUMN: Gallery & Extra Content */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-10 min-w-0">
                        <div className="lg:h-[550px]">
                            <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 h-full">
                                {/* Thumbnails */}
                                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto w-full lg:w-[88px] shrink-0 pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    {images.map((src, idx) => {
                                        const isActive = selectedImg ? src === selectedImg : (idx === 0 && !selectedImg && !bundleImage);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImg(src)}
                                                className={`relative w-20 lg:w-full aspect-square shrink-0 rounded-2xl overflow-hidden bg-white border-2 transition-all duration-300 group ${isActive ? 'border-[#2A401E] shadow-[0_4px_12px_rgba(42,64,30,0.15)] ring-1 ring-[#2A401E]/20' : 'border-stone-100/80 hover:border-[#2A401E]/40'}`}
                                            >
                                                <div className="absolute inset-0 bg-[#FAF8F3]/50"></div>
                                                <img
                                                    src={src}
                                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                                    className={`relative w-full h-full object-contain p-2 mix-blend-multiply transition-opacity duration-500 ease-out ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Main Hero Image */}
                                <div className="relative flex-1 aspect-square lg:aspect-auto h-full bg-[#f6f6f8] rounded-[2rem] overflow-hidden border border-stone-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group flex items-center justify-center cursor-crosshair">
                                    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex flex-col gap-2.5">
                                        {savePct > 0 && (
                                            <div className="bg-[#2A401E] text-white font-sans text-[10px] sm:text-[11px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold shadow-[0_4px_12px_rgba(42,64,30,0.2)]">
                                                Save {savePct}%
                                            </div>
                                        )}
                                        <div className="bg-white/90 backdrop-blur-md text-[#2A401E] font-sans text-[9px] sm:text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.25em] border border-stone-200 font-bold">
                                            {cat}
                                        </div>
                                    </div>

                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img
                                            src={img}
                                            alt={product.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: Buy Panel */}
                    <div className="w-full lg:w-1/2 shrink-0">
                        <div className="lg:sticky lg:top-6 space-y-4">
                            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                                <div className="p-5 pb-4 border-b border-stone-100">
                                    <div className="flex flex-col gap-1.5 mb-2.5">
                                        <div className="flex items-center gap-2 text-[12px] text-stone-400 font-sans">
                                            <Link href="/" className="hover:text-brand-primary">Home</Link>
                                            <span>/</span>
                                            <Link href="/products" className="hover:text-brand-primary">{cat}</Link>
                                        </div>
                                        <h1 className="font-heading text-[#2A401E] text-[1.6rem] leading-[1.2] tracking-tight">
                                            {product.name}
                                        </h1>
                                        <div className="flex items-center gap-1">
                                            <span className="font-sans text-[13px] text-stone-500">By</span>
                                            <Link href={relatedBlog ? `/blog/${relatedBlog.id}` : "/blogs"} className="font-sans text-[13px] text-brand-primary font-semibold hover:underline flex items-center gap-0.5">
                                                {product.name.split(' ')[0]} {product.name.split(' ')[1]} <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} strokeWidth={0}
                                                        className={`w-4 h-4 ${i < Math.round(avgRating || 4.5) ? "fill-[#00A39E]" : "fill-stone-200"}`} />
                                                ))}
                                            </div>
                                            <span className="font-sans text-[13px] font-bold text-[#252422]">
                                                {avgRating ? avgRating.toFixed(1) : "4.8"} <span className="text-stone-400 font-medium ml-1">({reviews.length > 0 ? reviews.length : 44} Reviews)</span>
                                            </span>
                                        </div>

                                        {/* Freebies Section in Header */}
                                        {product.freebies && product.freebies.length > 0 && (
                                            <div className="flex flex-col items-end gap-1.5 pt-1">
                                                <div className="flex items-center gap-1.5">
                                                    {product.freebies.map((freebie, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5 bg-brand-primary/[0.03] border border-brand-primary/10 px-2 py-1 rounded-md">
                                                            <div className="w-4 h-4 rounded-full bg-brand-accent flex items-center justify-center">
                                                                <Award className="w-2.5 h-2.5 text-white" />
                                                            </div>
                                                            <span className="font-sans text-[11px] text-[#2A401E] font-bold whitespace-nowrap">{freebie}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 py-3 border-b border-stone-100">
                                    <div className="flex flex-col gap-0.5 mb-2">
                                        <span className="font-sans text-stone-400 text-[13px]">MRP : <span className="line-through">₹ {displayMp.toLocaleString()}</span></span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-sans font-bold text-[#252422] text-[18px]">Price:</span>
                                            <span className="font-sans font-bold text-[#252422] text-[24px]">₹ {displaySp.toLocaleString()}</span>
                                            <span className="text-emerald-500 font-bold text-[14px]">{savePct}% off</span>
                                            <div className="flex items-center gap-1 ml-2 text-stone-500 font-sans text-[12px]">
                                                <span>Get {Math.round(displaySp * 0.02)} HK Cash</span>
                                                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-white font-bold">₹</div>
                                            </div>
                                        </div>
                                        <div className="text-[11px] text-stone-400 font-sans font-medium">Inclusive of all taxes</div>
                                    </div>

                                </div>

                                <div className="p-5 border-b border-stone-100">
                                    <div className="flex items-end justify-between gap-6 mb-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-1">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                Secure Checkout
                                            </div>
                                            <div className="flex items-center gap-4 bg-stone-50/80 px-4 h-14 rounded-xl border border-stone-100 shadow-sm">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 w-auto" alt="Mastercard" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 w-auto" alt="Visa" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 w-auto" alt="PayPal" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" className="h-4 w-auto" alt="GPay" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" className="h-5 w-auto rounded-[1px]" alt="Amex" />
                                            </div>
                                        </div>
                                        <button className="flex-1 h-14 bg-[#fb923c] text-white rounded-xl font-sans font-bold text-[16px] hover:bg-[#f97316] transition-all shadow-lg shadow-orange-200/50 flex items-center justify-center tracking-wide group">
                                            Buy Now
                                            <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100">
                                                    <Truck className="w-4 h-4 text-stone-400" />
                                                </div>
                                                <span className="font-sans font-bold text-[14px] text-stone-700">Select Variant</span>
                                            </div>
                                            <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-100 uppercase tracking-wider">
                                                In Stock
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {[
                                                { qty: 1, label: "1 Pack", sp: product.singleProductSp ?? product.sp },
                                                { qty: 2, label: "2 Packs", sp: product.twoProductSp },
                                                { qty: 3, label: "3 Packs", sp: product.threeProductSp },
                                            ].filter(b => b.sp && b.sp > 0).map((b) => {
                                                const isActive = bundleQty === b.qty;
                                                return (
                                                    <button
                                                        key={b.qty}
                                                        onClick={() => setBundleQty(b.qty as 1 | 2 | 3)}
                                                        className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200 text-center gap-1.5 ${isActive ? "border-brand-primary bg-emerald-50/20" : "border-stone-100 bg-white hover:border-stone-200"}`}
                                                    >
                                                        <span className={`font-sans font-bold text-[13px] ${isActive ? "text-[#2A401E]" : "text-stone-700"}`}>{b.label}</span>
                                                        <span className="font-sans text-[11px] text-stone-400">₹ {(b.sp as number).toLocaleString()}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HOW TO USE SECTION */}
                    {howToUse.length > 0 && (
                        <div className="px-6 lg:px-12 pt-16 pb-16 lg:pb-20">
                            <div className="p-0">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/3">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                                        <RotateCcw className="w-6 h-6 text-brand-primary" />
                                    </div>
                                    <div>
                                        <span className="font-sans text-[11px] text-stone-400 uppercase tracking-[0.3em] block mb-1">Guidance</span>
                                        <h2 className="font-sans text-[#2A401E] text-3xl font-bold">How to Use</h2>
                                    </div>
                                </div>
                                <p className="font-sans text-stone-600 text-[14px] leading-[1.9]">
                                    Our experts recommend following these clear steps to ensure maximum efficacy and best results from this formula.
                                </p>
                            </div>

                            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8 lg:gap-12">
                                <div className="space-y-6">
                                    {howToUse.map((step, idx) => (
                                        <div key={idx} className="flex gap-5 group">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-sans text-[14px] text-[#2A401E] font-bold group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all shadow-sm">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <p className="font-sans text-stone-600 text-[14px] leading-[1.9] pt-0.5">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white rounded-3xl p-8 border border-stone-200/60 flex flex-col justify-center relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <FlaskConical className="w-24 h-24 text-brand-primary" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <ShieldCheck className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <span className="font-sans text-[#2A401E] text-lg font-bold">Pro Tip</span>
                                    </div>
                                    <p className="font-sans text-stone-600 text-[14px] leading-[1.9] relative z-10 font-medium italic">
                                        "To achieve the most significant benefits, maintain a consistent routine. Most users report better results after 2-3 weeks of regular use."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DETAILS SECTION — full width below hero ── */}
            <div className="border-t border-stone-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-10 space-y-8">

                    {/* Description */}
                    {product.description && (
                        <div className="grid lg:grid-cols-[200px_1fr] gap-6 items-start">
                            <div className="pt-1">
                                <span className="font-sans text-[9px] text-stone-400 uppercase tracking-[0.28em] block mb-1">About</span>
                                <h2 className="font-heading text-[#2A401E] text-xl leading-tight">Product Description</h2>
                            </div>
                            <p className="font-sans text-stone-500 text-[14px] leading-[1.9] border-l border-stone-100 pl-6">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Divider */}
                    {product.description && (benefits.length > 0 || facts.length > 0) && (
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-stone-100" />
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                            <div className="flex-1 h-px bg-stone-100" />
                        </div>
                    )}

                    {/* Benefits + Supplement Facts side by side */}
                    {(benefits.length > 0 || facts.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Key Ingredients */}
                            {benefits.length > 0 && (
                                <div className="border border-stone-100 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-stone-100 bg-[#FAFAF9]">
                                        <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.28em] block mb-1">Formula</span>
                                        <h2 className="font-heading text-[#2A401E] text-xl">Key Ingredients</h2>
                                    </div>
                                    <div className="divide-y divide-stone-100">
                                        {benefits.map((b, i) => (
                                            <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-[#FAFAF8] transition-colors">
                                                <span className="font-sans text-[10px] text-stone-300 w-5 shrink-0 mt-0.5 tabular-nums">{String(i + 1).padStart(2, "00")}</span>
                                                <div className="min-w-0">
                                                    <p className="font-heading text-[#2A401E] text-[16px] leading-snug mb-0.5">{b.nutrientName}</p>
                                                    <p className="font-sans text-stone-400 text-[13px] leading-relaxed">{b.benefitDescription}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Supplement Facts */}
                            {facts.length > 0 && (
                                <div className="border border-stone-100 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-stone-100 bg-[#FAFAF9]">
                                        <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.28em] block mb-1">Nutrition</span>
                                        <h2 className="font-heading text-[#2A401E] text-xl">Supplement Facts</h2>
                                    </div>
                                    {(product.servingSize || product.capsulesPerContainer) && (
                                        <div className="px-6 py-3 border-b border-stone-100 flex gap-6">
                                            {product.servingSize && (
                                                <div>
                                                    <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.2em] block">Serving</span>
                                                    <span className="font-heading text-[#2A401E] text-[14px]">{product.servingSize}</span>
                                                </div>
                                            )}
                                            {product.capsulesPerContainer && (
                                                <div>
                                                    <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.2em] block">Per Container</span>
                                                    <span className="font-heading text-[#2A401E] text-[14px]">{product.capsulesPerContainer}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex px-6 py-2 border-b border-stone-100">
                                        <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.2em] flex-1">Nutrient</span>
                                        <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.2em] w-24 text-right">Amount</span>
                                        <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.2em] w-10 text-right">% DV</span>
                                    </div>
                                    <div className="divide-y divide-stone-100">
                                        {facts.map((f, i) => (
                                            <div key={i} className="flex items-center px-6 py-3 hover:bg-[#FAFAF8] transition-colors">
                                                <span className="font-heading text-[#2A401E] text-[15px] flex-1">{f.nutrientName}</span>
                                                <span className="font-sans text-stone-400 text-[13px] w-24 text-right">{f.amountPerServing}</span>
                                                <span className="font-sans text-stone-500 text-[13px] w-10 text-right">{f.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="px-6 py-2.5 font-sans text-[10px] text-stone-300 border-t border-stone-100">
                                        * % DV not established.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ──── REVIEWS SECTION ──── */}
                    {reviews.length > 0 && (
                        <div className="pt-24 border-t border-stone-100">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                                <div>
                                    <span className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-[0.3em] block mb-3">Community Feedback</span>
                                    <h2 className="font-heading text-[#2A401E] text-4xl font-semibold tracking-tight">Verified Reviews</h2>
                                </div>
                                <div className="text-center sm:text-right">
                                    <div className="flex items-center gap-2 justify-center sm:justify-end mb-1">
                                        <span className="font-heading text-[#2A401E] text-3xl font-bold">{avgRating.toFixed(1)}</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} strokeWidth={0} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? "fill-[#F5A623]" : "fill-stone-100"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="font-sans text-stone-400 text-xs font-medium">Based on {reviews.length} actual experiences</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {reviews.map((r, i) => (
                                    <div key={i} className="group flex flex-col h-full bg-white p-8 rounded-[2rem] border border-stone-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:border-emerald-100/50 transition-all duration-500">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-11 h-11 rounded-2xl bg-stone-50 flex items-center justify-center font-heading text-[#2A401E] font-bold text-base border border-stone-100">
                                                {r.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5 leading-none mb-1">
                                                    <span className="font-heading text-[#2A401E] font-bold text-base tracking-tight">{r.username}</span>
                                                    <div className="w-3.5 h-3.5 rounded-full bg-brand-accent flex items-center justify-center">
                                                        <Check className="w-2 h-2 text-white" strokeWidth={5} />
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, si) => (
                                                        <Star key={si} strokeWidth={0} className={`w-2.5 h-2.5 ${si < r.stars ? "fill-[#F5A623]" : "fill-stone-100"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-sans text-stone-500 text-[15px] leading-relaxed mb-6 flex-1 italic">
                                            "{r.comment}"
                                        </p>
                                        <span className="font-sans text-[10px] text-stone-300 font-black uppercase tracking-widest block pt-4 border-t border-stone-50">Verified Product</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ──── FAQ SECTION (Apple Style) ──── */}
                    {product.faqs && product.faqs.length > 0 && (
                        <div className="pt-32 max-w-4xl mx-auto px-4">
                            <h2 className="font-heading text-black text-[32px] font-bold mb-10 tracking-tight">
                                Frequently Asked Questions
                            </h2>

                            <div className="border-t border-stone-200">
                                {product.faqs.map((faq, i) => (
                                    <details key={i} className="group border-b border-stone-200">
                                        <summary className="flex items-center justify-between py-6 cursor-pointer list-none appearance-none [&::-webkit-details-marker]:hidden">
                                            <h3 className="font-sans text-[#1d1d1f] text-[17px] font-semibold leading-tight pr-8">
                                                {faq.question}
                                            </h3>
                                            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                                                <ChevronDown className="w-5 h-5 text-stone-400 transition-transform duration-300 group-open:rotate-180" />
                                            </div>
                                        </summary>
                                        <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <p className="font-sans text-[#424245] text-[17px] leading-relaxed max-w-3xl">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── RELATED FORMULAS ─────────────────────── */}
            {related.length > 0 && (
                <div className="bg-white border-t border-stone-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="font-heading font-semibold text-[10px] text-brand-primary uppercase tracking-[0.28em] block mb-2">Architectural Synergy</span>
                                <h2 className="font-heading font-semibold text-[#2A401E] text-4xl tracking-tight">Related Products</h2>
                            </div>
                            <Link href="/products" className="hidden sm:block font-sans text-sm font-semibold text-stone-400 hover:text-brand-primary transition-colors underline-offset-4 hover:underline">
                                View all →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {related.map(p => {
                                const relCat = typeof p.category === "string" ? p.category : p.category?.name;
                                const relMp = p.mp ?? p.singleProductMp ?? 0;
                                const relSp = p.sp ?? p.singleProductSp ?? 0;
                                const relSave = relMp > relSp ? Math.round(((relMp - relSp) / relMp) * 100) : 0;
                                return (
                                    <Link key={p.id} href={`/products/${p.id}`} className="group bg-[#f6f6f8] border border-transparent hover:border-stone-200 hover:shadow-lg rounded-md overflow-hidden flex flex-col transition-all cursor-pointer">
                                        {/* Card image */}
                                        <div className="relative bg-transparent aspect-square flex items-center justify-center mb-5 overflow-hidden">
                                            {relSave > 0 && (
                                                <div className="absolute top-0 left-0 bg-[#b91c1c] text-white font-sans text-[11px] font-bold px-3 pt-1.5 pb-1 uppercase tracking-wider z-10">
                                                    SALE
                                                </div>
                                            )}
                                            <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#522c83] hover:text-[#b91c1c] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10" onClick={(e) => { e.preventDefault(); }}>
                                                <Heart className="w-4 h-4" />
                                            </button>

                                            <div className="relative w-full h-full">
                                                <img
                                                    src={getProductMainImage(p)}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover mix-blend-multiply drop-shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div className="flex flex-col flex-1 px-4 pb-4 text-left">
                                            <h3 className="font-sans text-[#166534] text-[16px] leading-snug mb-1 group-hover:underline decoration-[#166534]/30 transition-all font-medium">
                                                {p.name}
                                            </h3>

                                            <span className="font-sans text-[13px] text-stone-600 mb-3 block uppercase tracking-wide">
                                                {typeof p.category === "string" ? p.category : p.category?.name ?? "Supplement"}
                                            </span>

                                            <div className="mt-auto pt-2">
                                                {/* Stars */}
                                                {(() => {
                                                    const relReviews = p.reviews ?? [];
                                                    const relAvg = relReviews.length ? +(relReviews.reduce((a, r) => a + r.stars, 0) / relReviews.length).toFixed(1) : 4.5;
                                                    const reviewCount = relReviews.length > 0 ? relReviews.length : 43;
                                                    return (
                                                        <div className="flex items-center gap-1 mb-3">
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(relAvg) ? "fill-[#F5A623] text-[#F5A623]" : "text-stone-300 fill-stone-300"}`} />
                                                                ))}
                                                            </div>
                                                            <span className="font-sans text-stone-500 text-[12px] ml-1">{relAvg.toFixed(1)} ({reviewCount})</span>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Price Row */}
                                                <div className="mb-4">
                                                    {relMp > relSp && (
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <span className="font-sans text-stone-500 text-[11px] uppercase">MRP :</span>
                                                            <span className="font-sans text-stone-400 text-[11px] line-through decoration-stone-300">
                                                                ₹ {relMp.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="font-sans font-bold text-[#252422] text-[14px]">Price:</span>
                                                        <span className="font-sans font-bold text-[#252422] text-[18px]">
                                                            ₹ {relSp.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-brand-primary font-medium mt-0.5">
                                                        Inclusive of all taxes
                                                    </div>
                                                </div>

                                                <span className="w-full block text-center bg-[#fb923c] hover:bg-[#f97316] text-white font-sans font-medium text-[15px] py-2.5 transition-colors rounded-sm shadow-sm cursor-pointer">
                                                    Buy Now
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Page Wrapper ─────────────────────────────── */
export default function ProductDetailPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F3] selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#FAF8F3]">
                    <div className="w-10 h-10 border-[3px] border-emerald-100 border-t-brand-primary rounded-full animate-spin" />
                </div>
            }>
                <ProductDetailContent />
            </Suspense>
            <Footer />
        </div>
    );
}
