"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptics";

type Question = {
  q: string;
  options: string[];
  answer: number;
};

const BANK: Question[] = [
  { q: "An Array with rank 2 could be called a __", options: ["Matrix", "List", "Subscript", "Vector"], answer: 0 },
  { q: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Array", "Tree"], answer: 1 },
  { q: "What does CPU stand for?", options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Control Program Unit"], answer: 2 },
  { q: "The binary number 1010 equals which decimal value?", options: ["8", "10", "12", "16"], answer: 1 },
  { q: "Which of the following has the highest precedence in arithmetic computation?", options: ["*", "+", "-", "( )"], answer: 3 },
  { q: "Which of these is NOT a programming paradigm?", options: ["Object-Oriented", "Functional", "Procedural", "Horizontal"], answer: 3 },
  { q: "The time complexity of binary search on a sorted array is:", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], answer: 2 },
  { q: "In relational databases, a primary key must be:", options: ["Nullable", "Unique and not null", "An integer", "Auto-incrementing"], answer: 1 },
  { q: "Which layer of the OSI model does IP operate at?", options: ["Transport", "Network", "Data link", "Session"], answer: 1 },
  { q: "A compiler translates source code into:", options: ["Pseudocode", "Machine code", "Flowcharts", "Bytecode only"], answer: 1 },
];

const LETTERS = ["a", "b", "c", "d"];

function QuizSession() {
  const router = useRouter();
  const params = useSearchParams();

  const course = params.get("course") || "Practice";
  const requested = Number(params.get("count")) || 10;
  const timeParam = params.get("time") || "No limit";

  // The bank is finite; never claim more questions than we can actually ask.
  const questions = useMemo(() => BANK.slice(0, Math.min(requested, BANK.length)), [requested]);
  const total = questions.length;

  const limitMins = timeParam === "No limit" ? null : parseInt(timeParam, 10) || null;
  const [remaining, setRemaining] = useState(limitMins ? limitMins * 60 : null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);

  const answered = Object.keys(answers).length;
  const score = questions.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0);

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    haptic("success");
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Countdown. Auto-submits at zero so the time limit actually means something.
  useEffect(() => {
    if (remaining === null || submitted) return;
    if (remaining <= 0) {
      submit();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, submitted]);

  const clock =
    remaining === null
      ? "No limit"
      : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")} mins`;

  const low = remaining !== null && remaining <= 60;

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      {/* Exam header — sticky, so the clock and score never scroll away */}
      <header className="sticky top-0 z-30 bg-gradient-to-br from-emerald-700 to-emerald-900 px-gutter py-2 text-white shadow-[0_8px_20px_-10px_rgba(6,78,59,0.6)]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Leave session"
            onClick={() => router.back()}
            className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10 squishy-press"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">arrow_back</span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[17px] font-bold leading-tight">{course}</p>
            <p className="font-body text-[10px] font-medium leading-tight text-white/70">
              {submitted ? `Scored ${score} out of ${total}` : `${answered} out of ${total}`}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-body text-[9px] font-medium leading-none text-white/70">
              Time Remaining
            </p>
            <p
              className={`mt-0.5 font-display text-[14px] font-bold leading-none tabular-nums ${
                low ? "text-amber-300" : "text-white"
              }`}
            >
              {clock}
            </p>
          </div>
        </div>
      </header>

      <main className="px-gutter pb-32 pt-5">
        {questions.map((q, qi) => {
          const picked = answers[qi];
          return (
            <section key={qi} className="mb-7">
              <div className="flex gap-1.5">
                <span className="shrink-0 font-display text-[13px] font-bold text-on-surface/45">
                  Q{qi + 1}.
                </span>
                <h2 className="font-display text-[14px] font-bold leading-snug text-on-surface">
                  {q.q}
                </h2>
              </div>

              <div className="mt-2.5 space-y-0.5">
                {q.options.map((opt, oi) => {
                  const isPicked = picked === oi;
                  const isAnswer = q.answer === oi;

                  let tone = "text-on-surface/80";
                  if (submitted && isAnswer) tone = "text-emerald-700 font-semibold";
                  else if (submitted && isPicked) tone = "text-rose-600 font-semibold";
                  else if (isPicked) tone = "text-on-surface font-semibold";

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => {
                        if (picked === oi) return;
                        haptic("select");
                        setAnswers((a) => ({ ...a, [qi]: oi }));
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-surface-container/60 disabled:hover:bg-transparent"
                    >
                      {/* Radio, drawn rather than a native input so it can carry the
                          post-submit correct/incorrect state without extra chrome. */}
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          submitted && isAnswer
                            ? "border-emerald-600 bg-emerald-600"
                            : submitted && isPicked
                              ? "border-rose-500 bg-rose-500"
                              : isPicked
                                ? "border-emerald-700 bg-emerald-700"
                                : "border-outline-variant"
                        }`}
                      >
                        {(isPicked || (submitted && isAnswer)) && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <span className={`font-body text-[13px] leading-snug ${tone}`}>{opt}</span>
                      <span className="ml-auto font-body text-[10px] font-medium text-on-surface/25">
                        {LETTERS[oi]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-background px-gutter pb-5 pt-3">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-10 bg-gradient-to-t from-background to-transparent" />

        {submitted ? (
          <button
            type="button"
            onClick={() => router.push("/study/practice")}
            className="w-full rounded-2xl bg-emerald-800 py-4 font-display text-sm font-bold text-white shadow-[0_8px_24px_rgba(6,78,59,0.28)] squishy-press"
          >
            Back to Practice
          </button>
        ) : (
          <div className={`rounded-2xl ${answered === total ? "animated-border p-[1.5px]" : ""}`}>
            <button
              type="button"
              onClick={submit}
              disabled={answered === 0}
              className={`w-full bg-emerald-800 py-4 font-display text-sm font-bold text-white shadow-[0_8px_24px_rgba(6,78,59,0.28)] transition-opacity disabled:opacity-40 disabled:shadow-none squishy-press ${
                answered === total ? "rounded-[15px]" : "rounded-2xl"
              }`}
            >
              {answered === total ? "Submit answers" : `Submit (${answered}/${total} answered)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  // useSearchParams needs a Suspense boundary, or the build fails when Next tries to
  // statically prerender this route.
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen w-full max-w-[430px] bg-background" />}>
      <QuizSession />
    </Suspense>
  );
}
