import React from "react";

export function PreFooter() {
    return (
        <section className="py-24 bg-white border-t border-[#1D3557]/5 font-sans relative overflow-hidden">

            {/* Soft ambient background glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F1FAEE] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <span className="inline-block text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] font-heading mb-6">
                    Embrace the Future
                </span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1D3557] font-heading tracking-tight mb-8 leading-tight">
                    Start Your Optimization <br />
                    <span className="italic font-light text-emerald-600">Journey Today.</span>
                </h2>

                <p className="text-[#1D3557]/60 font-light text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of high-performers who trust NutriCore for their cellular nutrition. Precision-engineered formulas backed by absolute transparency.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button className="px-10 py-4 bg-emerald-600 text-white rounded-full font-sans font-medium text-sm hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        Shop Collection
                    </button>
                    <button className="px-10 py-4 bg-transparent text-[#1D3557] border border-[#1D3557]/20 rounded-full font-sans font-medium text-sm hover:border-emerald-600 hover:text-emerald-700 shadow-sm hover:shadow-md transition-all duration-300">
                        Read Our Manifesto
                    </button>
                </div>
            </div>

        </section>
    );
}
