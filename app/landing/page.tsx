import Link from "next/link";

const STATS = [
  { value: "12k+", label: "Students" },
  { value: "500+", label: "Courses" },
  { value: "4.9", label: "Rating" },
];

const FEATURES = [
  { icon: "auto_stories", title: "Study modes", desc: "Turn any material into clean summaries or an easy-read breakdown." },
  { icon: "quiz", title: "Practice quizzes", desc: "Auto-generate quizzes from your notes and test yourself." },
  { icon: "insights", title: "Performance", desc: "Track your scores and watch yourself improve over time." },
  { icon: "library_books", title: "Course hub", desc: "Materials, lecture notes, recordings and outlines in one place." },
];

const STEPS = [
  { n: 1, title: "Create your account", desc: "Sign up with your school details in seconds." },
  { n: 2, title: "Add your courses", desc: "Upload materials or request what you need." },
  { n: 3, title: "Study and practice", desc: "Learn, quiz yourself and track your progress." },
];

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-on-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qitt-logo.png" alt="Qitt" className="w-full h-full object-cover" />
            </span>
            <span className="font-display text-[18px] font-extrabold tracking-tight">Qitt</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-display text-sm font-semibold text-on-surface-variant">
            <a href="#features" className="hover:text-on-surface transition-colors">Features</a>
            <a href="#how" className="hover:text-on-surface transition-colors">How it works</a>
            <a href="#reviews" className="hover:text-on-surface transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="font-display text-sm font-semibold text-on-surface px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex font-display text-sm font-semibold text-on-primary bg-primary px-4 py-2 rounded-full squishy-press"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-10 lg:pt-20 pb-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 text-primary px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wide">
              <span className="material-symbols-outlined text-[14px] leading-none">auto_awesome</span>
              AI-powered study
            </span>
            <h1 className="mt-4 font-display text-[34px] sm:text-[44px] lg:text-[56px] font-extrabold leading-[1.05] tracking-tight">
              Study <span className="text-primary">smarter</span>, ace every semester.
            </h1>
            <p className="mt-4 font-body text-[15px] lg:text-[18px] font-medium text-on-surface-variant max-w-xl">
              Qitt turns your course materials into summaries, quizzes and progress insights — all
              in one place.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold shadow-[0_8px_24px_rgba(37,99,235,0.28)] squishy-press"
              >
                Get Started — it&apos;s free
                <span className="material-symbols-outlined text-[18px] leading-none">arrow_forward</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-surface-container text-on-surface font-display text-sm font-semibold squishy-press"
              >
                I already have an account
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container-lowest py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              {STATS.map((s, i) => (
                <div key={s.label} className={`text-center ${i < STATS.length - 1 ? "border-r border-outline-variant/40" : ""}`}>
                  <p className="font-display text-[22px] font-extrabold leading-none">{s.value}</p>
                  <p className="mt-1 font-body text-[11px] font-medium text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-primary to-cyan-500 p-5 sm:p-8 shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full text-white/10"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="340" cy="50" r="90" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="340" cy="50" r="58" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="relative z-10 max-w-[300px] mx-auto rounded-2xl bg-white/95 p-4 shadow-xl">
                <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                  For You
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["Study", "Practice", "Track"].map((t) => (
                    <div key={t} className="rounded-xl bg-primary/5 text-primary py-2 text-center font-display text-[11px] font-semibold">
                      {t}
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  {["CSC 202.2", "MTH 201.1"].map((c) => (
                    <div key={c} className="flex items-center justify-between rounded-lg bg-surface-container px-3 py-2">
                      <span className="font-display text-[12px] font-semibold text-on-surface">{c}</span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant leading-none">
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-[26px] lg:text-[36px] font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mt-2 font-body text-[15px] lg:text-[17px] font-medium text-on-surface-variant">
            One app for the whole semester.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <span className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px] leading-none">{f.icon}</span>
              </span>
              <p className="mt-4 font-display text-[16px] font-bold">{f.title}</p>
              <p className="mt-1 font-body text-[13px] font-medium text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-[26px] lg:text-[36px] font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-2 font-body text-[15px] lg:text-[17px] font-medium text-on-surface-variant">
            Up and running in three steps.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center md:text-left">
              <span className="inline-flex w-11 h-11 rounded-full bg-primary text-on-primary items-center justify-center font-display text-base font-bold">
                {step.n}
              </span>
              <p className="mt-4 font-display text-[17px] font-bold">{step.title}</p>
              <p className="mt-1 font-body text-[14px] font-medium text-on-surface-variant">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section id="reviews" className="max-w-3xl mx-auto px-6 lg:px-8 pt-16 lg:pt-28">
        <div className="rounded-[28px] bg-surface-container p-6 lg:p-10 text-center">
          <span className="material-symbols-outlined text-[32px] text-primary leading-none">
            format_quote
          </span>
          <p className="mt-3 font-display text-[18px] lg:text-[24px] font-semibold leading-snug">
            Qitt helped me organize my whole semester. The quizzes are a total game-changer.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center font-display text-[12px] font-bold text-white">
              A
            </span>
            <p className="font-body text-[13px] font-medium text-on-surface-variant">
              Amara · 300 Level
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-28">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary to-blue-700 p-8 lg:p-14 text-white shadow-[0_16px_40px_rgba(37,99,235,0.3)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-center lg:text-left">
          <div>
            <h2 className="font-display text-[26px] lg:text-[36px] font-extrabold tracking-tight">
              Ready to study smarter?
            </h2>
            <p className="mt-2 font-body text-[15px] lg:text-[17px] font-medium text-white/80">
              Join thousands of students acing their semester with Qitt.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center whitespace-nowrap px-8 py-4 rounded-2xl bg-white text-primary font-display text-sm font-bold shrink-0 squishy-press"
          >
            Get Started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-10 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant/30 pt-8">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qitt-logo.png" alt="Qitt" className="w-full h-full object-cover" />
            </span>
            <span className="font-display text-sm font-bold">Qitt</span>
          </div>
          <div className="flex items-center gap-6 font-body text-xs font-medium text-on-surface-variant">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className="font-body text-[11px] font-medium text-on-surface-variant/70">
            © 2026 Qitt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
