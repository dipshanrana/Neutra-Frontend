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
    <section className="py-24 bg-[#F1FAEE] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header - Slimmed Down */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#82C49C]/40 bg-white/60 backdrop-blur-sm text-[#2A6F40] text-xs font-bold uppercase tracking-[0.15em] font-sans mb-6 shadow-[0_2px_10px_rgba(42,111,64,0.06)]">
              <SvgAward className="w-4 h-4 text-emerald-600" /> Systemic Standard
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-[#163A24] font-heading leading-[1.05]">
              Clinical <span className="text-emerald-600 font-light">Excellence</span> <br className="hidden md:block" /> Verified.
            </h2>
          </div>
          <p className="text-lg text-[#163A24]/75 font-sans font-normal leading-relaxed max-w-md pb-2">
            Uncompromising synthesis of clinical research and ultra-pure biological inputs—designed to elevate your daily metabolic performance.
          </p>
        </div>



        {/* Hyper-Premium Visual Mosaic Grid - Tightened */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[320px]">

          {/* Item 1: Massive Hero Image (Molecule) */}
          <div className="md:col-span-8 md:row-span-2 relative rounded-[3rem] overflow-hidden group shadow-[0_30px_70px_rgba(10,25,14,0.12)]">
            <Image
              src="/molecule.png"
              fill
              alt="Clinical Molecule Render"
              className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A190E] via-[#0A190E]/20 to-transparent opacity-95 transition-opacity duration-700"></div>

            <div className="absolute inset-x-0 bottom-0 p-12 lg:p-16 flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.4em] font-heading mb-8 w-max">
                <span className="w-2 h-2 rounded-full bg-[#76C893] animate-pulse"></span> Bio-Optimization
              </div>
              <h3 className="text-4xl lg:text-7xl font-medium text-white font-heading mb-6 tracking-tight leading-[1.05] break-words">
                Clinically Validated <br /> <span className="font-light italic text-[#52B788]">Potency Matrix</span>
              </h3>
              <p className="text-[#F1FAEE]/60 font-sans font-light leading-relaxed max-w-xl text-xl">
                We engineer formulas based solely on human clinical trials. High-fidelity ingredients matched exactly to the proven biological dosages.
              </p>
            </div>
          </div>

          {/* Item 2: Tall Vertical (Capsules) */}
          <div className="md:col-span-4 md:row-span-2 relative rounded-[3rem] overflow-hidden group shadow-[0_30px_70px_rgba(10,25,14,0.08)] bg-white">
            <Image
              src="/capsules.png"
              fill
              alt="Pure Capsules"
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent opacity-100 transition-opacity duration-700"></div>

            <div className="absolute inset-x-0 bottom-0 p-12 flex flex-col justify-end">
              <h3 className="text-4xl font-medium text-[#0A190E] font-heading mb-4 tracking-tight leading-tight">Absolute <br /> <span className="font-light italic text-[#40916C]">Purity</span></h3>
              <p className="text-[#0A190E]/50 font-sans font-light leading-relaxed mb-10 text-lg">
                Zero excipients. Zero artificial binding agents. 100% active botanical transparency.
              </p>
              <button className="w-14 h-14 rounded-full bg-[#0A190E] flex items-center justify-center text-white group-hover:bg-[#40916C] transition-all duration-300 shadow-xl group-hover:scale-110">
                <SvgChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Item 3: Square Image (Lab / Microscope) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[3rem] overflow-hidden group shadow-lg bg-[#0A190E]">
            <Image
              src="/lab.png"
              fill
              alt="Laboratory Microscope"
              className="object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-60 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A190E] via-[#0A190E]/60 to-transparent"></div>

            <div className="absolute inset-0 p-10 flex flex-col justify-center text-center">
              <h3 className="text-3xl font-medium text-white font-heading tracking-tight mb-2 leading-tight">Third-Party <br /> <span className="font-light italic text-[#76C893]">Verified</span></h3>
            </div>
          </div>

          {/* Item 4: Square Image (Golden Drop) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[3rem] overflow-hidden group shadow-lg bg-white">
            <Image
              src="/drop.png"
              fill
              alt="Golden Oil Drop"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>

            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-center text-center">
              <h3 className="text-3xl font-medium text-[#0A190E] font-heading tracking-tight mb-2">Max <br /> <span className="font-light italic text-[#38A36D]">Absorption</span></h3>
            </div>
          </div>

          {/* Item 5: Square Image (Minimalist Bottle) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[3rem] overflow-hidden group shadow-xl bg-[#F7FCF9]">
            <Image
              src="/bottle.png"
              fill
              alt="Minimalist White Bottle"
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#0A190E]/5 group-hover:bg-transparent transition-colors duration-700"></div>

            <div className="absolute inset-0 p-10 flex items-end justify-center pb-12">
              <span className="text-[#0A190E] bg-white/80 backdrop-blur-xl border border-white/40 px-8 py-3 rounded-full font-black uppercase tracking-[0.3em] font-heading text-[10px] shadow-2xl">
                Eco-Conscious
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
