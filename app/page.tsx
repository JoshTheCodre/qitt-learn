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

// Real numbers from the question bank + material library — rounded down, never inflated.
const STATS = [
  { value: "20,000+", label: "Practice questions" },
  { value: "500+", label: "Past exam papers" },
  { value: "120+", label: "Courses covered" },
  { value: "200+", label: "Study materials" },
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
          <Link href="/pricing" className="transition-colors hover:text-[#1a1712]">Pricing</Link>
        </nav>
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

      {/* Stats — the real size of the question bank, the core reason to sign up */}
      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <h2 className="font-display text-[24px] font-extrabold leading-tight tracking-tight sm:text-[34px]">
          Enough to walk in{" "}
          <span className="relative whitespace-nowrap">
            prepared
            <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#f4a9c4]" />
          </span>
          .
        </h2>
        <p className="mt-3 max-w-md font-body text-[14px] font-medium text-[#1a1712]/60">
          Thousands of real past questions and materials for your courses — everything you need
          to practise until passing is the only outcome left.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-[42px] font-black leading-none tracking-tight text-[#1a1712] sm:text-[52px]">
                {s.value}
              </p>
              <p className="mt-2 font-body text-[12px] font-semibold uppercase tracking-wide text-[#1a1712]/50">
                {s.label}
              </p>
            </div>
          ))}
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
              <p className="max-w-[210px] font-body text-[13px] font-medium text-[#1a1712]/70">
                Built around real Uniport courses — not generic exam prep.
              </p>
            </div>
            <div className="mt-8">
              <p className="font-display text-[56px] font-black leading-none tracking-tight text-[#1a1712]">
                20k+
              </p>
              <p className="mt-2 font-body text-[12px] font-semibold uppercase tracking-wide text-[#1a1712]/55">
                Questions ready to practise
              </p>
            </div>
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
        <p className="mt-5">
          <Link
            href="/pricing"
            className="font-display text-[13px] font-bold text-[#1a1712]/70 underline decoration-[#f4a9c4] decoration-2 underline-offset-4 transition-colors hover:text-[#1a1712]"
          >
            See pricing &amp; plans
          </Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1712]/10 bg-[#f4f0e8] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-5">
            <span className="font-display text-[16px] font-extrabold tracking-tight">Qitt</span>
            <Link
              href="/pricing"
              className="font-display text-[13px] font-semibold text-[#1a1712]/60 transition-colors hover:text-[#1a1712]"
            >
              Pricing
            </Link>
            <Link
              href="/copyright"
              className="font-display text-[13px] font-semibold text-[#1a1712]/60 transition-colors hover:text-[#1a1712]"
            >
              Copyright
            </Link>
            <Link
              href="/privacy"
              className="font-display text-[13px] font-semibold text-[#1a1712]/60 transition-colors hover:text-[#1a1712]"
            >
              Privacy
            </Link>
          </div>

          <a
            href="https://wa.me/2348078350344"
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
