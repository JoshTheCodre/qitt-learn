export type Theme = "light" | "dark" | "system";

const KEY = "qitt_theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const t = localStorage.getItem(KEY);
  return t === "light" || t === "dark" || t === "system" ? t : "system";
}

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolvedIsDark(theme: Theme): boolean {
  return theme === "dark" || (theme === "system" && systemPrefersDark());
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolvedIsDark(theme));
}

export function setTheme(theme: Theme) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }
  applyTheme(theme);
}
