import Link from "next/link";
import { avatarUrl, type AvatarStyle } from "@/lib/avatars";

// Editorial landing, inspired by bold fintech marketing pages: warm cream canvas,
// oversized question headlines, floating pill tags + avatar clusters, a dark numbered
// section and a pink accent block. Adapted for a student study app.

// DiceBear avatar icons stand in for student photos — the same avatar system used in
// the register picker, so the brand feels consistent from landing to sign-up.
const CLUSTER: { style: AvatarStyle; seed: string; bg: string }[] = [
  { style: "adventurer", seed: "amara", bg: "f4a9c4" }, // pink
  { style: "big-smile", seed: "chidi", bg: "f6c453" }, // yellow
  { style: "fun-emoji", seed: "zainab", bg: "8bd3a0" }, // green
  { style: "micah", seed: "tunde", bg: "7ca8e6" }, // blue
];

const FEATURE_STRIP = [
  "Past Questions",
  "Instant Quizzes",
  "Performance",
  "Course Materials",
  "AI Summaries",
];

const SECTIONS = [
  { n: "01", label: "Study" },
  { n: "02", label: "Practice" },
  { n: "03", label: "Performance" },
  { n: "04", label: "Materials" },
];

function AvatarCluster({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center">
      {CLUSTER.map((a, i) => (
        <span
          key={i}
          className={`h-8 w-8 overflow-hidden rounded-full ring-2 ${
            dark ? "ring-[#14140f]" : "ring-[#f4f0e8]"
          } ${i > 0 ? "-ml-2.5" : ""}`}
          style={{ backgroundColor: `#${a.bg}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl(a.style, a.seed, a.bg)} alt="" className="h-full w-full object-cover" />
        </span>
      ))}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f0e8] text-[#1a1712]">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
        <span className="font-display text-[20px] font-extrabold tracking-tight">Qitt</span>
        <nav className="hidden items-center gap-8 font-display text-[14px] font-semibold text-[#1a1712]/70 md:flex">
          <Link href="/register" className="transition-colors hover:text-[#1a1712]">Study</Link>
          <Link href="/register" className="transition-colors hover:text-[#1a1712]">Practice</Link>
          <Link href="/register" className="transition-colors hover:text-[#1a1712]">Courses</Link>
          <Link href="/register" className="transition-colors hover:text-[#1a1712]">Performance</Link>
        </nav>
        <Link
          href="/register"
          className="rounded-full bg-[#1a1712] px-5 py-2.5 font-display text-[13px] font-bold text-[#f4f0e8] transition-transform hover:-translate-y-px squishy-press"
        >
          Create account
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-8 lg:px-8 lg:pt-14">
        <div className="relative">
          {/* floating tags */}
          <span className="absolute -top-2 left-0 hidden rotate-[-4deg] rounded-full bg-[#f4a9c4] px-3 py-1 font-display text-[12px] font-bold text-[#1a1712] shadow-sm sm:inline-block">
            Smart Study
          </span>
          <span className="absolute right-2 top-16 hidden rotate-[5deg] rounded-full bg-[#1a1712] px-3 py-1 font-display text-[12px] font-bold text-[#d4f000] shadow-sm sm:inline-block">
            Instant Quizzes
          </span>

          <h1 className="max-w-4xl font-display text-[38px] font-extrabold leading-[1.02] tracking-tight sm:text-[56px] lg:text-[72px]">
            Can one app
            <span className="mx-3 inline-flex translate-y-1 align-middle">
              <AvatarCluster />
            </span>
            change how you{" "}
            <span className="relative whitespace-nowrap">
              study
              <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#f4a9c4]" />
            </span>
            ?
          </h1>

          <p className="mt-5 max-w-md font-body text-[15px] font-medium text-[#1a1712]/60 lg:text-[16px]">
            Study, practice and track your progress — all from one place, built for students.
          </p>
        </div>

        {/* Hero product card */}
        <div className="relative mx-auto mt-10 max-w-[560px]">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#e0876f] via-[#c9506a] to-[#1a1712] p-6 shadow-[0_30px_60px_-24px_rgba(26,23,18,0.5)]">
            {/* concentric rings, echoing the "clearly organized" idea */}
            <svg
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 text-white/10"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1" />
            </svg>

            {/* Brand row: real logo mark + wordmark */}
            <div className="relative flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/qitt-logo.png" alt="Qitt" className="h-full w-full object-cover" />
                </span>
                <span className="font-display text-[16px] font-extrabold tracking-tight text-[#f4f0e8]">
                  Qitt
                </span>
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-white/90 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
                Study Tools
              </span>
            </div>

            {/* Floating glass preview — makes the card read as a real product */}
            <div className="relative mt-6 rounded-2xl bg-white/[0.14] p-3.5 ring-1 ring-inset ring-white/20 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="font-body text-[10px] font-semibold uppercase tracking-wide text-white/70">
                  Average Score
                </span>
                <span className="rounded-full bg-[#d4f000] px-2 py-0.5 font-display text-[9px] font-bold text-[#14140f]">
                  +12%
                </span>
              </div>
              <p className="mt-1 font-display text-[28px] font-extrabold leading-none text-white">82%</p>
              <div className="mt-3 space-y-1.5">
                {[
                  ["CSC 202.2", "18/20"],
                  ["MTH 201.1", "14/15"],
                ].map(([c, s]) => (
                  <div
                    key={c}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1.5"
                  >
                    <span className="font-display text-[11px] font-semibold text-white/90">{c}</span>
                    <span className="font-display text-[11px] font-bold text-[#d4f000]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-5 flex items-end justify-between">
              <p className="font-display text-[15px] font-bold leading-tight text-[#f4f0e8]">
                Your semester,
                <br />
                clearly organized.
              </p>
              <Link
                href="/register"
                className="shrink-0 rounded-full bg-[#f4a9c4] px-4 py-2 font-display text-[13px] font-bold text-[#1a1712] transition-transform hover:-translate-y-px squishy-press"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mt-8 bg-[#14140f] py-4 text-[#f4f0e8]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 lg:px-8">
          {FEATURE_STRIP.map((f, i) => (
            <span key={f} className="flex items-center gap-5 font-display text-[13px] font-semibold">
              {i > 0 && <span className="text-[#d4f000]">✳</span>}
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Numbered dark section */}
      <section className="bg-[#14140f] px-5 pb-16 pt-10 text-[#f4f0e8] lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 pt-6">
            <p className="max-w-xs font-body text-[12px] font-semibold uppercase tracking-wide text-white/50">
              Built for clarity, focus and every exam
            </p>
            <p className="max-w-xs font-body text-[12px] font-semibold uppercase tracking-wide text-white/50">
              Can one study app change your whole semester?
            </p>
          </div>

          <div className="mt-10">
            {SECTIONS.map((s) => (
              <Link
                key={s.n}
                href="/register"
                className="group flex items-baseline gap-4 border-b border-white/10 py-3"
              >
                <span className="font-display text-[13px] font-semibold text-[#d4f000]">{s.n}</span>
                <span className="font-display text-[40px] font-extrabold leading-none tracking-tight text-white/35 transition-colors group-hover:text-[#f4f0e8] sm:text-[56px]">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pink accent section */}
      <section className="bg-[#f4a9c4] px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[30px] font-extrabold leading-[1.05] tracking-tight text-[#1a1712] sm:text-[42px]">
              Can a single app change how a whole class prepares?
            </h2>
            <div className="mt-8 flex items-center gap-3">
              <AvatarCluster dark />
              <p className="max-w-[200px] font-body text-[13px] font-medium text-[#1a1712]/70">
                Students building better study habits every day.
              </p>
            </div>
            <p className="mt-8 font-display text-[56px] font-black leading-none tracking-tight text-[#1a1712]">
              12k+
            </p>
          </div>

          {/* mock score card — full width on mobile, capped and centred on larger screens */}
          <div className="w-full rounded-[24px] bg-[#14140f] p-6 text-[#f4f0e8] shadow-[0_24px_50px_-20px_rgba(26,23,18,0.5)] sm:w-auto sm:min-w-[320px] sm:justify-self-center">
            <div className="flex items-center justify-between">
              <span className="font-display text-[15px] font-bold">Qitt</span>
              <span className="rounded-full bg-[#d4f000] px-2.5 py-0.5 font-display text-[10px] font-bold text-[#14140f]">
                Pro
              </span>
            </div>
            <p className="mt-6 font-body text-[11px] font-medium uppercase tracking-wide text-white/50">
              Average Score
            </p>
            <p className="mt-1 font-display text-[38px] font-extrabold leading-none">82%</p>
            <div className="mt-5 rounded-2xl bg-[#5a2540] px-4 py-3">
              <p className="font-display text-[13px] font-bold text-[#f4a9c4]">Study Goal</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-3/4 rounded-full bg-[#f4a9c4]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#f4f0e8] px-5 py-16 text-center lg:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-[28px] font-extrabold leading-tight tracking-tight sm:text-[40px]">
          Ready to be better prepared than the rest?
        </h2>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-[#1a1712] px-7 py-3.5 font-display text-[14px] font-bold text-[#f4f0e8] transition-transform hover:-translate-y-px squishy-press"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[#1a1712]/20 px-7 py-3.5 font-display text-[14px] font-bold text-[#1a1712] transition-colors hover:bg-[#1a1712]/[0.04] squishy-press"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1712]/10 bg-[#f4f0e8] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="font-display text-[16px] font-extrabold tracking-tight">Qitt</span>
          <p className="font-body text-[12px] font-medium text-[#1a1712]/50">
            © {"2026"} Qitt · Built for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
