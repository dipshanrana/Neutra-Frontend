import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Mono, Outfit, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NutriCore | Complete Nutrition Solutions",
  description: "Premium Supplements for a Better You. 100% Natural Ingredients.",
};

import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${spaceMono.variable} ${outfit.variable} ${inter.variable} font-sans antialiased bg-[#ffffff] text-[#252422]`}
      >
        {/* Global SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NutriCore",
              "url": "https://nutricore.com",
              "logo": "https://nutricore.com/logo.png",
              "description": "Premium Supplements for a Better You. 100% Natural Ingredients.",
              "sameAs": [
                "https://instagram.com/nutricore",
                "https://twitter.com/nutricore",
                "https://linkedin.com/company/nutricore"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "NutriCore",
              "url": "https://nutricore.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://nutricore.com/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        <AnalyticsTracker />
        {children}

        {/* Google Translate API Scripts */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }

              // Auto-detection & Banner Force-Removal
              (function() {
                const checkLanguage = () => {
                  const savedLang = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
                  if (!savedLang) {
                    const browserLang = navigator.language.split('-')[0];
                    if (browserLang !== 'en') {
                      document.cookie = "googtrans=/en/" + browserLang + "; path=/";
                      window.location.reload();
                    }
                  }
                };

                const forceHideBanner = () => {
                   const banner = document.querySelector('.goog-te-banner-frame');
                   if (banner) {
                     banner.style.display = 'none';
                     banner.style.visibility = 'hidden';
                     banner.style.height = '0';
                     document.body.style.top = '0';
                     document.body.style.marginTop = '0';
                   }
                };

                // Watch for Google injecting the banner
                const observer = new MutationObserver((mutations) => {
                  forceHideBanner();
                });
                
                if (typeof window !== 'undefined') {
                  checkLanguage();
                  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
                  // Initial check
                  window.addEventListener('load', () => {
                     setInterval(forceHideBanner, 500);
                  });
                }
              })();
            `,
          }}
        />
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        ></script>

        <style dangerouslySetInnerHTML={{
          __html: `
            iframe.goog-te-banner-frame { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; }
            .goog-te-banner-frame.skiptranslate { display: none !important; visibility: hidden !important; }
            .goog-te-banner { display: none !important; }
            .skiptranslate { display: none !important; }
            body { top: 0px !important; margin-top: 0px !important; }
            html { top: 0px !important; margin-top: 0px !important; }
            .goog-te-gadget-icon { display: none !important; }
            .goog-te-gadget-simple {
              background-color: transparent !important;
              border: none !important;
              padding: 0 !important;
              font-family: inherit !important;
              display: flex !important;
              align-items: center !important;
            }
            .goog-te-menu-value {
              margin: 0 !important;
              color: rgba(37, 36, 34, 0.8) !important;
              font-size: 13px !important;
              font-weight: 500 !important;
              display: flex !important;
              align-items: center !important;
              gap: 4px !important;
            }
            .goog-te-menu-value span:first-child {
              border-left: none !important;
            }
            .goog-te-menu-value span:nth-child(3) {
              display: none !important;
            }
            .goog-te-menu-value span:nth-child(5) {
               border-left: none !important;
               color: #38A36D !important;
            }
            /* Hide the tooltips that appear when hovering over translated text */
            #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
            .goog-text-highlight { background: none !important; box-shadow: none !important; }
          `
        }} />
      </body>
    </html>
  );
}



