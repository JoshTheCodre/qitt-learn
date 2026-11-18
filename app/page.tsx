import Link from "next/link";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";
import { avatarUrl } from "@/lib/avatars";

// Landing page. The skeleton is institutional (announcement bar, framed hero, mono
// eyebrow labels, hairline grids, numbered pillars, numbers band, manifesto); the
// personality is playful (picture tiles inside the headline, floating 3D objects with
// name tags, a marker highlight, tilted colour cards of things Qitt says to you).
// The content is Qitt's own: student management, learning and AI-powered academic
// support in one platform. Positioning: "Your academic life, organised."
//
// Palette — built outward from the logo blue, nothing grey or muted:
//   cobalt   #0a1c9c   page backdrop
//   royal    #0b2be0   the Qitt logo blue
//   electric #1238f5   panels on the backdrop
//   bright   #2f5bff   interactive blue
//   sky      #8fb0ff   labels and lines on blue
//   mist     #eaf0ff   tinted surfaces on white
//   paper    #f6f8ff   light canvas
//   ink      #0a1245   text on light
//   amber    #ffb938   primary accent (the complement of the blue)
//   aqua     #45e3ff   |
//   pink     #ff7ab6   | supporting accents, used to colour-code
//   mint     #5ff0b0   |

const NAV = [
  { label: "Platform", href: "#platform" },
  { label: "Materials", href: "#materials" },
  { label: "Success", href: "#success" },
  { label: "Numbers", href: "#numbers" },
  { label: "Pricing", href: "/pricing" },
];

const TICKER = ["Timetable", "Assignments", "Materials", "Past Questions", "AI Helper", "Progress"];

// The three pillars, each with its three modules.
const PILLARS = [
  {
    n: "01",
    icon: "home" as Icon3DName,
    color: "#ffb938",
    title: "Student Management",
    lead: "Stay on top of the semester.",
    items: [
      { name: "Timetable", body: "Class schedules and the academic calendar." },
      { name: "Assignments", body: "Task management, deadlines and reminders." },
      { name: "Notifications", body: "Important academic updates and alerts." },
    ],
  },
  {
    n: "02",
    icon: "study" as Icon3DName,
    color: "#45e3ff",
    title: "Learning Resources",
    lead: "Everything you need to study.",
    items: [
      { name: "Study Materials", body: "Lecture notes, PDFs and course resources." },
      { name: "Past Questions", body: "Past examinations and practice materials." },
      { name: "Study Helper AI", body: "AI-powered learning assistance." },
    ],
  },
  {
    n: "03",
    icon: "performance" as Icon3DName,
    color: "#ff7ab6",
    title: "Student Success",
    lead: "Turn effort into results.",
    items: [
      { name: "Practice & Assessment", body: "Quizzes, mock exams and tests." },
      { name: "Performance Tracking", body: "Monitor your academic progress." },
      { name: "Learning Insights", body: "Identify weaknesses and areas for improvement." },
    ],
  },
];

// Examples of the kind of thing Qitt tells you, one per module. Illustrative copy, shown
// under a "Sample messages" label — not real notifications.
const NUDGES = [
  { from: "Timetable", color: "#ffb938", tilt: "-rotate-[1.5deg]", text: "MTH 201.1 starts at 10:00. You have a free hour straight after it." },
  { from: "Assignments", color: "#45e3ff", tilt: "rotate-[1.2deg]", text: "Your CSC 202.2 assignment is due on Friday. That is two days from now." },
  { from: "Notifications", color: "#ff7ab6", tilt: "-rotate-[1deg]", text: "The exam timetable has been updated. Take a look at your new dates." },
  { from: "Study Helper AI", color: "#5ff0b0", tilt: "rotate-[1.6deg]", text: "Stuck on recursion? Ask me and I will walk you through it step by step." },
  { from: "Learning Insights", color: "#ffffff", tilt: "-rotate-[1.3deg]", text: "You keep missing integration questions. Here is a short quiz to fix that." },
];

// Real numbers from the question bank + material library — rounded down, never inflated.
const STATS = [
  { value: "20,000+", unit: "Questions", label: "Practice questions" },
  { value: "500+", unit: "Papers", label: "Past exam papers" },
  { value: "120+", unit: "Courses", label: "Courses covered" },
  { value: "200+", unit: "Files", label: "Study materials" },
];

const MOCK_COURSES = [
  { code: "CSC 202.2", score: "18/20", pct: 90 },
  { code: "MTH 201.1", score: "14/15", pct: 93 },
  { code: "STA 260.1", score: "11/15", pct: 73 },
];

// Where the material finder sends people. The public library is not on the site yet, so
// for now a search lands on sign-up (materials live behind an account). When the public
// library ships, point this at its search page; the form already sends `q` and `type`.
const FIND_MATERIALS_ACTION = "/register";

const MATERIAL_TYPES = [
  { value: "past-questions", label: "Past questions" },
  { value: "study-materials", label: "Study materials" },
  { value: "notes", label: "Notes" },
];

// Illustrative content for the hero app preview (marked "Sample" on the page).
const TODAY = [
  { time: "08:00", code: "MTH 201.1", note: "Done", color: "#5ff0b0" },
  { time: "10:00", code: "CSC 202.2", note: "Now", color: "#ffb938" },
  { time: "13:00", code: "STA 260.1", note: "Next", color: "#45e3ff" },
];

const WHATSAPP = "https://wa.me/2348078350344";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 ${className}`}>
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] ${
        dark ? "text-[#8fb0ff]" : "text-[#0b2be0]"
      }`}
    >
      <span className="h-1.5 w-1.5 bg-[#ffb938]" />
      {children}
    </p>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a1c9c] text-[#0a1245]">
      {/* Announcement bar */}
      <Link
        href="/register"
        className="group flex items-center justify-center gap-3 border-b border-white/25 bg-[#0b2be0] px-4 py-2.5 text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white"
      >
        <span className="hidden h-1.5 w-1.5 bg-[#ffb938] sm:block" />
        <span>Student management, learning and AI support — in one platform</span>
        <Arrow className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* ── Framed hero ─────────────────────────────────────────────────────── */}
      <section className="px-3 pt-3 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[2px] bg-white shadow-[0_40px_120px_-40px_rgba(47,91,255,0.55)]">
          {/* Field: lively blue with a faint, large line grid */}
          <div className="landing-field relative">
            <div className="landing-grid pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* Nav */}
            <header className="relative flex items-center justify-between px-5 py-5 sm:px-8">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 overflow-hidden rounded-[1px] ring-1 ring-white/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/qitt-logo.png" alt="" className="h-full w-full object-cover" />
                </span>
                <span className="font-display text-[19px] font-semibold tracking-tight text-white">Qitt</span>
                <span className="hidden border-l border-white/25 pl-2.5 font-mono text-[9px] uppercase leading-[1.25] tracking-[0.14em] text-white/80 sm:block">
                  Student management
                  <br />
                  &amp; success
                </span>
              </Link>

              <nav className="hidden items-center gap-8 font-display text-[13px] font-medium text-white/90 md:flex">
                {NAV.map((n) => (
                  <Link key={n.label} href={n.href} className="transition-colors hover:text-[#ffb938]">
                    {n.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden rounded-[1px] px-3.5 py-2 font-display text-[13px] font-medium text-white transition-colors hover:text-[#ffb938] sm:block"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="group flex items-center gap-2 rounded-[1px] border border-white/45 px-3.5 py-2 font-display text-[13px] font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-[#0b2be0] squishy-press"
                >
                  Create account
                  <Arrow className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </header>

            {/* Headline + app preview */}
            <div className="relative grid gap-12 px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10 lg:pb-20 lg:pt-14">
              <div>
                <h1 className="font-display text-[44px] font-normal leading-[1.0] tracking-[-0.035em] text-white sm:text-[64px] lg:text-[78px]">
                  Your academic life,{" "}
                  <span className="inline-block -rotate-[2deg] rounded-[2px] bg-[#ffb938] px-3 pb-1 text-[#0a1245]">
                    organised.
                  </span>
                </h1>

                <p className="mt-7 max-w-[480px] font-body text-[16px] leading-relaxed text-white/90 sm:text-[17px]">
                  Qitt brings student management, learning and AI-powered academic support into one
                  platform.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/register"
                    className="group flex items-center gap-2.5 rounded-[1px] bg-[#ffb938] px-6 py-3.5 font-display text-[15px] font-medium text-[#0a1245] transition-colors hover:bg-white squishy-press"
                  >
                    Get started
                    <Arrow className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-[1px] border border-white/45 px-6 py-3.5 font-display text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-[#0b2be0] squishy-press"
                  >
                    See pricing
                  </Link>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-3.5 font-display text-[14px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-[#ffb938]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Chat with us
                  </a>
                </div>
              </div>

              {/* App preview: three overlapping cards, one per pillar. Illustrative. */}
              <div className="relative mx-auto hidden h-[380px] w-full max-w-[440px] lg:block" aria-hidden="true">
                {/* Today's timetable — Student Management */}
                <div className="absolute left-0 top-0 w-[82%] -rotate-[3deg] sm:w-[68%] rounded-[2px] bg-white p-4 shadow-[0_30px_60px_-24px_rgba(6,16,96,0.85)] sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-display text-[13px] font-semibold text-[#0a1245]">
                      <Icon3D name="home" size={40} className="h-6 w-6" />
                      Today
                    </span>
                    <span className="rounded-[1px] bg-[#eaf0ff] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#0b2be0]">
                      Sample
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {TODAY.map((c) => (
                      <li key={c.code} className="flex items-center gap-3 bg-[#f6f8ff] px-2.5 py-2">
                        <span className="h-7 w-1 shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="font-mono text-[10.5px] text-[#0a1245]/75">{c.time}</span>
                        <span className="whitespace-nowrap font-display text-[13px] font-medium text-[#0a1245]">{c.code}</span>
                        <span
                          className="ml-auto rounded-[1px] px-1.5 py-0.5 font-mono text-[8.5px] font-medium uppercase tracking-[0.1em] text-[#0a1245]"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assignment due — Student Management */}
                <div className="absolute right-0 top-[42%] w-[54%] rotate-[4deg] sm:top-[34%] rounded-[2px] bg-[#ffb938] p-4 text-[#0a1245] shadow-[0_30px_60px_-24px_rgba(6,16,96,0.85)] sm:p-5">
                  <p className="flex items-center gap-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.13em]">
                    <Icon3D name="practice" size={40} className="h-6 w-6" />
                    Due Friday
                  </p>
                  <p className="mt-3 font-display text-[17px] font-medium leading-tight tracking-tight sm:text-[19px]">
                    CSC 202.2
                    <br />
                    Assignment 3
                  </p>
                  <p className="mt-3 inline-block rounded-[1px] bg-[#0a1245] px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white">
                    2 days left
                  </p>
                </div>

                {/* Score — Student Success */}
                <div className="absolute bottom-0 left-[6%] w-[50%] -rotate-[2deg] rounded-[2px] bg-[#45e3ff] p-4 text-[#0a1245] shadow-[0_30px_60px_-24px_rgba(6,16,96,0.85)] sm:p-5">
                  <p className="flex items-center gap-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.13em]">
                    <Icon3D name="performance" size={40} className="h-6 w-6" />
                    Average score
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="font-display text-[40px] font-normal leading-none tracking-[-0.04em] sm:text-[46px]">
                      82<span className="text-[22px]">%</span>
                    </p>
                    <div className="flex h-10 items-end gap-1">
                      {[40, 55, 48, 70, 82].map((h, i) => (
                        <span
                          key={i}
                          className={`w-2 ${i === 4 ? "bg-[#0b2be0]" : "bg-[#0a1245]/30"}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Headline block */}
          <div className="flex flex-col gap-8 px-5 pb-10 pt-9 sm:px-8 sm:pb-12 sm:pt-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-[820px] font-display text-[32px] font-normal leading-[1.08] tracking-[-0.03em] text-[#0a1245] sm:text-[46px] lg:text-[58px]">
                Student management{" "}
                <span className="mx-0.5 inline-flex h-[0.92em] w-[0.92em] translate-y-[0.1em] -rotate-[5deg] overflow-hidden rounded-[2px] bg-[#ffb938] align-baseline">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl("adventurer", "amara", "ffb938")} alt="" className="h-full w-full object-cover" />
                </span>{" "}
                and success:{" "}
                <span className="inline-block -rotate-[1.5deg] rounded-[2px] bg-[#ffb938] px-2 text-[#0a1245]">
                  Qitt&rsquo;s
                </span>{" "}
                platform for your{" "}
                <span className="mx-0.5 inline-flex h-[0.92em] w-[0.92em] translate-y-[0.1em] rotate-[6deg] items-center justify-center rounded-[2px] bg-[#45e3ff] align-baseline">
                  <Icon3D name="study" size={64} className="h-[78%] w-[78%]" />
                </span>{" "}
                academic life
              </h2>
              <p className="mt-5 max-w-[520px] font-body text-[15px] font-normal leading-relaxed text-[#0a1245]/80">
                Helping students stay organised, learn effectively, and achieve academic success.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="group flex items-center gap-2.5 rounded-[1px] bg-[#0b2be0] px-5 py-3 font-display text-[14px] font-medium text-white transition-colors hover:bg-[#1238f5] squishy-press"
              >
                Get started
                <Arrow className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="rounded-[1px] border border-[#0a1245]/15 px-5 py-3 font-display text-[14px] font-medium text-[#0a1245] transition-colors hover:border-[#0b2be0] hover:text-[#0b2be0] squishy-press"
              >
                See pricing
              </Link>
            </div>
          </div>

          {/* Material finder */}
          <div
            id="materials"
            className="grid scroll-mt-6 gap-6 bg-[#0b2be0] px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-12"
          >
            <div>
              <Eyebrow dark>Find a material</Eyebrow>
              <h2 className="mt-4 font-display text-[24px] font-normal leading-[1.1] tracking-[-0.025em] text-white sm:text-[30px]">
                Looking for a past question, study material or{" "}
                <span className="inline-block rotate-[1.5deg] rounded-[2px] bg-[#45e3ff] px-1.5 text-[#0a1245]">notes</span>?
              </h2>
            </div>

            <form action={FIND_MATERIALS_ACTION} method="get" role="search">
              <fieldset className="flex flex-wrap gap-2">
                <legend className="sr-only">Material type</legend>
                {MATERIAL_TYPES.map((t, i) => (
                  <label key={t.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={t.value}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="block rounded-[1px] border border-white/40 px-3.5 py-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-white transition-colors hover:border-white peer-checked:border-[#ffb938] peer-checked:bg-[#ffb938] peer-checked:text-[#0a1245] peer-focus-visible:ring-2 peer-focus-visible:ring-white">
                      {t.label}
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-[1px] border border-white bg-white px-4 transition-colors focus-within:border-[#ffb938]">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#0b2be0]">
                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="sr-only">Course code or title</span>
                  <input
                    type="search"
                    name="q"
                    placeholder="Course code or title, e.g. CSC 202.2"
                    autoComplete="off"
                    className="w-full bg-transparent py-3.5 font-body text-[#0a1245] placeholder:text-[#0a1245]/50 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2.5 rounded-[1px] bg-[#ffb938] px-6 py-3.5 font-display text-[14px] font-medium text-[#0a1245] transition-colors hover:bg-white squishy-press"
                >
                  Find material
                  <Arrow className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Ticker */}
          <div className="bg-[#f6f8ff] px-5 py-4 sm:px-8">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#0a1245]/75">
              {TICKER.map((t, i) => (
                <li key={t} className="flex items-center gap-5">
                  {i > 0 && <span className="h-1 w-1 bg-[#ffb938]" />}
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Platform: numbered capability index ─────────────────────────────── */}
      <section id="platform" className="scroll-mt-6 px-5 pb-6 pt-20 text-white sm:px-6 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <Eyebrow dark>The platform</Eyebrow>
              <h2 className="mt-5 font-display text-[32px] font-normal leading-[1.06] tracking-[-0.03em] sm:text-[46px] lg:text-[56px]">
                Three pillars.
                <br />
                <span className="text-[#8fb0ff]">One platform.</span>
              </h2>
            </div>
            <p className="max-w-[420px] font-body text-[15px] leading-relaxed text-white/85 lg:justify-self-end">
              Qitt brings student management, learning and AI-powered academic support into one
              platform, so nothing about your semester lives in five different places.
            </p>
          </div>

          <div className="mt-12 border-t border-white/25">
            {PILLARS.map((p) => (
              <div
                key={p.n}
                className="grid gap-6 border-b border-white/25 py-9 lg:grid-cols-[72px_300px_1fr] lg:gap-8 lg:py-11"
              >
                <span className="font-mono text-[12px] font-medium tracking-[0.14em]" style={{ color: p.color }}>
                  {p.n}
                </span>
                <div className="flex items-start gap-4 lg:block">
                  <span
                    className="flex h-14 w-14 shrink-0 -rotate-[4deg] items-center justify-center rounded-[2px] lg:mb-5"
                    style={{ backgroundColor: p.color }}
                  >
                    <Icon3D name={p.icon} size={64} className="h-10 w-10" />
                  </span>
                  <div>
                    <h3 className="font-display text-[26px] font-normal leading-[1.1] tracking-tight text-white sm:text-[30px]">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 font-body text-[14px] text-white/80">{p.lead}</p>
                  </div>
                </div>
                <ul className="grid gap-px overflow-hidden rounded-[2px] border border-white/25 bg-white/25 sm:grid-cols-3">
                  {p.items.map((it) => (
                    <li key={it.name} className="bg-[#0a1c9c] p-5 transition-colors hover:bg-[#1238f5]">
                      <p
                        className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.13em]"
                        style={{ color: p.color }}
                      >
                        <span className="h-1.5 w-1.5" style={{ backgroundColor: p.color }} />
                        {it.name}
                      </p>
                      <p className="mt-3 font-body text-[14px] leading-relaxed text-white/90">{it.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A day with Qitt: sample messages ────────────────────────────────── */}
      <section className="overflow-hidden pt-20 text-white lg:pt-28">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-10 xl:px-0">
          <Eyebrow dark>A day with Qitt · sample messages</Eyebrow>
          <h2 className="mt-5 max-w-[720px] font-display text-[32px] font-normal leading-[1.06] tracking-[-0.03em] sm:text-[46px]">
            It speaks up, so you{" "}
            <span className="inline-block rotate-[1.5deg] rounded-[2px] bg-[#45e3ff] px-2 text-[#0a1245]">
              don&rsquo;t slip up
            </span>
            .
          </h2>
        </div>

        <ul className="no-scrollbar mx-auto mt-10 flex max-w-[1320px] snap-x gap-4 overflow-x-auto px-5 pb-8 pt-3 sm:px-6 lg:overflow-visible lg:px-10">
          {NUDGES.map((n) => (
            <li
              key={n.from}
              className={`w-[250px] shrink-0 snap-start rounded-[2px] p-5 lg:w-auto lg:flex-1 lg:shrink text-[#0a1245] shadow-[0_24px_40px_-24px_rgba(6,16,96,0.9)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${n.tilt}`}
              style={{ backgroundColor: n.color }}
            >
              <p className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em]">
                <span className="flex h-6 w-6 overflow-hidden rounded-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/qitt-logo.png" alt="" className="h-full w-full object-cover" />
                </span>
                {n.from}
              </p>
              <p className="mt-5 font-display text-[17px] font-medium leading-snug tracking-tight">
                &ldquo;{n.text}&rdquo;
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Student success: product panel ─────────────────────────────────────────── */}
      <section id="success" className="scroll-mt-6 px-3 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[2px] border border-white/25 bg-[#1238f5] lg:grid-cols-2">
          <div className="p-6 text-white sm:p-10 lg:p-14">
            <Eyebrow dark>Student success</Eyebrow>
            <h2 className="mt-5 font-display text-[30px] font-normal leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
              Know where you stand <span className="text-[#ffb938]">before</span> the exam does.
            </h2>
            <p className="mt-5 max-w-[440px] font-body text-[15px] leading-relaxed text-white/85">
              Practise with quizzes, mock exams and tests, track your progress course by course,
              and see exactly where to focus next.
            </p>

            <dl className="mt-9 divide-y divide-white/25 border-y border-white/25">
              {[
                ["Practice", "Quizzes, mock exams and tests"],
                ["Tracking", "Monitor your academic progress"],
                ["Insights", "Identify weaknesses and areas for improvement"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[92px_1fr] gap-4 py-3.5">
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#8fb0ff]">{k}</dt>
                  <dd className="font-body text-[14px] text-white/85">{v}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/register"
              className="group mt-9 inline-flex items-center gap-2.5 rounded-[1px] bg-[#ffb938] px-5 py-3 font-display text-[14px] font-medium text-[#0a1245] transition-colors hover:bg-white squishy-press"
            >
              Start practising
              <Arrow className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Illustrative dashboard */}
          <div className="landing-field relative flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="landing-grid pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative w-full max-w-[400px] rounded-[2px] bg-white p-5 shadow-[0_30px_80px_-30px_rgba(4,8,36,0.9)] sm:p-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 overflow-hidden rounded-[1px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/qitt-logo.png" alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="font-display text-[14px] font-semibold text-[#0a1245]">Performance</span>
                </span>
                <span className="rounded-[1px] bg-[#eaf0ff] px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#0b2be0]">
                  Sample view
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between border-b border-[#0a1245]/10 pb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0a1245]/50">Average score</p>
                  <p className="mt-1.5 font-display text-[48px] font-normal leading-none tracking-[-0.04em] text-[#0a1245]">
                    82<span className="text-[26px] text-[#0a1245]/40">%</span>
                  </p>
                </div>
                {/* trend bars */}
                <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
                  {[38, 52, 46, 64, 72, 82].map((h, i) => (
                    <span
                      key={i}
                      className={`w-3 rounded-none ${i === 5 ? "bg-[#ffb938]" : "bg-[#0b2be0]"}`}
                      style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.25 + i * 0.13 }}
                    />
                  ))}
                </div>
              </div>

              <ul className="mt-4 space-y-3.5">
                {MOCK_COURSES.map((c) => (
                  <li key={c.code}>
                    <div className="flex items-center justify-between">
                      <span className="whitespace-nowrap font-display text-[13px] font-medium text-[#0a1245]">{c.code}</span>
                      <span className="font-mono text-[12px] text-[#0b2be0]">{c.score}</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full bg-[#eaf0ff]">
                      <div className="h-full bg-[#0b2be0]" style={{ width: `${c.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers ─────────────────────────────────────────────────────────── */}
      <section id="numbers" className="scroll-mt-6 bg-[#f6f8ff] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Learning resources</Eyebrow>
              <h2 className="mt-5 font-display text-[32px] font-normal leading-[1.06] tracking-[-0.03em] text-[#0a1245] sm:text-[46px] lg:text-[56px]">
                Enough to walk in prepared.
              </h2>
            </div>
            <p className="max-w-[380px] font-body text-[15px] leading-relaxed text-[#0a1245]/75">
              Real past questions and materials for your courses, so you can practise until passing
              is the only outcome left.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 border-l border-t border-[#0a1245]/12 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`border-b border-r border-[#0a1245]/12 p-5 sm:p-8 ${
                  i === 0 ? "bg-[#0b2be0] text-white" : "bg-white text-[#0a1245]"
                }`}
              >
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                    i === 0 ? "text-[#ffb938]" : "text-[#0b2be0]"
                  }`}
                >
                  {s.unit}
                </p>
                <p className="mt-8 font-display text-[36px] font-normal leading-none tracking-[-0.04em] sm:mt-14 sm:text-[56px]">
                  {s.value}
                </p>
                <p className={`mt-3 font-body text-[13px] ${i === 0 ? "text-white/90" : "text-[#0a1245]/75"}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manifesto ───────────────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[220px_1fr]">
          <Eyebrow>Why Qitt</Eyebrow>
          <div>
            <p className="max-w-[860px] font-display text-[22px] font-normal leading-[1.35] tracking-[-0.015em] text-[#0a1245] sm:text-[30px]">
              A timetable in one app, deadlines in a group chat, notes in a folder, past questions
              somewhere else.{" "}
              <span className="text-[#0b2be0]">
                Qitt brings student management, learning and AI-powered academic support into one
                platform, so staying organised and studying well stop being two separate jobs.
              </span>
            </p>
            <p className="mt-10 max-w-[620px] border-l-2 border-[#ffb938] pl-5 font-display text-[18px] font-medium leading-snug text-[#0b2be0] sm:text-[22px]">
              Stay organised. Learn effectively. Achieve academic success.
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────────────────── */}
      <section className="px-3 pt-3 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8">
        <div className="landing-field relative mx-auto max-w-[1240px] overflow-hidden rounded-[2px]">
          <div className="landing-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 px-6 py-14 sm:px-10 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                <span className="h-1.5 w-1.5 bg-[#ffb938]" />
                Get started
              </p>
              <h2 className="mt-5 max-w-[640px] font-display text-[32px] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:text-[48px]">
                Your academic life, organised.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="group flex items-center gap-2.5 rounded-[1px] bg-[#ffb938] px-5 py-3 font-display text-[14px] font-medium text-[#0a1245] transition-colors hover:bg-white squishy-press"
              >
                Create account
                <Arrow className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="rounded-[1px] border border-white/45 px-5 py-3 font-display text-[14px] font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-[#0b2be0] squishy-press"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="px-5 pb-10 pt-16 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 border-b border-white/25 pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 overflow-hidden rounded-[1px] ring-1 ring-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/qitt-logo.png" alt="" className="h-full w-full object-cover" />
                </span>
                <span className="font-display text-[19px] font-semibold tracking-tight">Qitt</span>
              </span>
              <p className="mt-5 max-w-[300px] font-body text-[14px] leading-relaxed text-white/80">
                Student management and success. Helping students stay organised, learn
                effectively, and achieve academic success.
              </p>
            </div>

            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#8fb0ff]">Platform</p>
              <ul className="mt-4 space-y-2.5 font-display text-[14px] text-white/90">
                <li><Link href="#platform" className="transition-colors hover:text-white">Overview</Link></li>
                <li><Link href="#materials" className="transition-colors hover:text-white">Find a material</Link></li>
                <li><Link href="#success" className="transition-colors hover:text-white">Student success</Link></li>
                <li><Link href="#numbers" className="transition-colors hover:text-white">Learning resources</Link></li>
                <li><Link href="/pricing" className="transition-colors hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#8fb0ff]">Account</p>
              <ul className="mt-4 space-y-2.5 font-display text-[14px] text-white/90">
                <li><Link href="/register" className="transition-colors hover:text-white">Create account</Link></li>
                <li><Link href="/login" className="transition-colors hover:text-white">Log in</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#8fb0ff]">Contact</p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-[1px] border border-white/20 px-3.5 py-2 font-display text-[13px] font-medium text-white transition-colors hover:border-[#ffb938] hover:text-[#ffb938]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 pt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/70 sm:flex-row sm:items-center">
            <p>© {"2026"} Qitt · Built for students</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
              <Link href="/copyright" className="transition-colors hover:text-white">Copyright</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
