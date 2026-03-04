"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { productApi, Product, formatBase64Image, getProductAllImages, getProductMainImage } from "@/lib/api";
import {
    ShoppingCart, Star, ChevronRight, Truck, ShieldCheck,
    RotateCcw, Plus, Minus, Check,
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
                        className={`${sz} ${i < Math.round(rating) ? "fill-amber-400" : "fill-stone-200"}`} />
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

    useEffect(() => {
        (async () => {
            try {
                const id = parseInt(params.id as string);
                if (!isNaN(id)) {
                    const [data, all] = await Promise.all([productApi.getById(id), productApi.getAll()]);
                    if (data && !Array.isArray(data)) {
                        setProduct(data);
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
            <div className="w-10 h-10 border-[3px] border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-48 bg-[#FAF8F3]">
            <h1 className="font-heading text-5xl font-semibold text-[#2A401E] mb-4">Not Found</h1>
            <Link href="/products" className="mt-2 px-8 py-3.5 bg-emerald-600 text-white rounded-full font-heading font-medium hover:bg-emerald-700 transition-colors">
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
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 h-11 flex items-center">
                    <nav className="flex items-center gap-2 text-[13px] text-stone-400 font-sans font-medium">
                        <Link href="/" className="hover:text-[#2A401E] transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        <Link href="/products" className="hover:text-[#2A401E] transition-colors">Products</Link>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        <span className="text-[#2A401E] font-semibold truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* ── HERO ─────────────────── */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-10 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-12 items-stretch">
                    {/* LEFT COLUMN: Gallery & Extra Content */}
                    <div className="w-full lg:flex-1 flex flex-col gap-10 min-w-0">
                        <div className="lg:h-[700px]">
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
                                                    className={`relative w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110 ${isActive ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Main Hero Image */}
                                <div className="relative flex-1 aspect-square lg:aspect-auto h-full bg-stone-50 rounded-[2rem] overflow-hidden border border-stone-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group flex items-center justify-center p-8 lg:p-12 cursor-crosshair">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF8F3] via-white to-[#F2F5F0]"></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(42,64,30,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(42,64,30,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

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

                                    <div className="relative w-full h-full flex items-center justify-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.12]">
                                        <img
                                            src={img}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(42,64,30,0.12)] md:drop-shadow-[0_40px_70px_rgba(42,64,30,0.15)] mix-blend-multiply"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How to Use Section */}
                        {howToUse.length > 0 && (
                            <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <RotateCcw className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.2em] block mb-0.5">Application</span>
                                        <h2 className="font-heading text-[#2A401E] text-2xl font-semibold">How to Use</h2>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        {howToUse.map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-heading text-[12px] text-stone-500 font-bold">
                                                    {idx + 1}
                                                </div>
                                                <p className="font-sans text-stone-600 text-[15px] leading-relaxed pt-0.5">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-[#FAF8F3]/50 rounded-2xl p-6 border border-stone-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <span className="font-heading text-[#2A401E] font-medium">Expert Recommendation</span>
                                        </div>
                                        <p className="font-sans text-stone-500 text-[13px] italic leading-relaxed">
                                            Consistency is key. Follow the product usage regularly for best results.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Buy Panel */}
                    <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0">
                        <div className="lg:sticky lg:top-6 space-y-4">
                            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                                <div className="p-6 pb-5 border-b border-stone-100">
                                    <span className="font-sans text-[9px] text-emerald-700 uppercase tracking-[0.28em] block mb-2">{cat}</span>
                                    <h1 className="font-heading text-[#2A401E] text-[1.85rem] leading-[1.1] tracking-tight mb-3">
                                        {product.name}
                                    </h1>
                                    {reviews.length > 0 && (
                                        <StarRating rating={avgRating} count={reviews.length} />
                                    )}
                                </div>

                                <div className="px-6 pt-5 pb-4 border-b border-stone-100">
                                    <div className="flex items-end gap-4 mb-2">
                                        <div>
                                            <span className="font-sans text-[9px] text-stone-400 uppercase tracking-[0.3em] block mb-0.5">NPR</span>
                                            <span className="font-heading text-[#2A401E] text-[2.6rem] leading-none tracking-tight">
                                                {displaySp.toLocaleString()}
                                            </span>
                                        </div>
                                        {displayMp > displaySp && (
                                            <div className="mb-1">
                                                <span className="font-sans text-stone-300 text-base line-through">
                                                    {displayMp.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {savePct > 0 && (
                                        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-sans text-[11px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full">
                                            Save {savePct}%
                                        </span>
                                    )}
                                </div>

                                {/* Bundle selection */}
                                <div className="p-6 border-b border-stone-100 bg-gradient-to-b from-[#FAF8F3]/60 to-[#FAF8F3]/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-heading font-bold text-[#2A401E] text-[15px] uppercase tracking-wider">Select Supply</h3>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { qty: 1, label: "1 Pack", sub: "1 Month Supply", key: "singleProductImage", sp: product.singleProductSp ?? product.sp, mp: product.singleProductMp ?? product.mp },
                                            { qty: 2, label: "2 Packs", sub: "2 Month Supply", key: "twoProductImage", sp: product.twoProductSp ?? (product.singleProductSp ?? product.sp) * 2, mp: product.twoProductMp ?? (product.singleProductMp ?? product.mp) * 2 },
                                            { qty: 3, label: "3 Packs", sub: "3 Month Supply", key: "threeProductImage", sp: product.threeProductSp ?? (product.singleProductSp ?? product.sp) * 3, mp: product.threeProductMp ?? (product.singleProductMp ?? product.mp) * 3 },
                                        ].map((b) => {
                                            const rawSrc = (product as any)[b.key];
                                            let imgSrc = rawSrc && rawSrc.trim() !== "" ? formatBase64Image(rawSrc) : formatBase64Image(product.images?.[0] || "");
                                            const isActive = bundleQty === b.qty;
                                            const bSavePct = b.mp > b.sp ? Math.round(((b.mp - b.sp) / b.mp) * 100) : 0;

                                            return (
                                                <button
                                                    key={b.qty}
                                                    onClick={() => {
                                                        setBundleQty(b.qty as 1 | 2 | 3);
                                                        setSelectedImg(imgSrc);
                                                    }}
                                                    className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border-2 text-left w-full group ${isActive ? "border-emerald-600 bg-emerald-50/40" : "border-stone-100 bg-white hover:border-stone-200"}`}
                                                >
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className={`w-5 h-5 rounded-full border flex shrink-0 items-center justify-center ${isActive ? "border-emerald-600" : "border-stone-300"}`}>
                                                            {isActive && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
                                                        </div>
                                                        <img src={imgSrc} alt={b.label} className="w-12 h-12 object-contain mix-blend-multiply bg-[#FAF8F3] rounded p-1" />
                                                        <div>
                                                            <span className={`font-inter font-medium block ${isActive ? "text-[#2A401E]" : "text-stone-700"}`}>{b.label}</span>
                                                            <span className="font-sans text-[11px] text-stone-500">{b.sub}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end">
                                                        <span className="font-inter font-medium text-[#2A401E]">Rs. {b.sp.toLocaleString()}</span>
                                                        {bSavePct > 0 && <span className="font-sans text-[11px] text-emerald-600 font-bold uppercase">Save {bSavePct}%</span>}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Shop Now */}
                                <div className="px-6 py-5 border-b border-stone-100 space-y-3">
                                    <a
                                        href={(() => {
                                            if (!product.link || product.link === "#" || product.link === "") return "#";
                                            return product.link.startsWith("http") ? product.link : `https://${product.link}`;
                                        })()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-heading font-bold text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.97]"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Shop Now</span>
                                        <ExternalLink className="w-4 h-4 opacity-50" />
                                    </a>
                                    <div className="flex items-center justify-center gap-2 pt-2.5 opacity-60">
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto"><rect width="32" height="20" rx="3" fill="#1A1F71" /><text x="4" y="13.5" fill="#fff" fontFamily="Arial" fontWeight="900" fontSize="8" fontStyle="italic">VISA</text></svg>
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto"><rect width="32" height="20" rx="3" fill="#1C1C1C" /><circle cx="12" cy="10" r="5" fill="#EB001B" /><circle cx="20" cy="10" r="5" fill="#F79E1B" opacity="0.9" /></svg>
                                    </div>
                                </div>

                                {/* Trust Tiles */}
                                <div className="px-6 py-4 border-t border-stone-100">
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { icon: ShieldCheck, label: "Lab Tested" },
                                            { icon: FlaskConical, label: "Pure Formula" },
                                            { icon: Award, label: "Premium" },
                                        ].map(({ icon: Icon, label }) => (
                                            <div key={label} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-[#FAF8F3] border border-stone-100">
                                                <Icon className="w-4 h-4 text-[#2A401E]" strokeWidth={1.5} />
                                                <span className="font-sans text-[9px] text-[#2A401E] uppercase tracking-wide text-center">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── DETAILS ── */}
            <div className="border-t border-stone-200 bg-white">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-16 space-y-12">
                    {/* Description */}
                    {product.description && (
                        <div className="grid lg:grid-cols-[200px_1fr] gap-6 items-start">
                            <div>
                                <span className="font-sans text-[10px] text-stone-400 uppercase tracking-[0.25em] block mb-1">Overview</span>
                                <h2 className="font-heading text-[#2A401E] text-2xl font-bold">The Product</h2>
                            </div>
                            <p className="font-sans text-stone-500 text-lg leading-relaxed border-l-2 border-stone-50 pl-8">
                                {product.description}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-4 py-8">
                        <div className="flex-1 h-px bg-stone-100" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="flex-1 h-px bg-stone-100" />
                    </div>

                    {/* Ingredients & Facts */}
                    <div className="grid md:grid-cols-2 gap-12">
                        {benefits.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="font-heading text-[#2A401E] text-2xl font-bold">Key Ingredients</h3>
                                <div className="space-y-4">
                                    {benefits.map((b, i) => (
                                        <div key={i} className="group p-5 bg-[#FAF8F3]/50 rounded-2xl border border-stone-100 hover:border-emerald-100 transition-colors">
                                            <p className="font-heading text-[#2A401E] font-bold text-lg mb-1">{b.nutrientName}</p>
                                            <p className="font-sans text-stone-500 text-sm">{b.benefitDescription}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {facts.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="font-heading text-[#2A401E] text-2xl font-bold">Supplement Facts</h3>
                                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                                    <div className="bg-stone-50 px-6 py-4 flex justify-between border-b border-stone-200">
                                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-stone-400">Nutrient</span>
                                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-stone-400">Amount</span>
                                    </div>
                                    <div className="divide-y divide-stone-100">
                                        {facts.map((f, i) => (
                                            <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-stone-50/50 transition-colors">
                                                <span className="font-heading text-[#2A401E] font-semibold">{f.nutrientName}</span>
                                                <div className="text-right">
                                                    <p className="font-sans text-stone-800 font-bold">{f.amount}</p>
                                                    <p className="font-sans text-stone-400 text-[10px]">Per Serving</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ──── REVIEWS SECTION ──── */}
                    {reviews.length > 0 && (
                        <div className="pt-24 border-t border-stone-100">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                                <div>
                                    <span className="font-sans text-[11px] font-bold text-emerald-600 uppercase tracking-[0.3em] block mb-3">Community Feedback</span>
                                    <h2 className="font-heading text-[#2A401E] text-4xl font-semibold tracking-tight">Verified Reviews</h2>
                                </div>
                                <div className="text-center sm:text-right">
                                    <div className="flex items-center gap-2 justify-center sm:justify-end mb-1">
                                        <span className="font-heading text-[#2A401E] text-3xl font-bold">{avgRating.toFixed(1)}</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} strokeWidth={0} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? "fill-amber-400" : "fill-stone-100"}`} />
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
                                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                        <Check className="w-2 h-2 text-white" strokeWidth={5} />
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, si) => (
                                                        <Star key={si} strokeWidth={0} className={`w-2.5 h-2.5 ${si < r.stars ? "fill-amber-400" : "fill-stone-100"}`} />
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
                    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-16">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="font-heading font-semibold text-[10px] text-emerald-600 uppercase tracking-[0.28em] block mb-2">Architectural Synergy</span>
                                <h2 className="font-heading font-semibold text-[#2A401E] text-4xl tracking-tight">Related Products</h2>
                            </div>
                            <Link href="/products" className="hidden sm:block font-sans text-sm font-semibold text-stone-400 hover:text-emerald-600 transition-colors underline-offset-4 hover:underline">
                                View all →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
                            {related.map(p => {
                                const relCat = typeof p.category === "string" ? p.category : p.category?.name;
                                const relMp = p.mp ?? p.singleProductMp ?? 0;
                                const relSp = p.sp ?? p.singleProductSp ?? 0;
                                const relSave = relMp > relSp ? Math.round(((relMp - relSp) / relMp) * 100) : 0;
                                return (
                                    <Link key={p.id} href={`/products/${p.id}`} className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all">
                                        {/* Card image */}
                                        <div className="relative bg-[#FAF8F3] aspect-square flex items-center justify-center p-8">
                                            {relSave > 0 && (
                                                <div className="absolute top-3 left-3 bg-emerald-500 text-white font-heading font-semibold text-[10px] px-2.5 py-1 rounded-full uppercase">
                                                    -{relSave}%
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 bg-white/80 text-stone-500 font-heading font-semibold text-[10px] px-2 py-1 rounded-full uppercase tracking-wide border border-stone-100">
                                                {relCat}
                                            </div>
                                            <img
                                                src={getProductMainImage(p)}
                                                alt={p.name}
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.06] transition-transform duration-500"
                                            />
                                        </div>
                                        {/* Card body */}
                                        <div className="p-5">
                                            {/* Stars — only from real backend reviews */}
                                            {(() => {
                                                const relReviews = p.reviews ?? [];
                                                if (!relReviews.length) return null;
                                                const relAvg = +(relReviews.reduce((a, r) => a + r.stars, 0) / relReviews.length).toFixed(1);
                                                return (
                                                    <div className="flex items-center gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} strokeWidth={0} className={`w-3 h-3 ${i < Math.round(relAvg) ? "fill-amber-400" : "fill-stone-200"}`} />
                                                        ))}
                                                        <span className="font-sans text-stone-400 text-xs ml-1">({relReviews.length})</span>
                                                    </div>
                                                );
                                            })()}
                                            <h3 className="font-heading font-semibold text-[#2A401E] text-[1rem] leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                                                {p.name}
                                            </h3>
                                            <span className="font-heading font-semibold text-[10px] text-emerald-600 uppercase tracking-widest block mb-3">
                                                {relCat}
                                            </span>
                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-heading font-semibold text-[#2A401E] text-lg">NPR {relSp.toLocaleString()}</span>
                                                    {relMp > relSp && (
                                                        <span className="font-sans text-stone-400 text-sm line-through">NPR {relMp.toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[10px] uppercase tracking-wide px-3.5 py-2 rounded-full transition-colors shadow-sm">
                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                    Buy
                                                </button>
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
                    <div className="w-10 h-10 border-[3px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                </div>
            }>
                <ProductDetailContent />
            </Suspense>
            <PreFooter />
            <Footer />
        </div>
    );
}
