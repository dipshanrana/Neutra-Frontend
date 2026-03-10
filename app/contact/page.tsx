import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import { Suspense } from "react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FFFCF2] selection:bg-[#D4AF37] selection:text-white flex flex-col font-sans">
            <Suspense fallback={<div className="h-20 bg-white animate-pulse" />}>
                <Navbar />
            </Suspense>

            <section className="pt-32 pb-24 bg-white flex-1 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-heading mb-4 inline-block">Support Node</span>
                        <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-[#252422] font-heading leading-[1.1] mb-6">
                            Establish <span className="text-[#D4AF37] italic font-light">Contact.</span>
                        </h1>
                        <p className="text-[#252422]/60 font-sans text-lg font-light max-w-2xl mx-auto leading-relaxed">
                            Questions concerning pharmacokinetic dosing, bulk clinical requisition, or general support? Direct your inquiry to the appropriate sector below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

                        {/* Direct Lines */}
                        <div className="flex flex-col gap-12 pt-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#252422]/50 mb-2 font-heading">Clinical Support</h3>
                                <p className="text-[#252422] text-xl font-medium tracking-tight hover:text-brand-secondary cursor-pointer transition-colors">medical@nutracore.com</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#252422]/50 mb-2 font-heading">Logistics & Supply</h3>
                                <p className="text-[#252422] text-xl font-medium tracking-tight hover:text-brand-secondary cursor-pointer transition-colors">logistics@nutracore.com</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#252422]/50 mb-2 font-heading">Primary HQ</h3>
                                <p className="text-[#252422]/70 text-lg font-light leading-relaxed">
                                    1902 Bio-Tech Boulevard<br />
                                    Sector 4, Innovation District<br />
                                    San Francisco, CA 94107
                                </p>
                            </div>

                            <div className="pt-8 border-t border-[#252422]/10 flex gap-6">
                                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D4AF37] text-white hover:bg-[#D4AF37] cursor-pointer transition-colors">
                                    X
                                </span>
                                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D4AF37] text-white hover:bg-[#D4AF37] cursor-pointer transition-colors">
                                    IN
                                </span>
                            </div>
                        </div>

                        {/* Direct Message Form */}
                        <form className="bg-white border border-[#252422]/10 rounded-[2.5rem] p-10 lg:p-14 shadow-[0_20px_60px_rgba(29,53,87,0.06)] flex flex-col gap-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#252422]/40 mb-3 font-heading">Identification</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#FFFCF2]/50 border-b-2 border-[#252422]/10 px-0 py-4 text-[#252422] placeholder-[#252422]/30 focus:outline-none focus:border-[#34A0A4] transition-all bg-transparent font-medium"
                                    placeholder="Your Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#252422]/40 mb-3 font-heading">Comm Channel</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#FFFCF2]/50 border-b-2 border-[#252422]/10 px-0 py-4 text-[#252422] placeholder-[#252422]/30 focus:outline-none focus:border-[#34A0A4] transition-all bg-transparent font-medium"
                                    placeholder="your.email@domain.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#252422]/40 mb-3 font-heading">Inquiry Details</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-[#FFFCF2]/50 border-b-2 border-[#252422]/10 px-0 py-4 text-[#252422] placeholder-[#252422]/30 focus:outline-none focus:border-[#34A0A4] transition-all bg-transparent font-medium resize-none"
                                    placeholder="Describe your requisition or query..."
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full py-5 mt-4 bg-[#0A190E] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] hover:shadow-lg transition-all duration-300"
                            >
                                Transmit Message
                            </button>
                        </form>

                    </div>
                </div>
            </section>

            <PreFooter />
            <Footer />
        </main>
    );
}

