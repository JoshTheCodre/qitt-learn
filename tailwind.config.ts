import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Themable slots. They fall back to the existing primary blue, so a component
        // using `brand`/`accent` looks identical everywhere EXCEPT inside a scope that
        // overrides the vars (`.theme-home`). That's what keeps the homepage palette
        // from leaking into the 15 other pages sharing Header/BottomNav/CourseList.
        // Channel triplets (not hex) so Tailwind's /opacity modifiers still work.
        brand: "rgb(var(--brand-rgb, 37 99 235) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb, 16 185 129) / <alpha-value>)",
        "on-secondary-fixed-variant": "#4a4737",
        "on-primary-container": "#afb7ff",
        "inverse-surface": "#2f3133",
        background: "#ffffff",
        "surface-container": "#eeeef0",
        "secondary-fixed-dim": "#ccc7b2",
        "secondary-container": "#e8e3cd",
        "surface-container-low": "#f3f3f6",
        "on-surface": "#1a1c1e",
        "inverse-on-surface": "#f0f0f3",
        "on-error-container": "#93000a",
        "surface-container-high": "#e8e8ea",
        "on-tertiary-container": "#b2bfbb",
        "on-primary": "#ffffff",
        error: "#ba1a1a",
        "surface-container-highest": "#e2e2e5",
        "on-secondary": "#ffffff",
        "on-primary-fixed": "#000c61",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed": "#e8e3cd",
        "on-tertiary-fixed-variant": "#3d4947",
        surface: "#ffffff",
        "on-secondary-container": "#686554",
        "inverse-primary": "#bcc2ff",
        "on-primary-fixed-variant": "#0026d6",
        "on-tertiary-fixed": "#121e1c",
        tertiary: "#2c3735",
        outline: "#757688",
        primary: "#2563eb",
        "surface-dim": "#dadadc",
        "primary-fixed-dim": "#bcc2ff",
        "on-secondary-fixed": "#1e1c0f",
        "surface-bright": "#ffffff",
        "primary-container": "#1d4ed8",
        "tertiary-fixed": "#d8e5e1",
        "on-tertiary": "#ffffff",
        secondary: "#625f4e",
        "on-surface-variant": "#444656",
        "on-error": "#ffffff",
        "on-background": "#1a1c1e",
        "surface-tint": "#2a44f4",
        "primary-fixed": "#dfe0ff",
        "error-container": "#ffdad6",
        "outline-variant": "#c5c5d9",
        "tertiary-container": "#424e4b",
        "surface-variant": "#e2e2e5",
        "tertiary-fixed-dim": "#bcc9c6",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        gutter: "12px",
        "container-padding-mobile": "20px",
        unit: "8px",
        "section-gap": "64px",
        "container-padding-desktop": "40px",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
        body: ["var(--font-body)", "var(--font-display)", "sans-serif"],
      },
      fontSize: {
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        display: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.2", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};

export default config;
