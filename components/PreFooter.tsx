import React from "react";
import Link from "next/link";

export function PreFooter() {
    return (
        <section className="bg-[#f2f3f5] font-sans relative overflow-hidden border-t border-stone-200">
            {/* Background Texture/Grain */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[400px]">

                {/* Responsive Layout Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full items-center gap-0 lg:gap-12 relative z-10">

                    {/* Left Image (Hand with bottle - Minimalist ritual) */}
                    <div className="hidden lg:flex items-center justify-center relative h-full">
                        {/* Soft Mint Circle behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100/40 rounded-full blur-[60px] pointer-events-none"></div>
                        <img
                            src="/supplement_ritual_left.png"
                            alt="Wellness ritual"
                            className="w-[85%] h-auto object-contain mix-blend-multiply select-none opacity-90"
                        />
                    </div>

                    {/* Center Content Section */}
                    <div className="text-center py-12 px-4 flex flex-col items-center">
                        <h2 className="text-[#333333] text-[28px] sm:text-[36px] md:text-[44px] font-semibold leading-[1.15] mb-5 tracking-tight font-serif italic md:not-italic">
                            Empower Your <br />
                            Daily Ritual
                        </h2>

                        <p className="text-[#555555] text-[15px] sm:text-[17px] md:text-[18px] font-normal mb-10 max-w-[420px] leading-relaxed opacity-95">
                            Experience the synergy of high-purity ingredients formulated for maximum bioavailability and long-term vitality.
                        </p>

                        <Link
                            href="/products"
                            className="inline-block px-12 py-3.5 bg-[#1b3a32] text-white font-bold text-[13px] uppercase tracking-widest rounded-sm hover:bg-black hover:shadow-lg active:scale-[0.98] transition-all duration-300"
                        >
                            Explore now
                        </Link>
                    </div>

                    {/* Right Image (Hand with bottle - Premium feel) */}
                    <div className="hidden lg:flex items-center justify-center relative h-full">
                        {/* Soft Mint Circle behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100/40 rounded-full blur-[60px] pointer-events-none"></div>
                        <img
                            src="/supplement_ritual_right.png"
                            alt="Premium vitamins"
                            className="w-[85%] h-auto object-contain mix-blend-multiply select-none opacity-90"
                        />
                    </div>

                    {/* Mobile Images (Alternative Layout for Small Devices) */}
                    <div className="lg:hidden flex justify-center gap-6 mb-10 opacity-30 grayscale filter px-8">
                        <img src="/supplement_ritual_left.png" className="w-[100px] h-auto object-contain mix-blend-multiply" />
                        <img src="/supplement_ritual_right.png" className="w-[100px] h-auto object-contain mix-blend-multiply" />
                    </div>

                </div>
            </div>
        </section>
    );
}
