"use client";

import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import IconFlat from "@/components/IconFlat";
import { haptic } from "@/lib/haptics";
import { PRICE_LABEL, startCheckout } from "@/lib/billing";

const BENEFITS = [
  {
    title: "Every past question, unlocked",
    body: "Years of real papers for your courses — not a sample, the whole archive.",
  },
  {
    title: "Unlimited practice quizzes",
    body: "Generate as many as you want from your own notes and past questions.",
  },
  {
    title: "Know where you actually stand",
    body: "Track your scores per course and see what to fix before the exam, not after.",
  },
  {
    title: "Material the day it drops",
    body: "Lecturer slides and notes, uploaded by your course reps and verified.",
  },
];

/*
 * PLACEHOLDER — replace before launch.
 *
 * These must be real quotes from real people who have SEEN this page and agreed to
 * appear on it. Inventing endorsements from "lecturers" and "course reps" is a
 * fabricated testimonial: it misleads students into paying and it exposes you if a
 * named lecturer ever sees it. The brackets are deliberate, so this cannot be shipped
 * by accident looking legitimate.
 */
const ENDORSEMENTS = [
  {
    name: "[Lecturer's name]",
    role: "Lecturer · [Department]",
    quote: "[Their own words, quoted with their permission.]",
  },
  {
    name: "[Course rep's name]",
    role: "Course Rep · [Course code]",
    quote: "[Their own words, quoted with their permission.]",
  },
];

export default function UpgradePage() {
  const [status, setStatus] = useState<"idle" | "pending" | "unavailable">("idle");

  async function pay() {
    haptic("tap");
    setStatus("pending");
    const result = await startCheckout();
    if (result.ok) {
      window.location.href = result.authorizationUrl;
      return;
    }
    // No provider wired yet — say so plainly rather than faking a success screen.
    setStatus("unavailable");
  }

  return (
    <div className="theme-home mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      <div className="relative z-10">
        <BackHeader title="Upgrade" transparent />
      </div>

      <main className="relative z-10 px-gutter pb-36 pt-1">
        {/* The pitch */}
        <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#4d80bd] via-[#36669c] to-[#22406a] p-5 text-white shadow-[0_18px_40px_-16px_rgba(34,64,106,0.65)] ring-1 ring-inset ring-white/[0.14]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-white"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="up-mint" cx="20" cy="200" r="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3ec995" stopOpacity="0.5" />
                <stop offset="1" stopColor="#3ec995" stopOpacity="0" />
              </radialGradient>
              <pattern
                id="up-lines"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#up-mint)" />
            <rect width="400" height="200" fill="url(#up-lines)" />
          </svg>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.14] px-2.5 py-1 ring-1 ring-inset ring-white/15">
              <span className="material-symbols-outlined icon-filled text-[13px] leading-none text-[#3ec995]">
                bolt
              </span>
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.1em]">
                Qitt Pro
              </span>
            </span>

            <h2 className="mt-3 font-display text-[24px] font-bold leading-tight">
              Stop guessing what&apos;s on the exam.
            </h2>
            <p className="mt-2 font-body text-[13px] font-medium leading-snug text-white/75">
              One semester of everything Qitt has — past questions, unlimited quizzes and
              your real performance — for less than a plate of rice.
            </p>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-[32px] font-bold leading-none">{PRICE_LABEL}</span>
              <span className="font-body text-[12px] font-medium text-white/60">/ semester</span>
            </div>
          </div>
        </section>

        {/* Why pay */}
        <h3 className="mb-3 mt-7 font-display text-[15px] font-bold text-on-surface">
          What you get
        </h3>
        <div className="space-y-2.5">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex gap-3 rounded-2xl bg-surface-container-lowest p-3.5 ring-1 ring-inset ring-black/[0.06] shadow-[0_8px_20px_-14px_rgba(16,24,40,0.2)]"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3ec995]/15">
                <span className="material-symbols-outlined icon-filled text-[15px] leading-none text-[#0f9b6c]">
                  task_alt
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-display text-[13px] font-bold leading-tight text-on-surface">
                  {b.title}
                </p>
                <p className="mt-1 font-body text-[11px] font-medium leading-snug text-on-surface/60">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Endorsements */}
        <h3 className="mb-3 mt-7 font-display text-[15px] font-bold text-on-surface">
          Endorsed on your campus
        </h3>
        <div className="space-y-2.5">
          {ENDORSEMENTS.map((e) => (
            <figure
              key={e.role}
              className="rounded-2xl bg-surface-container-lowest p-3.5 ring-1 ring-inset ring-black/[0.06] shadow-[0_8px_20px_-14px_rgba(16,24,40,0.2)]"
            >
              <blockquote className="font-body text-[12px] font-medium leading-snug text-on-surface/80">
                &ldquo;{e.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-[11px] font-bold text-brand">
                  —
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[12px] font-bold text-on-surface">
                    {e.name}
                  </span>
                  <span className="block truncate font-body text-[10px] font-medium text-on-surface/55">
                    {e.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-brand/[0.06] px-3 py-3">
          <IconFlat name="calendar" size={18} />
          <p className="font-body text-[11px] font-medium text-on-surface/70">
            One payment. Covers the whole semester.
          </p>
        </div>
      </main>

      {/* Pay */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 bg-background px-gutter pb-5 pt-3">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-10 bg-gradient-to-t from-background to-transparent" />

        {status === "unavailable" && (
          <p className="mb-2 text-center font-body text-[11px] font-medium text-error">
            Payments aren&apos;t connected yet — no money was taken.
          </p>
        )}

        <button
          type="button"
          onClick={pay}
          disabled={status === "pending"}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#4d80bd] to-[#22406a] py-4 font-display text-sm font-bold text-white shadow-[0_10px_26px_-10px_rgba(34,64,106,0.8)] ring-1 ring-inset ring-white/15 transition-opacity disabled:opacity-60 squishy-press"
        >
          <span className="material-symbols-outlined icon-filled text-[18px] leading-none text-[#3ec995]">
            bolt
          </span>
          {status === "pending" ? "Starting…" : `Pay ${PRICE_LABEL}`}
        </button>

        <p className="mt-2 text-center font-body text-[10px] font-medium text-on-surface/45">
          Secure payment · Card, transfer or USSD
        </p>
      </div>
    </div>
  );
}
