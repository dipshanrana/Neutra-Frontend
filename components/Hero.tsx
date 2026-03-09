import Image from "next/image";
import Link from "next/link";

const SvgCheckCircle = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.08 2.85" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 4L12 14.01L9 11.01" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.1" />
  </svg>
);

const SvgArrowRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
    <path d="M4 12H20M20 12L13 5M20 12L13 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SvgStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export function Hero() {
  return (
    <section className="relative h-[calc(100vh-80px)] mt-[80px] flex items-center bg-[#FFFCF2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-brand-primary"></span>
              <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] font-heading">
                Next Generation Nutrition
              </span>
            </div>

            <h1 className="text-[#1D3557]xl sm:text-6xl lg:text-[#1D3557]xl font-medium tracking-tight text-[#1D3557] leading-[1.05] font-heading mb-6">
              True Health,<br />
              <span className="text-brand-primary italic font-light">Simplified.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#1D3557]/70 font-sans font-light leading-relaxed mb-10 max-w-lg">
              Clinically-dosed, highly bioavailable multi-nutrition essentials. Expertly formulated to elevate your daily performance and long-term vitality.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/products" className="px-10 py-5 bg-[#047857] text-[#ffffff] rounded-xl font-sans font-bold uppercase tracking-widest text-xs hover:bg-[#065f46] shadow-[0_20px_40px_rgba(4,120,87,0.2)] transition-all duration-500 flex items-center justify-center gap-3 group">
                Shop Essentials
                <SvgArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
              <Link href="/information" className="px-10 py-5 bg-white text-[#1D3557] rounded-xl font-sans font-bold uppercase tracking-widest text-xs border border-[#1D3557]/10 hover:border-brand-primary shadow-[0_10px_30px_rgba(29,53,87,0.03)] transition-all duration-500 flex items-center justify-center">
                Explore The Science
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-[#252422]/10 flex flex-wrap gap-8 items-center justify-start">
              <div className="flex items-center gap-2">
                <SvgCheckCircle className="w-5 h-5 text-[#82C49C]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#252422]/80">Third-Party Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <SvgCheckCircle className="w-5 h-5 text-[#82C49C]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#252422]/80">Zero Fillers</span>
              </div>
              <div className="flex items-center gap-2">
                <SvgCheckCircle className="w-5 h-5 text-[#82C49C]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#252422]/80">Non-GMO</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
            {/* Elegant luxury background element */}
            <div className="absolute inset-0 bg-[#82C49C]/10 rounded-full scale-90 blur-3xl opacity-60"></div>

            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute z-30 transition-transform duration-700 hover:-translate-y-4">
                <Image src="/multi-vit.png" width={320} height={400} alt="Vitamins" className="object-contain drop-shadow-[0_20px_40px_rgba(29,53,87,0.15)] mix-blend-multiply" />
              </div>
              <div className="absolute z-20 -left-4 bottom-24 -rotate-6 transition-transform duration-700 hover:rotate-0 hover:z-40 hover:-translate-y-2">
                <Image src="/protein.png" width={240} height={300} alt="Protein" className="object-contain drop-shadow-[0_20px_40px_rgba(29,53,87,0.1)] mix-blend-multiply" />
              </div>
              <div className="absolute z-20 right-0 top-24 rotate-6 transition-transform duration-700 hover:rotate-0 hover:z-40 hover:-translate-y-2">
                <Image src="/fish-oil.png" width={180} height={200} alt="Fish Oil" className="object-contain drop-shadow-[0_20px_40px_rgba(29,53,87,0.1)] mix-blend-multiply" />
              </div>
            </div>

            {/* Premium minimalist badge */}
            <div className="absolute bottom-12 right-0 bg-white p-5 rounded-2xl shadow-[0_10px_40px_rgba(29,53,87,0.08)] flex items-center gap-4 border border-[#252422]/5">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Reviewer" />)}
              </div>
              <div>
                <div className="flex text-brand-accent mb-0.5 space-x-0.5">
                  {[1, 2, 3, 4, 5].map(i => <SvgStar key={i} className="w-[14px] h-[14px]" />)}
                </div>
                <div className="text-xs font-bold text-[#252422] font-sans mt-1">Over 50K+ Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

