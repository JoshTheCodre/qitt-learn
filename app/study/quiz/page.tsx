"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptics";
import {
  makeResultId,
  percent,
  saveResult,
  upsertResult,
  type ResultQuestion,
  type Verdict,
} from "@/lib/results";
import { endPracticeSession, hasPracticeSession } from "@/lib/practice-session";
import { formatCourseCode } from "@/lib/courses";
import { verdictScore, type PracticeQuestion, type PracticeTheoryQuestion } from "@/lib/practice";
import MathText from "@/components/MathText";

const LETTERS = ["a", "b", "c", "d", "e", "f"];

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

// One shape for both modes — objective sets options/answer, theory sets answerText.
type Q = {
  id: number;
  q: string;
  options?: string[];
  answer?: number;
  answerText?: string | null;
  explanation?: string | null;
  session?: string | null;
};

const VERDICTS: { v: Verdict; label: string; on: string }[] = [
  { v: "correct", label: "Correct", on: "bg-emerald-600 text-white" },
  { v: "partial", label: "Partial", on: "bg-amber-500 text-white" },
  { v: "incorrect", label: "Wrong", on: "bg-rose-500 text-white" },
];

function VerdictPicker({ value, onChange }: { value?: Verdict; onChange: (v: Verdict) => void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-surface-container p-1">
      {VERDICTS.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => {
            haptic("select");
            onChange(o.v);
          }}
          className={`flex-1 rounded-md py-1.5 font-display text-[11px] font-bold transition-colors ${
            value === o.v ? o.on : "text-on-surface/55"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function QuizSession() {
  const router = useRouter();
  const params = useSearchParams();

  const rawCourse = params.get("course") || "";
  const course = formatCourseCode(rawCourse || "Practice");
  const requested = Number(params.get("count")) || 10;
  const timeParam = params.get("time") || "No limit";
  const isTheory = (params.get("type") || "") === "Theory";
  const typeLabel = isTheory ? "Theory" : params.get("mode") || params.get("type") || "Objective";

  const [questions, setQuestions] = useState<Q[]>([]);
  const [qStatus, setQStatus] = useState<"loading" | "done" | "error">("loading");
  const total = questions.length;

  const limitMins = timeParam === "No limit" ? null : parseInt(timeParam, 10) || null;
  const [remaining, setRemaining] = useState(limitMins ? limitMins * 60 : null);

  // Objective answers (picked option index) and theory answers (typed text) are separate.
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [typed, setTyped] = useState<Record<number, string>>({});
  // Theory grading outcome — editable, so a student can override the AI (or self-mark).
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [gradedByAI, setGradedByAI] = useState(false);
  const [grading, setGrading] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const submittedRef = useRef(false);
  const guardRef = useRef(true);
  const pushedRef = useRef(false);

  const answered = isTheory
    ? Object.values(typed).filter((s) => s.trim().length > 0).length
    : Object.keys(answers).length;

  const objectiveScore = questions.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0);
  const theoryScore = questions.reduce((n, _q, i) => n + verdictScore(verdicts[i] ?? "incorrect"), 0);
  const score = isTheory ? theoryScore : objectiveScore;
  const displayScore = isTheory ? Math.round(theoryScore * 10) / 10 : objectiveScore;

  const answeredRef = useRef(0);
  answeredRef.current = answered;

  const leaveTo = (dest: string) => {
    guardRef.current = false;
    endPracticeSession();
    router.replace(dest);
  };

  const requestLeave = () => {
    if (submittedRef.current) leaveTo("/study/performance");
    else if (answeredRef.current > 0) setShowLeave(true);
    else leaveTo("/study/practice");
  };

  // Build the persisted theory attempt from a given set of verdicts (so verdict edits can
  // re-save without reading stale state).
  function theoryResult(id: string, v: Record<number, Verdict>): Parameters<typeof upsertResult>[0] {
    const rq: ResultQuestion[] = questions.map((q, i) => ({
      q: q.q,
      typed: (typed[i] || "").trim() || null,
      modelAnswer: q.answerText ?? null,
      verdict: v[i] ?? "incorrect",
      feedback: feedbacks[i] ?? null,
    }));
    const sc = questions.reduce((n, _q, i) => n + verdictScore(v[i] ?? "incorrect"), 0);
    return {
      id,
      course,
      type: typeLabel,
      kind: "theory",
      score: Math.round(sc * 10) / 10,
      total,
      takenAt: new Date().toISOString(),
      questions: rq,
    };
  }

  function submitObjective() {
    const resultQuestions: ResultQuestion[] = questions.map((q, i) => ({
      q: q.q,
      options: q.options,
      answer: q.answer,
      picked: answers[i] ?? null,
    }));
    const id = makeResultId();
    saveResult({
      id,
      course,
      type: typeLabel,
      kind: "objective",
      score: objectiveScore,
      total,
      takenAt: new Date().toISOString(),
      questions: resultQuestions,
    });
    setResultId(id);
    setSubmitted(true);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitTheory() {
    setGrading(true);
    const items = questions.map((q, i) => ({
      id: q.id,
      question: q.q,
      modelAnswer: q.answerText ?? "",
      studentAnswer: (typed[i] || "").trim(),
    }));

    let grades: { id: number; verdict: Verdict; feedback: string }[] = [];
    let ai = false;
    try {
      const res = await fetch("/api/practice/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.ok && data.graded) {
        grades = data.grades;
        ai = true;
      }
    } catch {
      /* fall back to self-marking */
    }

    const byId = new Map(grades.map((g) => [g.id, g]));
    const nextV: Record<number, Verdict> = {};
    const nextF: Record<number, string> = {};
    questions.forEach((q, i) => {
      const g = byId.get(q.id);
      const blank = !(typed[i] || "").trim();
      if (g) {
        nextV[i] = g.verdict;
        if (g.feedback) nextF[i] = g.feedback;
      } else if (blank) {
        nextV[i] = "incorrect"; // blanks are wrong in both AI and self-mark paths
      }
      // answered-but-ungraded (self-mark path) is left unset for the student to mark
    });

    const id = makeResultId();
    setVerdicts(nextV);
    setFeedbacks(nextF);
    setGradedByAI(ai);
    setResultId(id);
    upsertResult(theoryResult(id, nextV));
    setGrading(false);
    setSubmitted(true);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    haptic("success");
    if (isTheory) void submitTheory();
    else submitObjective();
  }

  // Re-mark a theory question and persist the adjusted attempt.
  function setVerdict(i: number, v: Verdict) {
    setVerdicts((prev) => {
      const next = { ...prev, [i]: v };
      if (resultId) upsertResult(theoryResult(resultId, next));
      return next;
    });
  }

  // Session validation + browser Back interception. Runs once on mount.
  useEffect(() => {
    if (!hasPracticeSession()) {
      router.replace("/study/practice");
      return;
    }
    setReady(true);
    if (!pushedRef.current) {
      window.history.pushState(null, "", window.location.href);
      pushedRef.current = true;
    }
    const onPop = () => {
      if (!guardRef.current) return;
      window.history.pushState(null, "", window.location.href);
      requestLeave();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pull the questions for this course/type once the session is validated.
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    setQStatus("loading");
    const kind = isTheory ? "theory" : "objective";
    fetch(`/api/practice/questions?code=${encodeURIComponent(rawCourse)}&count=${requested}&kind=${kind}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok) {
          const list = isTheory
            ? (d.questions as PracticeTheoryQuestion[]).map((q) => ({
                id: q.id,
                q: q.q,
                answerText: q.answerText,
                explanation: q.explanation,
                session: q.session,
              }))
            : (d.questions as PracticeQuestion[]).map((q) => ({
                id: q.id,
                q: q.q,
                options: q.options,
                answer: q.answer,
                explanation: q.explanation,
                session: q.session,
              }));
          setQuestions(list);
          setQStatus("done");
        } else {
          setQStatus("error");
        }
      })
      .catch(() => alive && setQStatus("error"));
    return () => {
      alive = false;
    };
  }, [ready, rawCourse, requested, isTheory]);

  // Native prompt on hard exits while unsaved.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (submittedRef.current || answeredRef.current === 0) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Countdown. Auto-submits at zero. Held until questions load so it can't run empty.
  useEffect(() => {
    if (remaining === null || submitted || qStatus !== "done" || total === 0) return;
    if (remaining <= 0) {
      submit();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, submitted, qStatus, total]);

  const clock =
    remaining === null
      ? "No limit"
      : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")} mins`;
  const low = remaining !== null && remaining <= 60;

  if (!ready) {
    return <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background" />;
  }

  const backToSetup = () => {
    endPracticeSession();
    router.replace("/study/practice");
  };

  // Loading / no-questions / error — a lightweight framed screen with a way back.
  if (qStatus !== "done" || total === 0) {
    return (
      <div className={FRAME}>
        <header className="sticky top-0 z-30 bg-gradient-to-br from-emerald-700 to-emerald-900 px-gutter py-4 text-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={backToSetup}
              className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10 squishy-press"
            >
              <span className="material-symbols-outlined text-[24px] leading-none">arrow_back</span>
            </button>
            <p className="truncate font-display text-[22px] font-bold leading-tight">{course}</p>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center gap-3 px-gutter py-28 text-center">
          {qStatus === "loading" ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[34px] text-emerald-700">
                progress_activity
              </span>
              <p className="font-display text-sm font-medium text-on-surface-variant">Loading questions…</p>
            </>
          ) : qStatus === "error" ? (
            <>
              <span className="material-symbols-outlined text-[38px] text-outline-variant">cloud_off</span>
              <p className="font-display text-sm font-semibold text-on-surface">Couldn&apos;t load questions</p>
              <button
                type="button"
                onClick={backToSetup}
                className="mt-1 rounded-full bg-emerald-800 px-5 py-2.5 font-display text-[13px] font-semibold text-white squishy-press"
              >
                Back to setup
              </button>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[40px] text-outline-variant">quiz</span>
              <p className="font-display text-sm font-semibold text-on-surface">
                No practice questions for {course} yet
              </p>
              <button
                type="button"
                onClick={backToSetup}
                className="mt-1 rounded-full bg-emerald-800 px-5 py-2.5 font-display text-[13px] font-semibold text-white squishy-press"
              >
                Pick another course
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      {/* Exam header — sticky, so the clock and score never scroll away */}
      <header className="sticky top-0 z-30 bg-gradient-to-br from-emerald-700 to-emerald-900 px-gutter py-4 text-white shadow-[0_8px_20px_-10px_rgba(6,78,59,0.6)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Leave session"
            onClick={requestLeave}
            className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10 squishy-press"
          >
            <span className="material-symbols-outlined text-[24px] leading-none">arrow_back</span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[22px] font-bold leading-tight">{course}</p>
            <p className="mt-0.5 font-body text-[12px] font-medium leading-tight text-white/70">
              {submitted ? `Scored ${displayScore} out of ${total}` : `${answered} out of ${total}`}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-body text-[10px] font-medium leading-none text-white/70">Time Remaining</p>
            <p
              className={`mt-1 font-display text-[18px] font-bold leading-none tabular-nums ${
                low ? "text-amber-300" : "text-white"
              }`}
            >
              {clock}
            </p>
          </div>
        </div>
      </header>

      <main className="px-gutter pb-32 pt-5">
        {questions.map((q, qi) => (
          <section key={qi} className="mb-7">
            <div className="flex gap-1.5">
              <span className="shrink-0 font-display text-[13px] font-bold text-on-surface/45">
                Q{qi + 1}.
              </span>
              <h2 className="font-display text-[14px] font-bold leading-snug text-on-surface">
                <MathText>{q.q}</MathText>
              </h2>
            </div>

            {isTheory ? (
              <textarea
                value={typed[qi] || ""}
                disabled={submitted}
                onChange={(e) => setTyped((t) => ({ ...t, [qi]: e.target.value }))}
                placeholder="Type your answer…"
                rows={4}
                className="mt-2.5 w-full resize-y rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2.5 font-body text-[13px] leading-snug text-on-surface placeholder:text-on-surface/35 focus:border-emerald-600 focus:outline-none disabled:opacity-70"
              />
            ) : (
              <div className="mt-2.5 space-y-0.5">
                {(q.options ?? []).map((opt, oi) => {
                  const picked = answers[qi];
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
                      <span className={`font-body text-[13px] leading-snug ${tone}`}>
                        <MathText>{opt}</MathText>
                      </span>
                      <span className="ml-auto font-body text-[10px] font-medium text-on-surface/25">
                        {LETTERS[oi]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </main>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-background px-gutter pb-5 pt-3">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-10 bg-gradient-to-t from-background to-transparent" />

        {submitted ? (
          <button
            type="button"
            onClick={() => setShowResult(true)}
            className="w-full rounded-2xl bg-emerald-800 py-4 font-display text-sm font-bold text-white shadow-[0_8px_24px_rgba(6,78,59,0.28)] squishy-press"
          >
            See result
          </button>
        ) : (
          <div className={`rounded-2xl ${answered === total ? "animated-border p-[1.5px]" : ""}`}>
            <button
              type="button"
              onClick={() => setShowSubmit(true)}
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

      {/* Grading overlay while the AI marks theory answers */}
      {grading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/55 px-8 text-center">
          <span className="material-symbols-outlined animate-spin text-[38px] text-white">
            progress_activity
          </span>
          <p className="font-display text-[15px] font-bold text-white">Grading your answers…</p>
          <p className="font-body text-[12px] text-white/70">This can take a few seconds.</p>
        </div>
      )}

      {/* Submit confirmation */}
      {showSubmit && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-surface-container-lowest p-5 text-center shadow-2xl">
            <h3 className="font-display text-[17px] font-bold text-on-surface">Submit practice?</h3>
            <p className="mt-1.5 font-body text-[13px] leading-snug text-on-surface/60">
              {isTheory
                ? answered < total
                  ? `You've answered ${answered} of ${total}. Blank answers are marked wrong. Submit for grading?`
                  : "Your answers will be graded when you submit."
                : answered < total
                  ? `You've answered ${answered} of ${total}. Unanswered questions are marked wrong. Submit anyway?`
                  : "You won't be able to change your answers after this."}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowSubmit(false)}
                className="flex-1 rounded-xl bg-surface-container py-3 font-display text-sm font-semibold text-on-surface squishy-press"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmit(false);
                  submit();
                }}
                className="flex-1 rounded-xl bg-emerald-800 py-3 font-display text-sm font-bold text-white squishy-press"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave confirmation */}
      {showLeave && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-surface-container-lowest p-5 text-center shadow-2xl">
            <h3 className="font-display text-[17px] font-bold text-on-surface">Leave Practice?</h3>
            <p className="mt-1.5 font-body text-[13px] leading-snug text-on-surface/60">
              Your progress may be lost. Are you sure you want to leave?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowLeave(false)}
                className="flex-1 rounded-xl bg-surface-container py-3 font-display text-sm font-semibold text-on-surface squishy-press"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeave(false);
                  leaveTo("/study/practice");
                }}
                className="flex-1 rounded-xl bg-rose-600 py-3 font-display text-sm font-bold text-white squishy-press"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result modal */}
      {showResult && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="flex max-h-[88vh] w-full max-w-[430px] flex-col rounded-t-3xl bg-surface-container-lowest sm:rounded-3xl">
            <div className="relative shrink-0 overflow-hidden rounded-t-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 px-5 pb-5 pt-6 text-center text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#3ec995]/25 blur-3xl" />
              <div className="relative">
                <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
                  {course}
                </p>
                <p className="mt-2 font-display text-[40px] font-bold leading-none">
                  {displayScore}
                  <span className="text-white/50">/{total}</span>
                </p>
                <p className="mt-1.5 font-display text-[13px] font-semibold text-[#8ff0cd]">
                  {isTheory
                    ? `${percent({ score, total })}% · ${gradedByAI ? "AI-graded" : "self-marked"}`
                    : `${percent({ score, total })}% · ${objectiveScore} passed · ${total - objectiveScore} failed`}
                </p>
              </div>
            </div>

            {isTheory && (
              <p className="shrink-0 border-b border-outline-variant/30 bg-surface-container/40 px-5 py-2 text-center font-body text-[11px] font-medium text-on-surface/60">
                {gradedByAI
                  ? "Graded by AI — tap a verdict to adjust any answer."
                  : "AI grading unavailable — mark each answer against the model answer."}
              </p>
            )}

            {/* Per-question breakdown */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {questions.map((q, qi) =>
                  isTheory ? (
                    <div key={qi} className="rounded-2xl border border-outline-variant/30 bg-background p-3.5">
                      <p className="font-display text-[13px] font-bold leading-snug text-on-surface">
                        <span className="text-on-surface/40">Q{qi + 1}. </span>
                        <MathText>{q.q}</MathText>
                      </p>
                      <div className="mt-2.5 space-y-2.5">
                        <div>
                          <p className="mb-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-on-surface/40">
                            Your answer
                          </p>
                          {(typed[qi] || "").trim() ? (
                            <p className="whitespace-pre-wrap font-body text-[12px] leading-snug text-on-surface/80">
                              <MathText>{typed[qi]}</MathText>
                            </p>
                          ) : (
                            <p className="font-body text-[12px] italic text-on-surface/45">Left blank</p>
                          )}
                        </div>
                        {feedbacks[qi] && (
                          <div className="rounded-lg bg-surface-container px-3 py-2">
                            <p className="font-body text-[12px] leading-snug text-on-surface/75">
                              {feedbacks[qi]}
                            </p>
                          </div>
                        )}
                        {q.answerText && (
                          <div>
                            <p className="mb-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                              Model answer
                            </p>
                            <p className="whitespace-pre-wrap font-body text-[12px] leading-snug text-on-surface/80">
                              <MathText>{q.answerText}</MathText>
                            </p>
                          </div>
                        )}
                        <VerdictPicker value={verdicts[qi]} onChange={(v) => setVerdict(qi, v)} />
                      </div>
                    </div>
                  ) : (
                    <div key={qi} className="rounded-2xl border border-outline-variant/30 bg-background p-3.5">
                      <div className="flex gap-2">
                        <span
                          className={`material-symbols-outlined icon-filled mt-px shrink-0 text-[18px] leading-none ${
                            answers[qi] === q.answer ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          {answers[qi] === q.answer ? "check_circle" : "cancel"}
                        </span>
                        <p className="font-display text-[13px] font-bold leading-snug text-on-surface">
                          <span className="text-on-surface/40">Q{qi + 1}. </span>
                          <MathText>{q.q}</MathText>
                        </p>
                      </div>
                      <div className="mt-2.5 space-y-1 pl-6">
                        {answers[qi] == null ? (
                          <p className="font-body text-[12px] italic leading-snug text-on-surface/45">Left blank</p>
                        ) : (
                          <p
                            className={`font-body text-[12px] font-medium leading-snug ${
                              answers[qi] === q.answer ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            Your answer: <MathText>{q.options?.[answers[qi]]}</MathText>
                            {answers[qi] === q.answer ? " · Correct" : ""}
                          </p>
                        )}
                        {answers[qi] !== q.answer && q.answer != null && (
                          <p className="font-body text-[12px] font-semibold leading-snug text-emerald-700">
                            Correct: <MathText>{q.options?.[q.answer]}</MathText>
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="shrink-0 space-y-2 border-t border-outline-variant/30 px-5 pb-6 pt-3">
              <button
                type="button"
                onClick={() => leaveTo(resultId ? `/study/performance/${resultId}` : "/study/performance")}
                className="w-full rounded-2xl bg-emerald-800 py-3.5 font-display text-sm font-bold text-white squishy-press"
              >
                See full result
              </button>
              <button
                type="button"
                onClick={() => setShowResult(false)}
                className="w-full rounded-2xl bg-surface-container py-3.5 font-display text-sm font-semibold text-on-surface-variant squishy-press"
              >
                Review answers here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen w-full max-w-[430px] bg-background" />}>
      <QuizSession />
    </Suspense>
  );
}
