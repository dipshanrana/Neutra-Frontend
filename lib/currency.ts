// Currency configuration mapped to language codes
// Prices in the DB are stored in NPR (Nepalese Rupee) as the base currency.
// All exchange rates are relative to NPR.

export interface CurrencyConfig {
    code: string;       // ISO 4217 currency code
    symbol: string;     // Display symbol
    name: string;       // Full currency name
    rate: number;       // How many units of this currency = 1 NPR
    locale: string;     // Locale to use for number formatting
}

// Base currency is USD (rate = 1.0) — admin inputs prices in US Dollars.
// All exchange rates represent: 1 USD = X units of that currency.
// Update rates as needed to keep them current.
export const LANGUAGE_CURRENCY_MAP: Record<string, CurrencyConfig> = {
    en: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, locale: 'en-US' },
    ne: { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee', rate: 133.0, locale: 'ne-NP' },
    hi: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.0, locale: 'hi-IN' },
    es: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, locale: 'en-US' },
    fr: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'fr-FR' },
    de: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE' },
    'zh-CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.2, locale: 'zh-CN' },
    ja: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.0, locale: 'ja-JP' },
};

// Default currency fallback (English = USD)
export const DEFAULT_CURRENCY: CurrencyConfig = LANGUAGE_CURRENCY_MAP['en'];

export const CURRENCY_STORAGE_KEY = 'preferred_currency_code';
export const LANGUAGE_STORAGE_KEY = 'preferred_language_code';

/**
 * Get the current language code from the googtrans cookie.
 */
export function getCurrentLanguageFromCookie(): string {
    if (typeof document === 'undefined') return 'en';
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('googtrans='));
    if (!cookie) return 'en';
    // Format: /en/ne or /en/zh-CN
    const parts = cookie.split('=')[1]?.split('/');
    return parts?.[2] || 'en';
}

/**
 * Get the CurrencyConfig for a given language code.
 */
export function getCurrencyForLanguage(langCode: string): CurrencyConfig {
    return LANGUAGE_CURRENCY_MAP[langCode] || DEFAULT_CURRENCY;
}

/**
 * Save the user's preferred language to localStorage.
 */
export function saveLanguagePreference(langCode: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    localStorage.setItem(CURRENCY_STORAGE_KEY, langCode); // Store lang code, currency derived from it
}

/**
 * Get the browser's preferred language and map it to a supported language code.
 * navigator.language returns codes like 'en-US', 'hi-IN', 'zh-CN', 'ne', 'fr', etc.
 */
export function getBrowserLanguage(): string {
    if (typeof navigator === 'undefined') return 'en';

    // navigator.languages is a priority list; navigator.language is the first one
    const langs = navigator.languages?.length
        ? [...navigator.languages]
        : [navigator.language || 'en'];

    for (const lang of langs) {
        // 1. Try the full tag (e.g. 'zh-CN')
        if (LANGUAGE_CURRENCY_MAP[lang]) return lang;

        // 2. Try just the base language (e.g. 'en' from 'en-US')
        const base = lang.split('-')[0];
        if (LANGUAGE_CURRENCY_MAP[base]) return base;
    }

    return 'en'; // ultimate fallback
}

/**
 * Get the language to use for currency, with priority:
 * 1. Explicit user choice stored in localStorage
 * 2. Active Google Translate cookie (page was already translated)
 * 3. Browser's preferred language (navigator.language)
 * 4. Default: 'en' (NPR)
 */
export function getSavedLanguage(): string {
    if (typeof localStorage === 'undefined') return 'en';
    // 1. Explicit user choice
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && LANGUAGE_CURRENCY_MAP[saved]) return saved;
    // 2. Active Google Translate cookie
    const fromCookie = getCurrentLanguageFromCookie();
    if (fromCookie !== 'en' && LANGUAGE_CURRENCY_MAP[fromCookie]) return fromCookie;
    // 3. Browser preferred language
    return getBrowserLanguage();
}

/**
 * Convert a price from NPR (base) to the target currency.
 */
export function convertPrice(nprPrice: number, currency: CurrencyConfig): number {
    return nprPrice * currency.rate;
}

/**
 * Format a price value with the currency symbol.
 * @param nprPrice - Price in NPR (base currency from backend)
 * @param currency - Target currency config
 */
export function formatPrice(nprPrice: number, currency: CurrencyConfig): string {
    const converted = convertPrice(nprPrice, currency);
    const formatted = converted.toLocaleString(currency.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: currency.rate < 0.01 ? 2 : 0,
    });
    return `${currency.symbol} ${formatted}`;
}
