import Image from "next/image";

const SvgArrowUpRight = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
        <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="7" y1="17" x2="17" y2="7" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
)

export function Products() {
    const products = [
        {
            id: 1,
            name: "Daily Multi-Vitamin",
            desc: "Complete foundational nutrition with advanced absorption.",
            price: "$24.00",
            image: "/multi-vit.png",
            category: "Vitamins"
        },
        {
            id: 2,
            name: "Whey Protein Isolate",
            desc: "Clean, fast-absorbing muscle recovery and maintenance.",
            price: "$59.00",
            image: "/protein.png",
            category: "Proteins"
        },
        {
            id: 3,
            name: "Omega-3 Pure Fish Oil",
            desc: "Optimized heart, joint and cognitive support formula.",
            price: "$34.00",
            image: "/fish-oil.png",
            category: "Omegas"
        }
    ];
    return (
        <section className="pt-12 pb-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
                    <div className="max-w-xl">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#34A0A4] font-heading mb-6">Complete Your Routine</h2>
                        <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1D3557] font-heading leading-tight">
                            Purpose-built formulas for every physiological need.
                        </h3>
                    </div>
                    <button className="hidden md:inline-flex items-center gap-2 pb-1.5 border-b border-[#1D3557]/30 text-[#1D3557] font-sans font-medium hover:text-[#34A0A4] hover:border-[#34A0A4] transition-colors">
                        Shop Entire Collection <SvgArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {products.map((p) => (
                        <div key={p.id} className="group cursor-pointer flex flex-col h-full">
                            <div className="relative aspect-[4/5] bg-[#F1FAEE]/60 rounded-[2rem] overflow-hidden mb-8 flex items-center justify-center p-8 transition-shadow duration-500 hover:shadow-[0_20px_40px_rgba(29,53,87,0.06)] border border-[#1D3557]/5">
                                <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-wider text-[#34A0A4] font-heading z-10">{p.category}</span>
                                <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
                                    <Image src={p.image} fill className="object-contain drop-shadow-xl" alt={p.name} />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3 gap-4">
                                    <h4 className="text-2xl font-medium text-[#1D3557] font-heading tracking-tight leading-tight">{p.name}</h4>
                                    <span className="text-2xl font-medium text-[#1D3557] font-number tracking-tighter shrink-0">{p.price}</span>
                                </div>
                                <p className="text-[#1D3557]/60 font-sans text-sm font-light leading-relaxed mb-8 flex-1">{p.desc}</p>
                                <button className="w-full py-4 rounded-full bg-[#34A0A4] text-white font-medium font-sans text-sm tracking-wide hover:bg-[#1D3557] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
