"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { api, Category } from "@/lib/api";

const SvgSearch = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20L16 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 8C9.34315 8 8 9.34315 8 11" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
  </svg>
)

const SvgUser = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11C10 11 10 9 10 9" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
  </svg>
)

const SvgMenu = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <line x1="4" x2="20" y1="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" x2="20" y1="6" y2="6" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" x2="14" y1="18" y2="18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories in nav", err);
      }
    };
    loadCategories();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white transition-all duration-300 font-sans shadow-[0_1px_0_rgba(29,53,87,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center lg:pr-16">
            <Link href="/" className="flex items-center">
              <span className="text-[1.75rem] font-medium tracking-tight text-[#1D3557] font-heading">
                Nutri<span className="text-brand-primary">Core</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered text */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            <Link href="/products" className="text-sm font-medium text-[#252422]/80 hover:text-brand-secondary transition-colors">
              Products
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="text-sm font-medium text-[#252422]/80 hover:text-brand-secondary transition-colors flex items-center gap-1 py-1">
                Categories
                <svg className={`w-3 h-3 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(29,53,87,0.1)] border border-[#252422]/5 p-2 transition-all duration-300 transform origin-top ${showCategories ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                <div className="grid gap-1">
                  {categories.length > 0 ? categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] group-hover/item:bg-white flex items-center justify-center transition-colors shadow-sm text-[#252422]/60 group-hover/item:text-brand-primary">
                        <span className="flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-current [&>svg]:stroke-current" dangerouslySetInnerHTML={{ __html: cat.svg }} />
                      </div>
                      <span className="text-[13px] font-medium text-[#252422]/70 group-hover/item:text-brand-primary">{cat.name}</span>
                    </Link>
                  )) : (
                    <p className="text-[11px] text-[#252422]/40 text-center py-4 uppercase tracking-widest font-black">No Categories</p>
                  )}
                </div>
              </div>
            </div>
            <Link href="/about" className="text-sm font-medium text-[#252422]/80 hover:text-brand-secondary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#252422]/80 hover:text-brand-secondary transition-colors">
              Contact
            </Link>
            <Link href="/information" className="text-sm font-medium text-[#252422]/80 hover:text-brand-secondary transition-colors">
              Information
            </Link>
            <Link href="/blog" className="text-sm font-medium text-[#252422]/80 hover:text-brand-secondary transition-colors">
              Blog
            </Link>
          </div>

          {/* Right Icon Nav */}
          <div className="hidden md:flex items-center space-x-6 pl-4">
            {/* Premium Search Box */}
            <form onSubmit={handleSearch} className="relative group flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-5 pr-12 py-2.5 rounded-full border border-[#252422]/10 bg-emerald-50/20 text-sm text-[#252422] font-sans w-48 focus:outline-none focus:border-brand-primary/50 focus:bg-white transition-all duration-300 placeholder:text-[#252422]/40 shadow-[0_2px_10px_rgba(29,53,87,0.02)]"
              />
              <button type="submit" className="absolute right-4 text-[#252422]/50 hover:text-brand-secondary transition-colors">
                <SvgSearch className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </form>

            <button className="text-[#252422] hover:text-brand-secondary transition-colors">
              <SvgUser className="w-[20px] h-[20px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-6">
            <button
              onClick={() => {
                const query = prompt("Enter search query:");
                if (query) {
                  router.push(`/products?search=${encodeURIComponent(query)}`);
                }
              }}
              className="text-[#252422] hover:text-brand-secondary transition-colors"
            >
              <SvgSearch className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="text-[#252422] hover:text-brand-secondary">
              <SvgMenu className="w-[24px] h-[24px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

