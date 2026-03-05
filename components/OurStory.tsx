import Link from 'next/link';

export function OurStory() {
    return (
        <section className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-black">
                <img
                    src="/our-story-bg-v2.png"
                    alt="Our Story Background"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* Secondary Dark Overlay for gradient readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 pointer-events-none" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    Our Story
                </h2>
                <p className="font-sans text-[15px] md:text-[17px] leading-[1.8] mb-10 text-white max-w-[850px] mx-auto opacity-90 drop-shadow-md">
                    As a family- and employee-owned company, NOW produces high-quality natural products at prices that everyone loves. We are respected leaders in the natural products industry (since 1968), with a mission to provide value in products and services that empower people to lead healthier lives.
                </p>

                <Link
                    href="/about"
                    className="inline-block bg-[#FBBF24] hover:bg-[#F5B102] text-[#451A03] font-sans font-semibold text-[15px] px-10 py-3.5 rounded-sm transition-colors shadow-[0_4px_14px_rgba(251,191,36,0.25)]"
                >
                    Learn More
                </Link>
            </div>
        </section>
    );
}
