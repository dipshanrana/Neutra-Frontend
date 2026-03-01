import Image from "next/image";

const SvgAward = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    <circle cx="12" cy="8" r="3" strokeWidth="1.5" opacity="0.4" />
  </svg>
)

const SvgChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
    <path d="M9 18L15 12L9 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Features() {
  return (
    <section className="py-16 bg-[#F1FAEE] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D3557] text-white text-xs font-bold uppercase tracking-widest font-heading mb-6 shadow-md shadow-[#1D3557]/20">
              <SvgAward className="w-4 h-4 text-[#82C49C]" /> The NutriCore Standard
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-[#1D3557] font-heading leading-[1.05]">
              Engineering a new <br />
              <span className="text-[#34A0A4] italic font-light relative leading-relaxed inline-block mt-2">
                paradigm
                <svg className="absolute w-full h-3 -bottom-0 left-0 text-[#82C49C]/40" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span> in wellness.
            </h2>
          </div>
          <p className="text-xl text-[#1D3557]/80 font-sans font-light leading-relaxed max-w-lg border-l-2 border-[#34A0A4] pl-6 py-2">
            We transcend traditional supplements. Each formulation is an uncompromising synthesis of cutting-edge clinical research and ultra-pure biological inputs—designed to deeply elevate your longevity, clarity, and daily performance.
          </p>
        </div>

        {/* Statistics Strip from Design */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:px-12 md:py-8 mb-16 flex flex-col md:flex-row items-center justify-between shadow-sm group transition-all duration-300 hover:shadow-md">

          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full md:w-auto">
            {/* 15+ Years */}
            <div className="flex items-center gap-5">
              <div className="text-[3.5rem] lg:text-[4.5rem] font-black text-[#1D3557] font-number tracking-tight leading-none flex items-center">
                15<span className="text-[2.5rem] lg:text-[3.5rem] ml-1">+</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1D3557]/50 font-sans mb-1">Years Of</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#34A0A4] font-sans">Research</span>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-16 bg-[#1D3557]/10 mx-2"></div>

            {/* 99% Purity */}
            <div className="flex items-center gap-5">
              <div className="text-[3.5rem] lg:text-[4.5rem] font-black text-[#1D3557] font-number tracking-tight leading-none flex items-center">
                99<span className="text-[2.5rem] lg:text-[3.5rem] text-[#34A0A4] ml-1.5">%</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1D3557]/50 font-sans mb-1">Ingredient</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#34A0A4] font-sans">Purity</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 md:mt-0 w-full md:w-auto flex justify-center md:justify-end">
            <button className="flex items-center gap-4 text-[#1D3557] font-bold font-sans text-sm hover:text-[#34A0A4] transition-colors group/btn">
              Read clinical outcomes
              <div className="w-9 h-9 rounded-full bg-[#e8f6ed] flex items-center justify-center text-[#82C49C] group-hover/btn:bg-[#34A0A4] group-hover/btn:text-white transition-all duration-300">
                <SvgChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>

        </div>

        {/* Hyper-Premium Visual Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[350px]">

          {/* Item 1: Massive Hero Image (Molecule) */}
          <div className="md:col-span-8 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group shadow-[0_20px_60px_rgba(29,53,87,0.08)]">
            <Image
              src="/molecule.png"
              fill
              alt="Clinical Molecule Render"
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557] via-[#1D3557]/40 to-transparent opacity-90 transition-opacity duration-700"></div>

            <div className="absolute inset-x-0 bottom-0 p-10 lg:p-14 flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest font-heading mb-6 w-max">
                <span className="w-2 h-2 rounded-full bg-[#82C49C] animate-pulse"></span> Cellular Optimization
              </div>
              <h3 className="text-4xl lg:text-6xl font-medium text-white font-heading mb-4 tracking-tight leading-tight">
                Clinically Validated <br /> <span className="font-light italic text-[#34A0A4]">Potency</span>
              </h3>
              <p className="text-[#F1FAEE]/80 font-sans font-light leading-relaxed max-w-lg text-lg">
                We engineer formulas based solely on human clinical trials. High-fidelity ingredients matched exactly to the dosages proven to induce physiological change.
              </p>
            </div>
          </div>

          {/* Item 2: Tall Vertical (Capsules) */}
          <div className="md:col-span-4 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group shadow-[0_20px_60px_rgba(29,53,87,0.08)] bg-white">
            <Image
              src="/capsules.png"
              fill
              alt="Pure Capsules"
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-100 transition-opacity duration-700"></div>

            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end">
              <h3 className="text-3xl font-medium text-[#1D3557] font-heading mb-3 tracking-tight leading-tight">Absolute <br /> Purity</h3>
              <p className="text-[#1D3557]/70 font-sans font-light leading-relaxed mb-8">
                Zero excipients. Zero artificial binding agents. 100% active transparent ingredients.
              </p>
              <button className="w-12 h-12 rounded-full bg-[#1D3557] flex items-center justify-center text-white group-hover:bg-[#34A0A4] transition-colors shadow-lg">
                <SvgChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Item 3: Square Image (Lab / Microscope) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-[0_10px_40px_rgba(29,53,87,0.06)] bg-[#1D3557]">
            <Image
              src="/lab.png"
              fill
              alt="Laboratory Microscope"
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1D3557] via-[#1D3557]/80 to-transparent"></div>

            <div className="absolute inset-0 p-8 flex flex-col">
              <h3 className="text-2xl font-medium text-white font-heading tracking-wide mb-2">Third-Party <br /> Tested</h3>
              <p className="text-[#F1FAEE]/70 font-sans font-light text-sm leading-relaxed max-w-[200px]">
                Every batch is rigorously screened for heavy metals and purity metrics.
              </p>
            </div>
          </div>

          {/* Item 4: Square Image (Golden Drop) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-[0_10px_40px_rgba(29,53,87,0.06)] bg-white">
            <Image
              src="/drop.png"
              fill
              alt="Golden Oil Drop"
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>

            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
              <h3 className="text-2xl font-medium text-[#1D3557] font-heading tracking-wide mb-2">Max <br /> Absorption</h3>
            </div>
          </div>

          {/* Item 5: Square Image (Minimalist Bottle) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-[0_10px_40px_rgba(29,53,87,0.06)]">
            <Image
              src="/bottle.png"
              fill
              alt="Minimalist White Bottle"
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>

            <div className="absolute inset-0 p-8 flex items-end justify-center pb-12">
              <span className="text-[#1D3557] bg-white/90 backdrop-blur-md px-6 py-3 rounded-full font-bold uppercase tracking-[0.2em] font-heading text-xs shadow-xl">
                Eco-Conscious Packaging
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
