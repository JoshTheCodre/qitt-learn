"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import { getResult, percent, type PracticeResult, type ResultQuestion, type Verdict } from "@/lib/results";
import { formatCourseCode } from "@/lib/courses";
import MathText from "@/components/MathText";

const LETTERS = ["a", "b", "c", "d", "e", "f"];

function verdictMeta(v?: Verdict) {
  if (v === "correct")
    return { icon: "check_circle", color: "text-emerald-600", label: "Correct", chip: "bg-emerald-100 text-emerald-700" };
  if (v === "partial")
    return { icon: "adjust", color: "text-amber-500", label: "Partial", chip: "bg-amber-100 text-amber-700" };
  return { icon: "cancel", color: "text-rose-500", label: "Incorrect", chip: "bg-rose-100 text-rose-700" };
}

function ObjectiveCard({ q, qi }: { q: ResultQuestion; qi: number }) {
  const correct = q.picked === q.answer;
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex gap-2">
        <span
          className={`material-symbols-outlined icon-filled mt-px shrink-0 text-[18px] leading-none ${
            correct ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {correct ? "check_circle" : "cancel"}
        </span>
        <p className="font-display text-[13px] font-bold leading-snug text-on-surface">
          <span className="text-on-surface/40">Q{qi + 1}. </span>
          <MathText>{q.q}</MathText>
        </p>
      </div>

      <div className="mt-3 space-y-1.5 pl-6">
        {(q.options ?? []).map((opt, oi) => {
          const isAnswer = oi === q.answer;
          const isPicked = oi === q.picked;
          let cls = "border-outline-variant/40 text-on-surface/70";
          if (isAnswer) cls = "border-emerald-500/50 bg-emerald-500/[0.08] text-emerald-800";
          else if (isPicked) cls = "border-rose-500/50 bg-rose-500/[0.08] text-rose-700";
          return (
            <div
              key={oi}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 font-body text-[12px] leading-snug ${cls}`}
            >
              <span className="font-display text-[11px] font-bold uppercase opacity-50">{LETTERS[oi]}</span>
              <span className="min-w-0 flex-1">
                <MathText>{opt}</MathText>
              </span>
              {isAnswer && (
                <span className="shrink-0 font-display text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Correct
                </span>
              )}
              {isPicked && !isAnswer && (
                <span className="shrink-0 font-display text-[10px] font-bold uppercase tracking-wide text-rose-600">
                  Your pick
                </span>
              )}
            </div>
          );
        })}
        {q.picked == null && (
          <p className="pt-0.5 font-body text-[11px] italic text-on-surface/45">You left this blank.</p>
        )}
      </div>
    </div>
  );
}

function TheoryCard({ q, qi }: { q: ResultQuestion; qi: number }) {
  const m = verdictMeta(q.verdict);
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-2">
        <span className={`material-symbols-outlined icon-filled mt-px shrink-0 text-[18px] leading-none ${m.color}`}>
          {m.icon}
        </span>
        <p className="flex-1 font-display text-[13px] font-bold leading-snug text-on-surface">
          <span className="text-on-surface/40">Q{qi + 1}. </span>
          <MathText>{q.q}</MathText>
        </p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide ${m.chip}`}>
          {m.label}
        </span>
      </div>

      <div className="mt-3 space-y-2.5 pl-6">
        <div>
          <p className="mb-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-on-surface/40">
            Your answer
          </p>
          {q.typed ? (
            <p className="whitespace-pre-wrap font-body text-[12px] leading-snug text-on-surface/80">
              <MathText>{q.typed}</MathText>
            </p>
          ) : (
            <p className="font-body text-[12px] italic text-on-surface/45">Left blank</p>
          )}
        </div>
        {q.feedback && (
          <div className="rounded-lg bg-surface-container px-3 py-2">
            <p className="font-body text-[12px] leading-snug text-on-surface/75">
              <MathText>{q.feedback}</MathText>
            </p>
          </div>
        )}
        {q.modelAnswer && (
          <div>
            <p className="mb-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              Model answer
            </p>
            <p className="whitespace-pre-wrap font-body text-[12px] leading-snug text-on-surface/80">
              <MathText>{q.modelAnswer}</MathText>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const id = String(params.id);

  // null = still loading, false = not found — a plain `null` can't tell them apart.
  const [result, setResult] = useState<PracticeResult | null | false>(null);

  useEffect(() => {
    setResult(getResult(id) ?? false);
  }, [id]);

  if (result === null) {
    return <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background" />;
  }

  if (result === false) {
    return (
      <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
        <PatternBackdrop />
        <div className="relative z-10">
          <BackHeader title="Result" transparent />
        </div>
        <div className="relative z-10 px-gutter pt-20 text-center">
          <p className="font-display text-sm font-bold text-on-surface">Result not found</p>
          <p className="mt-1 font-body text-[12px] text-on-surface/55">
            It may have been cleared, or it belongs to another account.
          </p>
          <Link
            href="/study/performance"
            className="mt-5 inline-block rounded-full bg-emerald-800 px-5 py-2.5 font-display text-[13px] font-bold text-white squishy-press"
          >
            Back to Performance
          </Link>
        </div>
      </div>
    );
  }

  const pct = percent(result);
  const isTheory = result.kind === "theory";
  const vcount = (v: Verdict) => result.questions.filter((q) => q.verdict === v).length;
  const taken = new Date(result.takenAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      <div className="relative z-10">
        <BackHeader title="Result" transparent />
      </div>

      <main className="relative z-10 px-gutter pt-2 pb-12">
        {/* Score header */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-5 text-white shadow-[0_16px_36px_-16px_rgba(6,78,59,0.55)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#3ec995]/25 blur-3xl" />
          <div className="relative">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
              {formatCourseCode(result.course)} · {result.type}
            </p>
            <p className="mt-2 font-display text-[42px] font-bold leading-none">
              {result.score}
              <span className="text-white/50">/{result.total}</span>
            </p>
            <p className="mt-1.5 font-display text-[14px] font-semibold text-[#8ff0cd]">
              {isTheory
                ? `${pct}% · ${vcount("correct")} correct · ${vcount("partial")} partial · ${vcount("incorrect")} wrong`
                : `${pct}% · ${result.score} passed · ${result.total - result.score} failed`}
            </p>
            <p className="mt-3 font-body text-[11px] font-medium text-white/60">{taken}</p>
          </div>
        </section>

        {/* Full breakdown */}
        <h3 className="mb-3 mt-7 font-display text-[15px] font-bold text-on-surface">
          All questions
        </h3>
        <div className="space-y-3">
          {result.questions.map((q, qi) =>
            q.options && q.answer != null ? (
              <ObjectiveCard key={qi} q={q} qi={qi} />
            ) : (
              <TheoryCard key={qi} q={q} qi={qi} />
            ),
          )}
        </div>

        <Link
          href="/study/practice"
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-emerald-800 py-3.5 font-display text-sm font-bold text-white squishy-press"
        >
          Practise again
        </Link>
      </main>
    </div>
  );
}
