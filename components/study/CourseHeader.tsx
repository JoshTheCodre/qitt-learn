"use client";

import { useRouter } from "next/navigation";

export default function CourseHeader({ code, units }: { code: string; units: string }) {
  const router = useRouter();

  return (
    <header className="w-full top-0 z-40 bg-background">
      <div className="flex items-center justify-between px-gutter py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors squishy-press"
          >
            <span className="material-symbols-outlined text-on-surface leading-none">arrow_back</span>
          </button>
          <h1 className="font-display text-[20px] font-bold text-on-surface">{code}</h1>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/5 text-primary font-display text-xs font-semibold">
          {units}
        </span>
      </div>
    </header>
  );
}
