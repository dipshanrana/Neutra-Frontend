import type { Metadata } from "next";
import { Outfit, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriCore | Complete Nutrition Solutions",
  description: "Premium Supplements for a Better You. 100% Natural Ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased bg-[#ffffff] text-[#1D3557]`}
      >
        {children}
      </body>
    </html>
  );
}
