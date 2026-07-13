"use client";

import { useRouter } from "next/navigation";
import Icon3D from "@/components/Icon3D";
import { haptic } from "@/lib/haptics";

export default function BackHeader({
  title,
  transparent = false,
  home = false,
}: {
  title: string;
  // Opt in on pages with artwork behind the header — the default white bar would
  // otherwise paint over the top of it.
  transparent?: boolean;
  // Swap the back arrow for the 3D house, which goes to the dashboard rather than
  // to the previous page — a home icon that ran router.back() would lie about where
  // it takes you.
  home?: boolean;
}) {
  const router = useRouter();

  return (
    <header className={`w-full top-0 z-40 ${transparent ? "bg-transparent" : "bg-background"}`}>
      <div className="flex items-center gap-3 px-gutter py-4">
        <button
          type="button"
          aria-label={home ? "Go to dashboard" : "Go back"}
          onClick={() => {
            haptic("select");
            if (home) router.push("/");
            else router.back();
          }}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 squishy-press"
        >
          {home ? (
            <Icon3D name="home" size={22} priority />
          ) : (
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
              arrow_back
            </span>
          )}
        </button>
        <h1 className="font-display text-[20px] font-bold text-on-surface">{title}</h1>
      </div>
    </header>
  );
}
