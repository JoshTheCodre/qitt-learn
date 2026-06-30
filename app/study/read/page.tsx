"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUMMARY = [
  "Systems thinking is an approach to analysis that focuses on the way a system's parts interrelate and how systems work over time and within the context of larger systems.",
  "A 'prop' (proposition) is a declarative statement that is either true or false. Propositional logic combines props using connectives — AND, OR, NOT, and IMPLIES — to build complex expressions.",
  "Together, systems thinking and propositional reasoning let us model real-world behaviour: define the components, state the rules that connect them, then reason about outcomes.",
];

const EASY = [
  "Systems thinking just means looking at the whole picture. Instead of studying one part alone, you see how all the parts work together over time.",
  "A 'prop' is just a sentence that is either true or false. We join props with simple words like AND, OR and NOT to make bigger ideas.",
  "Put together: list the parts, write the rules that link them, then work out what happens. That's the core of this topic — keep it simple.",
];

export default function StudyReadPage() {
  const router = useRouter();
  const [easy, setEasy] = useState(false);
  const [page, setPage] = useState(0);

  const pages = easy ? EASY : SUMMARY;
  const isLast = page >= pages.length - 1;

  return (
    <div className="mx-auto w-full max-w-[480px] bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20 flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-gutter py-4 shrink-0">
        <button
          type="button"
          aria-label="Close"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 squishy-press"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
            close
          </span>
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-[18px] font-bold text-on-surface leading-tight">
            CSC 202.2
          </h1>
          <p className="font-display text-xs font-medium text-on-surface-variant">
            Study mode · {easy ? "Easy Read" : "Summary"}
          </p>
        </div>
      </header>

      {/* Reading content */}
      <main className="flex-1 overflow-y-auto px-gutter no-scrollbar">
        <article className="py-2 space-y-5">
          <h2 className="font-display text-[22px] font-bold text-on-surface leading-tight">
            Systems Thinking and Props
          </h2>
          <p className="font-body text-[17px] leading-8 text-on-surface">{pages[page]}</p>
        </article>
      </main>

      {/* Bottom bar */}
      <div className="shrink-0 px-gutter py-3 border-t border-outline-variant/20 bg-background flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setEasy((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 text-primary px-3 py-2 font-display text-xs font-semibold squishy-press"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">
            {easy ? "subject" : "auto_stories"}
          </span>
          {easy ? "Switch to Summary" : "Switch to Easy Read"}
        </button>

        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-medium text-on-surface-variant">
            Page {page + 1} of {pages.length}
          </span>
          <button
            type="button"
            aria-label="Next page"
            disabled={isLast}
            onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
            className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-30 squishy-press"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">expand_more</span>
          </button>
        </div>
      </div>
    </div>
  );
}
