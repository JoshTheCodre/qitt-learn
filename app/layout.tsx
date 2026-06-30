import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const atypText = localFont({
  src: [
    { path: "../public/fonts/AtypTextTRIAL-Regular-BF65727125ea126.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/AtypTextTRIAL-Medium-BF65727125d9c4c.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/AtypTextTRIAL-Semibold-BF65727125e65f1.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/AtypTextTRIAL-Bold-BF65727125ceed1.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

const atypDisplay = localFont({
  src: [
    { path: "../public/fonts/AtypDisplayTRIAL-Regular-BF65727125d566e.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/AtypDisplayTRIAL-Medium-BF65727125b8683.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/AtypDisplayTRIAL-Semibold-BF65727125c6fc9.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/AtypDisplayTRIAL-Bold-BF65727125c8d1d.otf", weight: "700", style: "normal" },
    // Map extrabold (800) to the heaviest available weight instead of faux-bolding
    { path: "../public/fonts/AtypDisplayTRIAL-Bold-BF65727125c8d1d.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
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
    <html lang="en" className={`light ${atypDisplay.variable} ${atypText.variable}`}>
      <body className="bg-background text-on-surface font-body text-base min-h-screen">
        {children}
      </body>
    </html>
  );
}
