import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";

export default function InformationPage() {
    const faqs = [
        {
            q: "What is your testing methodology?",
            a: "Every raw material undergoes rigorous third-party testing for heavy metals, microbials, and active compound stabilization before entering our isolated manufacturing facilities. We provide COAs for every production batch on request."
        },
        {
            q: "Are your formulations vegan?",
            a: "95% of our clinical catalog is completely plant-based. Any product utilizing marine or bovine derivatives is clearly marked with its ethical sourcing profile and molecular origin."
        },
        {
            q: "How does the subscription regimen work?",
            a: "Your selected regimen is automatically synthesized and dispatched every 30 days. You possess complete granular control over delivery intervals and pausing via your personal encrypted dashboard."
        },
        {
            q: "Do you ship internationally?",
            a: "Currently, we operate dedicated fulfillment nodes across North America, the EU, and select APAC regions, ensuring temperature-controlled logistics for molecule stability."
        }
    ];

    return (
        <main className="min-h-screen bg-[#ffffff] selection:bg-emerald-600 selection:text-white flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-48 pb-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-px w-12 bg-emerald-600"></span>
                            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px]">Technical Documentation</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-[#1D3557] font-heading leading-[1] mb-10">
                            The Science of <span className="text-emerald-600 italic font-light">Performance.</span>
                        </h1>
                        <p className="text-[#1D3557]/50 font-sans text-xl font-light leading-relaxed max-w-2xl">
                            Transparency is our baseline. Access comprehensive data regarding our clinical protocols,
                            bio-logistics, and the physiological methodologies behind every formula we engineer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-[#F1FAEE]/40 flex-1 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid gap-8">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="group bg-white rounded-[3rem] p-10 lg:p-14 shadow-[0_20px_60px_rgba(29,53,87,0.03)] border border-[#1D3557]/5 hover:bg-emerald-600 transition-all duration-700">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 block">Protocol Inquiry // 0{idx + 1}</span>
                                <h3 className="text-3xl font-medium text-[#1D3557] font-heading tracking-tight mb-8 leading-tight group-hover:text-white transition-colors duration-500">
                                    {faq.q}
                                </h3>
                                <p className="text-[#1D3557]/50 font-light leading-relaxed text-lg max-w-3xl group-hover:text-white/60 transition-colors duration-500">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 p-16 bg-emerald-600 rounded-[4rem] text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h4 className="text-3xl lg:text-4xl font-medium text-white font-heading mb-6 italic relative z-10">Require deeper <span className="font-light">bio-data?</span></h4>
                        <p className="text-white/60 mb-10 max-w-lg mx-auto font-light text-lg relative z-10">Our clinical representatives are on standby to provide deep-tier documentation and certificates of analysis.</p>
                        <button className="px-12 py-6 bg-emerald-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-[#1D3557] hover:shadow-[0_20px_40px_rgba(29,53,87,0.3)] transition-all duration-500 relative z-10">
                            Request Data Packet
                        </button>
                    </div>
                </div>
            </section>

            <PreFooter />
            <Footer />
        </main>
    );
}
