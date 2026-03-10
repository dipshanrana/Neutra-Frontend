import Image from "next/image";
import Link from "next/link";

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
    <section className="pt-6 pb-0 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header - Slimmed Down */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 backdrop-blur-sm text-emerald-700 text-xs font-bold uppercase tracking-[0.15em] font-sans mb-6 shadow-[0_2px_10px_rgba(5,150,105,0.06)]">
              <SvgAward className="w-4 h-4 text-emerald-500" /> Systemic Standard
            </span>
            <h2 className="text-4xl md:text-[#252422]xl lg:text-[#252422]xl font-semibold tracking-tighter text-[#163A24] font-heading leading-[1.05] italic">
              Clinical <span className="text-emerald-400 font-light">Excellence</span> <br className="hidden md:block" /> Verified.
            </h2>
          </div>
          <p className="text-lg text-[#163A24]/75 font-sans font-normal leading-relaxed max-w-md pb-2">
            Uncompromising synthesis of clinical research and ultra-pure biological inputs�designed to elevate your daily metabolic performance.
          </p>
        </div>



        {/* Hyper-Premium Visual Mosaic Grid - Dynamic Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[320px]">

          {/* Item 1: Massive Hero Image (Molecule) */}
          <div className="md:col-span-8 md:row-span-2 relative rounded-[3rem] overflow-hidden group shadow-[0_30px_70px_rgba(10,25,14,0.12)]">
            <Image
              src="/molecule.png"
              fill
              alt="Clinical Molecule Render"
              className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-110"
            />
            {/* Always visible base gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A190E] via-[#0A190E]/20 to-transparent opacity-60"></div>

            {/* Premium Information Overlay - Smooth Synchronized Transition (Slowed down for premium feel) */}
            <div className="absolute inset-0 bg-[#0A190E]/95 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col justify-center p-12 lg:p-16">
              <div className="transform translate-y-12 group-hover:translate-y-0 transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,1,0.3,1)]">
                <span className="text-brand-accent font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Potency Research</span>
                <h3 className="text-4xl lg:text-6xl font-medium text-white font-heading mb-6 leading-tight">Potency Matrix <br /> <span className="font-light italic text-emerald-400">Analysis</span></h3>
                <p className="text-white/70 text-lg md:text-xl font-sans font-light max-w-xl mb-10 leading-relaxed">
                  Advanced molecular mapping identifies the exact pharmacological threshold for maximum metabolic up-regulation.
                </p>
                <Link
                  href="/information"
                  className="w-max bg-[#2FAF82] hover:bg-[#258a67] text-white font-medium py-4 px-10 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Static Content (Visible when NOT hovered) */}
            <div className="absolute inset-x-0 bottom-0 p-12 lg:p-16 flex flex-col justify-end group-hover:opacity-0 transition-all duration-700 pointer-events-none">
              <h3 className="text-4xl lg:text-[#252422]xl font-medium text-white font-heading mb-2 tracking-tight leading-[1.05]">
                Clinically <br /> <span className="font-light italic text-emerald-400">Validated</span>
              </h3>
            </div>
          </div>

          {/* Item 2: Tall Vertical (Capsules) - The Arrow Card (No Hover Overlay) */}
          <div className="md:col-span-4 md:row-span-2 relative rounded-[3rem] overflow-hidden group shadow-[0_30px_70px_rgba(10,25,14,0.08)] bg-white">
            <Image
              src="/capsules.png"
              fill
              alt="Pure Capsules"
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent opacity-100"></div>

            <div className="absolute inset-x-0 bottom-0 p-12 flex flex-col justify-end">
              <h3 className="text-4xl font-medium text-[#0A190E] font-heading mb-4 tracking-tight leading-tight">Absolute <br /> <span className="font-light italic text-[#40916C]">Purity</span></h3>
              <p className="text-[#0A190E]/50 font-sans font-light leading-relaxed mb-10 text-lg">
                Zero excipients. Zero artificial binding agents. 100% active transparency.
              </p>
              <Link href="/information" className="w-14 h-14 rounded-full bg-[#0A190E] flex items-center justify-center text-white hover:bg-[#40916C] transition-all duration-300 shadow-xl hover:scale-110">
                <SvgChevronRight className="w-7 h-7" />
              </Link>
            </div>
          </div>

          {/* Item 3: Square Image (Lab) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[3rem] overflow-hidden group shadow-lg bg-[#0A190E]">
            <Image
              src="/lab.png"
              fill
              alt="Laboratory"
              className="object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-20"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col items-center justify-center p-8 text-center bg-emerald-950/90">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,1,0.3,1)]">
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">Standards</span>
                <h4 className="text-2xl text-white font-heading mb-4">Protocol Testing</h4>
                <Link href="/information" className="bg-white text-[#0A190E] text-[12px] font-bold px-6 py-2 rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors inline-block">
                  View Data
                </Link>
              </div>
            </div>

            <div className="absolute inset-0 p-10 flex flex-col justify-center text-center group-hover:opacity-0 pointer-events-none transition-all duration-1000">
              <h3 className="text-[#252422]xl font-medium text-white font-heading tracking-tight mb-2 leading-tight">Third-Party <br /> <span className="font-light italic text-[#76C893]">Verified</span></h3>
            </div>
          </div>

          {/* Item 4: Square Image (Golden Drop) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[3rem] overflow-hidden group shadow-lg bg-white">
            <Image
              src="/drop.png"
              fill
              alt="Bioavailability"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col items-center justify-center p-8 text-center bg-[#0A190E]/95">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,1,0.3,1)]">
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">Absorption</span>
                <h4 className="text-2xl text-white font-heading mb-4">Fluid Kinetics</h4>
                <Link href="/information" className="bg-[#2FAF82] text-white text-[12px] font-medium px-6 py-2 rounded-full hover:bg-[#258a67] transition-colors inline-block">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-center text-center group-hover:opacity-0 pointer-events-none transition-all duration-1000">
              <h3 className="text-[#252422]xl font-medium text-[#0A190E] font-heading tracking-tight mb-2">Max <br /> <span className="font-light italic text-[#38A36D]">Bioavailability</span></h3>
            </div>
          </div>

          {/* Item 5: Square Image (Bottle) */}
          <div className="md:col-span-4 md:row-span-1 relative rounded-[3rem] overflow-hidden group shadow-xl bg-[#F7FCF9]">
            <Image
              src="/bottle.png"
              fill
              alt="Sustainable Packaging"
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col items-center justify-center p-8 text-center bg-emerald-900/95">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,1,0.3,1)]">
                <span className="text-emerald-300 font-bold text-[10px] uppercase tracking-widest mb-2 block">Sustainability</span>
                <h4 className="text-2xl text-white font-heading mb-4">Eco Standards</h4>
                <Link href="/information" className="bg-white text-emerald-900 text-[12px] font-bold px-6 py-2 rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors inline-block">
                  Details
                </Link>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-10 flex items-end justify-center pb-12 group-hover:opacity-0 pointer-events-none transition-all duration-1000">
              <span className="text-[#0A190E] bg-white/80 backdrop-blur-xl border border-white/40 px-8 py-3 rounded-full font-black uppercase tracking-[0.3em] font-heading text-[10px] shadow-2xl">
                Eco-Conscious
              </span>
            </div>
          </div>

        </div>

        {/* Section Footer - Bridge to Knowledge Base */}
        <div className="mt-6 md:mt-8 border-t border-emerald-900/5 pt-8 pb-10 flex flex-col items-center text-center">
          <p className="text-[#3a5a40] text-lg md:text-xl font-normal max-w-2xl leading-relaxed opacity-80 mb-8 font-sans">
            Our pursuit of bio-optimization is relentless. Every batch undergoes comprehensive third-party analysis to ensure we deliver nothing less than pharmaceutical-grade excellence to your daily ritual.
          </p>
          <Link
            href="/information"
            className="text-[#163A24] font-bold text-[15px] uppercase tracking-widest border-b-2 border-[#D4AF37] pb-1 hover:text-brand-secondary hover:border-emerald-800 transition-all"
          >
            Learn about our clinical standards
          </Link>
        </div>

      </div>
    </section>
  )
}

