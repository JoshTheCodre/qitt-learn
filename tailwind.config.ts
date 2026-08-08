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

        // Themed via CSS vars (see globals.css) so a single `.dark` class flips the whole
        // app. Light values are unchanged from before, so light mode looks identical.
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--surface-container-lowest-rgb) / <alpha-value>)",
        "surface-container-low": "rgb(var(--surface-container-low-rgb) / <alpha-value>)",
        "surface-container": "rgb(var(--surface-container-rgb) / <alpha-value>)",
        "surface-container-high": "rgb(var(--surface-container-high-rgb) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--surface-container-highest-rgb) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant-rgb) / <alpha-value>)",
        "surface-dim": "rgb(var(--surface-dim-rgb) / <alpha-value>)",
        "surface-bright": "rgb(var(--surface-bright-rgb) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface-rgb) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant-rgb) / <alpha-value>)",
        "on-background": "rgb(var(--on-background-rgb) / <alpha-value>)",
        outline: "rgb(var(--outline-rgb) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant-rgb) / <alpha-value>)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary-rgb) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container-rgb) / <alpha-value>)",
        error: "rgb(var(--error-rgb) / <alpha-value>)",
        "on-error": "rgb(var(--on-error-rgb) / <alpha-value>)",
        "error-container": "rgb(var(--error-container-rgb) / <alpha-value>)",
        "on-error-container": "rgb(var(--on-error-container-rgb) / <alpha-value>)",

        // Rarely-used Material tokens — kept as fixed light values.
        "on-secondary-fixed-variant": "#4a4737",
        "on-primary-container": "#afb7ff",
        "inverse-surface": "#2f3133",
        "secondary-fixed-dim": "#ccc7b2",
        "secondary-container": "#e8e3cd",
        "inverse-on-surface": "#f0f0f3",
        "on-tertiary-container": "#b2bfbb",
        "on-secondary": "#ffffff",
        "on-primary-fixed": "#000c61",
        "secondary-fixed": "#e8e3cd",
        "on-tertiary-fixed-variant": "#3d4947",
        "on-secondary-container": "#686554",
        "inverse-primary": "#bcc2ff",
        "on-primary-fixed-variant": "#0026d6",
        "on-tertiary-fixed": "#121e1c",
        tertiary: "#2c3735",
        "primary-fixed-dim": "#bcc2ff",
        "on-secondary-fixed": "#1e1c0f",
        "tertiary-fixed": "#d8e5e1",
        "on-tertiary": "#ffffff",
        secondary: "#625f4e",
        "surface-tint": "#2a44f4",
        "primary-fixed": "#dfe0ff",
        "tertiary-container": "#424e4b",
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
