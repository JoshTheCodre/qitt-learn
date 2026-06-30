"use client";

import { useRouter } from "next/navigation";

export default function BackHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="w-full top-0 z-40 bg-background">
      <div className="flex items-center gap-3 px-gutter py-4">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 squishy-press"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
            arrow_back
          </span>
        </button>
        <h1 className="font-display text-[20px] font-bold text-on-surface">{title}</h1>
      </div>
    </header>
  );
}
