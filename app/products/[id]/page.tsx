"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { productApi, Product, formatBase64Image, getProductAllImages, getProductMainImage } from "@/lib/api";
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
                                                    className={`relative w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110 ${isActive ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
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

                                    <div className="relative w-full h-full flex items-center justify-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]">
                                        <img
                                            src={img}
                                            alt={product.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
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
                    <div className="w-full lg:w-1/2 shrink-0">
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

                                <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-end gap-3 mb-2">
                                            <div>
                                                <span className="font-sans text-[9px] text-stone-400 uppercase tracking-[0.3em] block mb-0.5">NPR</span>
                                                <span className="font-heading text-[#2A401E] text-[2.6rem] leading-none tracking-tight">
                                                    {displaySp.toLocaleString()}
                                                </span>
                                            </div>
                                            {displayMp > displaySp && (
                                                <div className="mb-1.5">
                                                    <span className="font-sans text-stone-400 font-medium text-[1.2rem] line-through decoration-stone-300 decoration-2">
                                                        {displayMp.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {savePct > 0 && (
                                            <div>
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-sans text-[11px] uppercase tracking-[0.12em] px-3 py-1 rounded-full">
                                                    Save {savePct}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <h3 className="font-heading font-bold text-[#2A401E] text-[15px] uppercase tracking-wider text-right">Select Supply</h3>
                                    </div>
                                </div>

                                {/* Bundle selection */}
                                <div className="p-6 border-b border-stone-100 bg-gradient-to-b from-[#FAF8F3]/60 to-[#FAF8F3]/20">
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
                                        className="w-full bg-[#fbbf24] hover:bg-[#f5b102] text-[#451a03] rounded-xl py-4 font-heading font-bold text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.97]"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Shop Now</span>
                                        <ExternalLink className="w-4 h-4 opacity-70" />
                                    </a>
                                    <div className="flex items-center justify-center gap-2 pt-2.5 opacity-60">
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto drop-shadow-sm"><rect width="32" height="20" rx="3" fill="#1A1F71" /><text x="4" y="13.5" fill="#fff" fontFamily="Arial" fontWeight="900" fontSize="8" fontStyle="italic">VISA</text></svg>
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto drop-shadow-sm"><rect width="32" height="20" rx="3" fill="#1C1C1C" /><circle cx="12" cy="10" r="5" fill="#EB001B" /><circle cx="20" cy="10" r="5" fill="#F79E1B" opacity="0.9" /></svg>
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto drop-shadow-sm"><rect width="32" height="20" rx="3" fill="#016FD0" /><text x="4.5" y="13.5" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="7">AMEX</text></svg>
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto drop-shadow-sm"><rect width="32" height="20" rx="3" fill="#FF8200" /><text x="2" y="13" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="5.5">DISCOVER</text></svg>
                                        <svg viewBox="0 0 32 20" className="w-8 h-auto drop-shadow-sm"><rect width="32" height="20" rx="3" fill="#003087" /><text x="3" y="13.5" fill="#179BD7" fontFamily="Arial" fontWeight="bold" fontSize="7" fontStyle="italic">Pay<tspan fill="#fff">Pal</tspan></text></svg>
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

            {/* ── DETAILS SECTION — full width below hero ── */}
            <div className="border-t border-stone-200 bg-white">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-10 space-y-8">

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
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                                    <span className="font-sans text-[11px] font-bold text-emerald-600 uppercase tracking-[0.3em] block mb-3">Community Feedback</span>
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
                                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
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
                                <span className="font-heading font-semibold text-[10px] text-emerald-600 uppercase tracking-[0.28em] block mb-2">Architectural Synergy</span>
                                <h2 className="font-heading font-semibold text-[#2A401E] text-4xl tracking-tight">Related Products</h2>
                            </div>
                            <Link href="/products" className="hidden sm:block font-sans text-sm font-semibold text-stone-400 hover:text-emerald-600 transition-colors underline-offset-4 hover:underline">
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

                                            <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
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
                                                    <div className="font-sans font-bold text-[#b91c1c] text-[16px] mb-0.5 tracking-tight">
                                                        Rs. {relSp.toLocaleString()}
                                                    </div>
                                                    <div className="h-4">
                                                        {relMp > relSp && (
                                                            <span className="font-sans text-stone-500 text-[12px]">
                                                                Reg. Rs. {relMp.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <span className="w-full block text-center bg-[#fbbf24] hover:bg-[#f5b102] text-[#451a03] font-sans font-medium text-[15px] py-2.5 transition-colors rounded-sm shadow-sm cursor-pointer">
                                                    Add to Cart
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
                    <div className="w-10 h-10 border-[3px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                </div>
            }>
                <ProductDetailContent />
            </Suspense>
            <Footer />
        </div>
    );
}
