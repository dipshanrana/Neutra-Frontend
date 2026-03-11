"use client";

import { useState } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import { LANGUAGE_CURRENCY_MAP } from "@/lib/currency";

const LANGUAGES = [
    { name: "English", code: "en", flag: "🇬🇧" },
    { name: "Hindi", code: "hi", flag: "🇮🇳" },
    { name: "Nepali", code: "ne", flag: "🇳🇵" },
    { name: "Spanish", code: "es", flag: "🇪🇸" },
    { name: "French", code: "fr", flag: "🇫🇷" },
    { name: "German", code: "de", flag: "🇩🇪" },
    { name: "Chinese", code: "zh-CN", flag: "🇨🇳" },
    { name: "Japanese", code: "ja", flag: "🇯🇵" },
];

export function AdminLanguageSwitcher() {
    const { setLanguage, langCode: activeLang } = useCurrency();
    const [open, setOpen] = useState(false);

    const current = LANGUAGES.find(l => l.code === activeLang) ?? LANGUAGES[0];
    const currency = LANGUAGE_CURRENCY_MAP[activeLang];

    return (
        <div className="relative">
            {/* Trigger button */}
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white"
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="font-medium hidden sm:inline">{current.name}</span>
                <span className="text-[#38A36D] font-bold text-xs">{currency?.symbol}</span>
                <svg
                    className={`w-3.5 h-3.5 opacity-40 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop to close on outside click */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#0d2212] border border-white/10 rounded-2xl shadow-2xl p-2 grid gap-0.5 z-50 overflow-hidden">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 px-3 py-2">
                            Language &amp; Currency
                        </p>
                        {LANGUAGES.map(lang => {
                            const cur = LANGUAGE_CURRENCY_MAP[lang.code];
                            const isActive = lang.code === activeLang;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        document.cookie = `googtrans=/en/${lang.code}; path=/`;
                                        setLanguage(lang.code);
                                        setOpen(false);
                                        window.location.reload();
                                    }}
                                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors text-[13px] font-medium ${isActive
                                            ? "bg-[#38A36D]/15 text-[#38A36D]"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span className="text-base leading-none">{lang.flag}</span>
                                    <span className="flex-1 text-left">{lang.name}</span>
                                    <span className={`text-[11px] font-bold ${isActive ? "text-[#38A36D]/70" : "text-white/20"}`}>
                                        {cur?.symbol}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
