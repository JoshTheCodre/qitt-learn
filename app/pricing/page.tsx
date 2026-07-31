import Link from "next/link";
import { PRICE_LABEL } from "@/lib/billing";

// Marketing pricing page — same editorial aesthetic as the landing page. Static: the two
// CTAs just route to sign-up (Free) and the upgrade/checkout flow (Pro).

const FREE = [
  "CGPA calculator, timetable & calendar",
  "Your course list & carryovers",
  "A daily set of practice questions",
  "Self-marked theory questions",
  "View a few materials each day",
];

const PRO = [
  "Everything in Free",
  "AI-graded theory answers, with feedback",
  "Every past paper, every year",
  "Unlimited practice & timed mock exams",
  "Ask AI to explain any answer",
  "Exam-readiness insights per course",
  "Unlimited materials + priority requests",
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 shrink-0 ${className}`} aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f0e8] text-[#1a1712]">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="font-display text-[20px] font-extrabold tracking-tight">
          Qitt
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2.5 font-display text-[13px] font-bold text-[#1a1712] transition-colors hover:bg-[#1a1712]/[0.06] squishy-press"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#1a1712] px-5 py-2.5 font-display text-[13px] font-bold text-[#f4f0e8] transition-transform hover:-translate-y-px squishy-press"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-8 text-center lg:px-8 lg:pt-14">
        <span className="inline-block rotate-[-2deg] rounded-full bg-[#f4a9c4] px-3 py-1 font-display text-[12px] font-bold text-[#1a1712] shadow-sm">
          Simple pricing
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl font-display text-[36px] font-extrabold leading-[1.04] tracking-tight sm:text-[52px]">
          One price. The whole{" "}
          <span className="relative whitespace-nowrap">
            semester
            <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#f4a9c4]" />
          </span>
          .
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body text-[15px] font-medium text-[#1a1712]/60">
          Start free. Go Pro for less than a plate of rice and unlock every past paper, unlimited
          practice and AI marking.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-4xl px-5 pb-10 pt-10 lg:px-8">
        <div className="grid items-start gap-5 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-[24px] bg-white p-6 ring-1 ring-inset ring-[#1a1712]/10 shadow-[0_20px_44px_-28px_rgba(26,23,18,0.35)]">
            <p className="font-display text-[13px] font-bold uppercase tracking-wide text-[#1a1712]/50">
              Free
            </p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-[38px] font-extrabold leading-none">₦0</span>
              <span className="font-body text-[12px] font-medium text-[#1a1712]/50">forever</span>
            </div>
            <p className="mt-2 font-body text-[12px] font-medium text-[#1a1712]/55">
              Everything you need to stay organised this semester.
            </p>
            <ul className="mt-5 space-y-2.5">
              {FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 text-[#0f9b6c]" />
                  <span className="font-body text-[13px] font-medium leading-snug text-[#1a1712]/80">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-6 flex w-full items-center justify-center rounded-full border border-[#1a1712]/20 py-3 font-display text-[14px] font-bold text-[#1a1712] transition-colors hover:bg-[#1a1712]/[0.04] squishy-press"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#14140f] p-6 text-[#f4f0e8] shadow-[0_28px_56px_-24px_rgba(26,23,18,0.55)]">
            <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[#3ec995]/15 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <p className="font-display text-[13px] font-bold uppercase tracking-wide text-[#d4f000]">
                Pro
              </p>
              <span className="rounded-full bg-[#d4f000] px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-[#14140f]">
                Most popular
              </span>
            </div>
            <div className="relative mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-[38px] font-extrabold leading-none">{PRICE_LABEL}</span>
              <span className="font-body text-[12px] font-medium text-white/55">/ semester</span>
            </div>
            <p className="relative mt-2 font-body text-[12px] font-medium text-white/60">
              One payment. No subscription, no surprise charges.
            </p>
            <ul className="relative mt-5 space-y-2.5">
              {PRO.map((f, i) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 text-[#d4f000]" />
                  <span
                    className={`font-body text-[13px] leading-snug ${
                      i === 0 ? "font-bold text-white" : "font-medium text-white/85"
                    }`}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/upgrade"
              className="relative mt-6 flex w-full items-center justify-center rounded-full bg-[#f4a9c4] py-3 font-display text-[14px] font-bold text-[#1a1712] transition-transform hover:-translate-y-px squishy-press"
            >
              Go Pro
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center font-body text-[12px] font-medium text-[#1a1712]/50">
          Pay with card, bank transfer or USSD · Covers you through exams
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-6 border-t border-[#1a1712]/10 bg-[#f4f0e8] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="font-display text-[16px] font-extrabold tracking-tight">
            Qitt
          </Link>

          <a
            href="https://wa.me/2349034954069"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366]/12 px-4 py-2 font-display text-[13px] font-bold text-[#0f7a3d] transition-colors hover:bg-[#25D366]/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>

          <p className="font-body text-[12px] font-medium text-[#1a1712]/50">
            © {"2026"} Qitt · Built for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
