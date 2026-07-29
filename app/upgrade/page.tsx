"use client";

import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import { haptic } from "@/lib/haptics";
import { PRICE_LABEL, startCheckout } from "@/lib/billing";

const BENEFITS = [
  {
    icon: "auto_awesome",
    title: "AI-graded theory answers",
    body: "Write full answers and get them marked instantly, with feedback on what you missed.",
  },
  {
    icon: "history_edu",
    title: "Every past paper, every year",
    body: "Practise a course by its exact session — the whole archive, not just a sample.",
  },
  {
    icon: "bolt",
    title: "Unlimited practice & mock exams",
    body: "No daily limit, plus timed mocks that mirror the real thing.",
  },
  {
    icon: "forum",
    title: "Ask AI anything",
    body: "Get any answer explained, or ask a tutor about your course materials.",
  },
  {
    icon: "insights",
    title: "Know your exam readiness",
    body: "See your weak topics and a readiness score per course before exam day.",
  },
  {
    icon: "library_books",
    title: "Unlimited materials",
    body: "View and download every material, and jump the queue on your requests.",
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
        {/* The pitch — one clean gradient panel, a single soft glow, no busy texture */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4d80bd] via-[#36669c] to-[#22406a] p-6 text-white shadow-[0_20px_44px_-20px_rgba(34,64,106,0.55)]">
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-[#3ec995]/25 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-[25px] font-bold leading-tight">
              Stop guessing what&apos;s on the exam.
            </h2>
            <p className="mt-2 font-body text-[13px] font-medium leading-relaxed text-white/75">
              Every past paper, unlimited practice, AI-marked theory answers and an AI
              tutor — for less than a plate of rice.
            </p>

            <div className="mt-6 flex items-end justify-between border-t border-white/15 pt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[34px] font-bold leading-none">{PRICE_LABEL}</span>
                <span className="font-body text-[12px] font-medium text-white/60">/ semester</span>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-white/90">
                One-time
              </span>
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
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3ec995]/15">
                <span className="material-symbols-outlined icon-filled text-[16px] leading-none text-[#0f9b6c]">
                  {b.icon}
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

        {/* Value statement — the app's own voice, no fabricated testimonials */}
        <div className="mt-7 rounded-2xl bg-[#22406a]/[0.06] p-5 ring-1 ring-inset ring-[#22406a]/10">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22406a]/10">
            <span className="material-symbols-outlined icon-filled text-[19px] leading-none text-[#22406a]">
              school
            </span>
          </span>
          <p className="mt-3 font-display text-[16px] font-bold leading-snug text-on-surface">
            Built around your exact courses.
          </p>
          <p className="mt-1.5 font-body text-[12px] font-medium leading-relaxed text-on-surface/65">
            Not a generic question bank — every past question, material and quiz matches the
            courses you&apos;re actually taking this semester. So every minute you spend is on
            what will really be on your paper.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-brand/[0.06] px-3 py-3">
          <span className="material-symbols-outlined icon-filled text-[17px] leading-none text-brand">
            calendar_month
          </span>
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
          className="flex w-full items-center justify-center rounded-2xl bg-[#22406a] py-4 font-display text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(34,64,106,0.7)] transition-opacity hover:bg-[#1b3357] disabled:opacity-60 squishy-press"
        >
          {status === "pending" ? "Starting…" : `Pay ${PRICE_LABEL}`}
        </button>

        <p className="mt-2 text-center font-body text-[10px] font-medium text-on-surface/45">
          Secure payment · Card, transfer or USSD
        </p>
      </div>
    </div>
  );
}
