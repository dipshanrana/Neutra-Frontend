"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api, Category } from "@/lib/api";

const SvgArrowRight = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SvgInstagram = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SvgTwitter = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SvgLinkedin = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2" y="9" width="4" height="12" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="4" r="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load footer categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-[#1D3557] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 xl:gap-24 mb-24">

          {/* Brand column */}
          <div className="md:col-span-5">
            <span className="text-[2rem] font-medium tracking-tight font-heading block mb-6 text-white">
              Nutri<span className="text-brand-primary">Core</span>
            </span>
            <p className="text-white/60 font-sans font-light leading-relaxed max-w-sm mb-12 text-sm">
              Formulating the highest quality nutritional supplements, delivered straight to your door. Backed by science, obsessed with purity.
            </p>

            <div className="flex flex-col gap-2 w-full max-w-sm">
              <span className="text-xs uppercase tracking-[0.15em] text-[#82C49C] font-heading font-bold mb-2">Join our Newsletter</span>
              <div className="flex items-center border-b border-white/20 pb-3 focus-within:border-brand-primary transition-colors group">
                <input
                  type="email"
                  placeholder="Subscribe for insider updates"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 font-sans text-sm font-light"
                />
                <button className="text-white/40 group-focus-within:text-brand-primary hover:text-brand-secondary transition-colors">
                  <SvgArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#82C49C] font-heading mb-8">Shop</h4>
              <ul className="space-y-4 font-sans text-sm font-light">
                {categories.length > 0 ? (
                  categories.slice(0, 4).map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/products?category=${encodeURIComponent(cat.name)}`} className="hover:text-brand-secondary transition-colors text-[#FFFCF2]/80">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Loading...</a></li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-secondary font-heading mb-8">Learn</h4>
              <ul className="space-y-4 font-sans text-sm font-light">
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Our Ingredients</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Clinical Studies</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Sustainability</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-secondary font-heading mb-8">Support</h4>
              <ul className="space-y-4 font-sans text-sm font-light">
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">FAQ</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Shipping</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Returns</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors text-white/70">Contact</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-white/30 font-sans font-light">
          <p className="mt-6 md:mt-0">© 2026 NutriCore Technologies. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
              <SvgInstagram className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <SvgTwitter className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <SvgLinkedin className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

