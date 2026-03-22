"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { api, Category, getCurrentUser, logout } from "@/lib/api";
import { useCurrency } from "@/components/CurrencyContext";
import { LANGUAGE_CURRENCY_MAP } from "@/lib/currency";

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
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setLanguage, langCode: activeLang } = useCurrency();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
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
    setUser(getCurrentUser());
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white transition-all duration-300 font-sans shadow-[0_1px_0_rgba(29,53,87,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center lg:pr-16">
            <Link href="/" className="flex items-center">
              <span className="text-[1.75rem] font-medium tracking-tight text-[#1D3557] font-heading">
                Nutri<span className="text-black">Core</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered text */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            <Link href="/products" className="text-sm font-medium text-[#252422]/80 hover:text-stone-700 transition-colors">
              Products
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="text-sm font-medium text-[#252422]/80 hover:text-stone-700 transition-colors flex items-center gap-1 py-1">
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
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-50 transition-all group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] group-hover/item:bg-white flex items-center justify-center transition-colors shadow-sm text-[#252422]/60 group-hover/item:text-stone-500">
                        <span className="flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-current [&>svg]:stroke-current" dangerouslySetInnerHTML={{ __html: cat.svg }} />
                      </div>
                      <span className="text-[13px] font-medium text-[#252422]/70 group-hover/item:text-stone-600">{cat.name}</span>
                    </Link>
                  )) : (
                    <p className="text-[11px] text-[#252422]/40 text-center py-4 uppercase tracking-widest font-black">No Categories</p>
                  )}
                </div>
              </div>
            </div>
            <Link href="/about" className="text-sm font-medium text-[#252422]/80 hover:text-stone-700 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#252422]/80 hover:text-stone-700 transition-colors">
              Contact
            </Link>
            <Link href="/information" className="text-sm font-medium text-[#252422]/80 hover:text-stone-700 transition-colors">
              Information
            </Link>
            <Link href="/blog" className="text-sm font-medium text-[#252422]/80 hover:text-stone-700 transition-colors">
              Blog
            </Link>
          </div>

          {/* Right Icon Nav */}
          <div className="hidden md:flex items-center space-x-6 pl-4">
            {/* Custom Language Switcher */}
            <div className="relative group/lang">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50/20 border border-[#252422]/5 rounded-full hover:bg-white hover:border-stone-500/30 transition-all text-xs font-semibold text-[#252422]/70 group-hover/lang:text-stone-600">
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h4.6a2 2 0 001.838-1.234l.321-.804A2 2 0 0019.122 8H17a2 2 0 01-2-2V4.5A1.5 1.5 0 0013.5 3h-1.1a2 2 0 00-1.838 1.234l-.321.804A2 2 0 018.322 8H7a2 2 0 01-2-2V3a1 1 0 00-1-1h-.5a1 1 0 00-1 1v.935z" />
                </svg>
                <span id="current_language_label">Language</span>
                <span className="text-stone-500 font-bold opacity-70">{LANGUAGE_CURRENCY_MAP[activeLang]?.symbol ?? 'Rs.'}</span>
                <svg className="w-3 h-3 opacity-40 transition-transform group-hover/lang:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-300 scale-95 group-hover/lang:scale-100 z-[100]">
                <div className="w-52 bg-white rounded-2xl shadow-2xl border border-[#252422]/5 p-2 grid gap-1 overflow-hidden">
                  {[
                    { name: 'English', code: 'en', flag: '🇬🇧' },
                    { name: 'Spanish', code: 'es', flag: '🇪🇸' },
                    { name: 'French', code: 'fr', flag: '🇫🇷' },
                    { name: 'German', code: 'de', flag: '🇩🇪' },
                    { name: 'Chinese', code: 'zh-CN', flag: '🇨🇳' },
                    { name: 'Japanese', code: 'ja', flag: '🇯🇵' },
                    { name: 'Nepali', code: 'ne', flag: '🇳🇵' },
                    { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        document.cookie = `googtrans=/en/${lang.code}; path=/`;
                        setLanguage(lang.code);
                        window.location.reload();
                      }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-[13px] font-medium hover:text-stone-700 ${activeLang === lang.code ? 'text-stone-700 bg-stone-50' : 'text-[#252422]/70'}`}
                    >
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.name}</span>
                      <span className="text-[11px] font-bold opacity-40">{LANGUAGE_CURRENCY_MAP[lang.code]?.symbol ?? ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Search Box */}
            <form onSubmit={handleSearch} className="relative group flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-5 pr-12 py-2.5 rounded-full border border-[#252422]/10 bg-stone-50/20 text-sm text-[#252422] font-sans w-48 focus:outline-none focus:border-stone-700/50 focus:bg-white transition-all duration-300 placeholder:text-[#252422]/40 shadow-[0_2px_10px_rgba(29,53,87,0.02)]"
              />
              <button type="submit" className="absolute right-4 text-[#252422]/50 hover:text-stone-700 transition-colors">
                <SvgSearch className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </form>

            {user ? (
              <div className="relative group/user">
                <button className="text-[#252422] hover:text-stone-600 transition-colors font-sans text-[13px] font-bold flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-[10px] text-stone-500 shadow-sm group-hover:bg-stone-500 group-hover:text-white transition-all duration-500">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(29,53,87,0.12)] border border-[#252422]/5 p-2 transition-all duration-300 transform origin-top-right opacity-0 scale-95 invisible group-hover/user:opacity-100 group-hover/user:scale-100 group-hover/user:visible">
                  <div className="px-4 py-3 border-b border-[#252422]/5 mb-1">
                    <p className="text-[10px] font-black tracking-widest text-[#252422]/40 uppercase mb-0.5">Account</p>
                    <p className="text-[13px] font-bold text-[#252422] truncate">{user.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setUser(null);
                      router.push('/');
                    }}
                    className="w-full text-left px-4 py-3 text-[13px] text-[#252422]/70 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-bold flex items-center justify-between group/logout"
                  >
                    Log Out
                    <span className="opacity-0 group-hover/logout:opacity-50 transition-opacity">→</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="text-[#252422] hover:text-stone-600 transition-colors relative group">
                <SvgUser className="w-[20px] h-[20px] group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-stone-500 group-hover:w-full transition-all duration-500"></span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#252422] hover:bg-stone-50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <SvgMenu className="w-6 h-6" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-40 transition-all duration-500 h-[calc(100vh-80px)] overflow-y-auto ${mobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}>
        <div className="px-6 py-8 flex flex-col gap-8 pb-32">
          {/* Search in Mobile Menu */}
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-4 rounded-2xl border border-[#252422]/10 bg-stone-50 text-[#252422] focus:outline-none focus:border-stone-700/40 focus:bg-white transition-all shadow-sm"
            />
            <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-700">
              <SvgSearch className="w-5 h-5" strokeWidth={2} />
            </button>
          </form>

          {/* Nav Links */}
          <div className="grid gap-2">
            {[
              { name: 'Products', href: '/products' },
              { name: 'About Us', href: '/about' },
              { name: 'Contact', href: '/contact' },
              { name: 'Information', href: '/information' },
              { name: 'Blog', href: '/blog' },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-heading font-medium text-[#252422] hover:text-stone-700 py-3 border-b border-[#252422]/5 flex justify-between items-center group"
              >
                {link.name}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-all">→</span>
              </Link>
            ))}
          </div>

          {/* Categories Grid - Mobile */}
          <div className="mt-4">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#252422]/40 uppercase mb-6">Explore Categories</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col gap-3 p-4 bg-stone-50 rounded-2xl border border-[#252422]/5 hover:bg-stone-50 hover:border-stone-100 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-700" dangerouslySetInnerHTML={{ __html: cat.svg }} />
                  <span className="text-[13px] font-bold text-[#252422]">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Language Selector - Mobile */}
          <div className="mt-4 bg-stone-50/50 rounded-3xl p-6 border border-stone-100/50">
            <p className="text-[10px] font-black tracking-[0.2em] text-stone-700/60 uppercase mb-4">Display Language</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'English', code: 'en', flag: '🇬🇧' },
                { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
                { name: 'Nepali', code: 'ne', flag: '🇳🇵' },
                { name: 'Spanish', code: 'es', flag: '🇪🇸' },
                { name: 'French', code: 'fr', flag: '🇫🇷' },
                { name: 'German', code: 'de', flag: '🇩🇪' },
                { name: 'Chinese', code: 'zh-CN', flag: '🇨🇳' },
                { name: 'Japanese', code: 'ja', flag: '🇯🇵' },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    document.cookie = `googtrans=/en/${lang.code}; path=/`;
                    setLanguage(lang.code);
                    window.location.reload();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 bg-white border rounded-full text-xs font-bold transition-all shadow-sm ${activeLang === lang.code
                    ? 'border-stone-700 text-stone-700 bg-stone-50'
                    : 'border-stone-100 text-[#252422]/70 hover:bg-stone-700 hover:text-white hover:border-stone-700'
                    }`}
                >
                  <span className="text-sm leading-none">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Section - Mobile */}
          <div className="mt-auto">
            {user ? (
              <div className="flex items-center justify-between p-4 bg-[#252422] rounded-2xl text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs opacity-60 font-medium">Logged in as</p>
                    <p className="font-bold">{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setUser(null); router.push('/'); }}
                  className="p-2 hover:text-stone-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full py-5 bg-[#252422] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg">
                <SvgUser className="w-4 h-4" />
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

