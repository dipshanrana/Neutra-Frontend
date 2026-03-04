import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F1FAEE] selection:bg-emerald-600 selection:text-white flex flex-col font-sans">
            <Navbar />

            <section className="pt-32 pb-24 bg-white relative overflow-hidden flex-1">
                <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24 max-w-4xl mx-auto mt-12">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 font-heading mb-6 inline-block">The Product</span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#1D3557] font-heading leading-[1] mb-8">
                            Engineering <br />
                            <span className="text-emerald-600 italic font-light">Longevity.</span>
                        </h1>
                        <p className="text-[#1D3557]/60 font-sans text-xl font-light leading-relaxed mb-12">
                            NutraCore was founded on a singular premise: the supplement industry was broken,
                            relying on antiquated absorption models and sub-clinical dosages. We rebuilt it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                        <div className="relative aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1532187863486-abf322ce36c9?q=80&w=2000&auto=format&fit=crop"
                                fill
                                className="object-cover"
                                alt="Laboratory Setup"
                            />
                            <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply"></div>
                        </div>

                        <div className="flex flex-col gap-12">
                            <div>
                                <h3 className="text-3xl font-medium text-[#1D3557] font-heading tracking-tight leading-tight mb-4">Bio-availability First.</h3>
                                <p className="text-[#1D3557]/60 font-light leading-relaxed text-lg">
                                    It doesn't matter what the label says if your body cannot synthesize it. Our primary directive is maximizing cellular uptake using proprietary liposomal encapsulations and activated compounding.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-medium text-[#1D3557] font-heading tracking-tight leading-tight mb-4">Transparent Sourcing.</h3>
                                <p className="text-[#1D3557]/60 font-light leading-relaxed text-lg">
                                    Every compound, from synthetic peptides to organic bio-extracts, is traced back to its point of origin. We hold our suppliers to extreme pharmaceutical-grade constraints, discarding 80% of raw material during screening.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-medium text-[#1D3557] font-heading tracking-tight leading-tight mb-4">No Proprietary Blends.</h3>
                                <p className="text-[#1D3557]/60 font-light leading-relaxed text-lg">
                                    Proprietary blends are used by the industry to hide under-dosed ingredients. We list every single milligram of active compound on our labeling, allowing complete scientific scrutiny.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#34A0A4]/20 to-transparent mix-blend-overlay"></div>
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 font-heading relative z-10">Start Your Journey.</h2>
                        <p className="max-w-2xl mx-auto text-white/70 font-light text-lg mb-12 relative z-10">
                            Join over 50,000 clinicians, athletes, and biohackers utilizing NuCore technologies to elevate their baseline performance state.
                        </p>
                        <button className="relative z-10 px-10 py-5 bg-emerald-600 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#1D3557] hover:shadow-[0_0_30px_rgba(52,160,164,0.4)] transition-all duration-300">
                            Explore the Catalog
                        </button>
                    </div>

                </div>
            </section>

            <PreFooter />
            <Footer />
        </main>
    );
}
