"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    CurrencyConfig,
    DEFAULT_CURRENCY,
    getSavedLanguage,
    getCurrencyForLanguage,
    formatPrice as _formatPrice,
    saveLanguagePreference,
} from "@/lib/currency";

interface CurrencyContextValue {
    currency: CurrencyConfig;
    /** Change the active language (and auto-updates currency). */
    setLanguage: (langCode: string) => void;
    /** Formats an NPR price to the current currency string. */
    formatPrice: (nprPrice: number) => string;
    /** The active language code */
    langCode: string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
    currency: DEFAULT_CURRENCY,
    setLanguage: () => { },
    formatPrice: (p) => `Rs. ${p.toLocaleString()}`,
    langCode: "en",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [langCode, setLangCode] = useState<string>("en");
    const [currency, setCurrency] = useState<CurrencyConfig>(DEFAULT_CURRENCY);

    // On mount, read saved language/cookie and set currency accordingly
    useEffect(() => {
        const saved = getSavedLanguage();
        setLangCode(saved);
        setCurrency(getCurrencyForLanguage(saved));
    }, []);

    const setLanguage = useCallback((code: string) => {
        setLangCode(code);
        const cur = getCurrencyForLanguage(code);
        setCurrency(cur);
        saveLanguagePreference(code);
    }, []);

    const formatPrice = useCallback(
        (nprPrice: number) => _formatPrice(nprPrice, currency),
        [currency]
    );

    return (
        <CurrencyContext.Provider value={{ currency, setLanguage, formatPrice, langCode }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
