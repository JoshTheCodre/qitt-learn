"use client";

import { useEffect } from "react";
import { getTheme, applyTheme } from "@/lib/theme";

// Keeps the applied theme in sync — re-applies on mount, and follows the OS setting live
// while the user is on "system".
export default function ThemeWatcher() {
  useEffect(() => {
    applyTheme(getTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return null;
}
