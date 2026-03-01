import React from "react";

const SvgArrowRight = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M4 12H20M20 12L13 5M20 12L13 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const SvgPill = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="6" transform="rotate(-45 12 12)" strokeWidth="1" />
        <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" strokeWidth="1" strokeLinecap="round" />
    </svg>
)

const SvgHexagon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" strokeWidth="1" />
    </svg>
)

const SvgDrop = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M12 21.5C16.6944 21.5 20.5 17.6944 20.5 13C20.5 10.5 17.5 7.5 12 2.5C6.5 7.5 3.5 10.5 3.5 13C3.5 17.6944 7.30558 21.5 12 21.5Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const SvgDNA = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M4 4C4 4 9 5 12 12C15 19 20 20 20 20" strokeWidth="1" strokeLinecap="round" />
        <path d="M20 4C20 4 15 5 12 12C9 19 4 20 4 20" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="8" x2="16" y2="8" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="16" x2="16" y2="16" strokeWidth="1" strokeLinecap="round" />
        <line x1="11" y1="12" x2="13" y2="12" strokeWidth="1" strokeLinecap="round" />
    </svg>
)

export function Categories() {
    const categories = [
        { id: "01", name: "Vitamins & Minerals", desc: "Foundational micronutrients engineered for maximum bioavailability and absorption.", icon: SvgPill },
        { id: "02", name: "Proteins & Powders", desc: "Ultra-filtered isolates optimized for immediate muscle repair and synthesis.", icon: SvgHexagon },
        { id: "03", name: "Omegas & Oils", desc: "Cold-pressed, heavy-metal free lipids tailored for cognitive supremacy.", icon: SvgDrop },
        { id: "04", name: "Performance Energy", desc: "Cellular ATP activators. Zero jitters, just clean, sustained kinetic output.", icon: SvgDNA },
    ];

    return (
        <section className="py-16 bg-white font-sans relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Impeccably Clean Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#1D3557] font-heading leading-[1.1] mb-6">
                            Engineered for <br /> <span className="text-[#34A0A4] italic font-light">Specific Outcomes.</span>
                        </h2>
                        <p className="text-[#1D3557]/60 font-sans text-lg font-light max-w-xl leading-relaxed">
                            We discard broad-spectrum guesses. Every product category is mathematically formulated to target a precise biological mechanism.
                        </p>
                    </div>
                </div>

                {/* Tesla / Apple Architectural Blueprint Grid */}
                <div className="border-t border-l border-[#1D3557]/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {categories.map((cat, index) => (
                        <div key={index} className="border-r border-b border-[#1D3557]/10 p-10 lg:p-12 xl:p-14 group cursor-pointer hover:bg-[#F1FAEE]/60 transition-colors duration-500 relative flex flex-col h-full min-h-[420px]">

                            {/* Number & Arrow Header */}
                            <div className="flex justify-between items-start mb-16">
                                <span className="text-sm font-bold font-number text-[#1D3557]/30 group-hover:text-[#34A0A4] transition-colors duration-500 tracking-widest">
                                    {cat.id} //
                                </span>
                                <div className="w-12 h-12 rounded-full border border-[#1D3557]/10 flex items-center justify-center text-[#1D3557]/30 group-hover:bg-[#34A0A4] group-hover:border-[#34A0A4] group-hover:text-white transition-all duration-500 transform group-hover:-rotate-45 shadow-sm">
                                    <SvgArrowRight className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="mt-auto">
                                {/* Precision Icon */}
                                <div className="text-[#1D3557]/40 group-hover:text-[#34A0A4] transition-colors duration-500 mb-8 transform group-hover:scale-110 group-hover:-translate-y-2 origin-left">
                                    <cat.icon className="w-14 h-14" />
                                </div>

                                {/* Typography */}
                                <h3 className="text-2xl lg:text-3xl font-medium text-[#1D3557] font-heading tracking-tight mb-4 leading-tight">
                                    {cat.name}
                                </h3>
                                <p className="text-[#1D3557]/60 font-light font-sans text-sm leading-relaxed group-hover:text-[#1D3557]/80 transition-colors duration-500">
                                    {cat.desc}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
