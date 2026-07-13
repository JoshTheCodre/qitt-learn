import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Chillax (Fontshare) — one family across the whole platform, driving both the
// display and body variables. Replaces the Atyp TRIAL cuts, which were not
// licensed for production use.
//
// woff2 rather than the old OTFs: ~20KB per weight instead of ~100KB+.
//
// The src/fallback arrays are duplicated across the two calls on purpose: next/font
// is an SWC compile-time plugin, and its arguments must be inline literals. Hoisting
// them into a shared const fails the build with "Font loader values must be
// explicitly written literals" — and TypeScript will not warn you, because it's a
// compiler-plugin rule, not a type rule.
const chillaxBody = localFont({
  src: [
    { path: "../public/fonts/Chillax-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Chillax-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Chillax-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Chillax-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

const chillaxDisplay = localFont({
  src: [
    { path: "../public/fonts/Chillax-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Chillax-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Chillax-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Chillax-700.woff2", weight: "700", style: "normal" },
    // 800 maps to the heaviest cut Chillax ships, rather than letting the browser
    // synthesise a faux-bold.
    { path: "../public/fonts/Chillax-700.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

// Self-hosted + preloaded so icons paint with the first render instead of waiting on
// a Google Fonts round trip. Subset to the icons this app actually uses (see
// scripts note in globals.css) — add a new icon to the app, refresh this file.
// display:"block" keeps the ligature text hidden until the font lands, so you never
// see the raw word ("home", "calendar_today") flash in place of the glyph.
const materialSymbols = localFont({
  src: "../public/fonts/material-symbols-outlined.woff2",
  variable: "--font-icons",
  display: "block",
  weight: "400",
  style: "normal",
  preload: true,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Qitt",
  description: "Your AI-powered academic assistant.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    shortcut: "/favicon_io/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`light ${chillaxDisplay.variable} ${chillaxBody.variable} ${materialSymbols.variable}`}
    >
      <body className="bg-background text-on-surface font-body text-base min-h-screen">
        {children}
      </body>
    </html>
  );
}
