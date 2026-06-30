"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  q: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  { q: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Array", "Tree"], answer: 1 },
  { q: "What does CPU stand for?", options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Control Program Unit"], answer: 2 },
  { q: "The binary number 1010 equals which decimal value?", options: ["8", "10", "12", "16"], answer: 1 },
  { q: "Which of these is NOT a programming paradigm?", options: ["Object-Oriented", "Functional", "Procedural", "Horizontal"], answer: 3 },
];

const LETTERS = ["a", "b", "c", "d"];

export default function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[index];

  function submit() {
    if (selected === null) return;
    setRevealed(true);
    if (selected === current.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20 flex flex-col items-center justify-center px-gutter text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[40px] text-primary leading-none">
            military_tech
          </span>
        </div>
        <h2 className="mt-6 font-display text-[24px] font-bold text-on-surface">Session complete</h2>
        <p className="mt-2 font-display text-sm font-medium text-on-surface-variant">
          You scored
        </p>
        <p className="mt-1 font-display text-[40px] font-bold text-primary leading-none">
          {score} / {total}
        </p>
        <div className="mt-10 w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={restart}
            className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold squishy-press"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.push("/study/practice")}
            className="w-full py-3.5 rounded-2xl bg-surface-container text-on-surface font-display text-sm font-semibold squishy-press"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-gutter py-4 shrink-0">
        <button
          type="button"
          aria-label="Close"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 squishy-press"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
            close
          </span>
        </button>
        <h1 className="font-display text-[18px] font-bold text-on-surface">Practice Session</h1>
        <span className="ml-auto rounded-full bg-primary/5 text-primary px-3 py-1 font-display text-xs font-bold">
          {score} / {total}
        </span>
      </header>

      {/* Progress */}
      <div className="px-gutter shrink-0">
        <div className="flex items-center justify-between mb-1.5 font-display text-xs font-medium text-on-surface-variant">
          <span>
            Question {index + 1} of {total}
          </span>
        </div>
        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <main className="flex-1 px-gutter pt-6 pb-28">
        <h2 className="font-display text-[20px] font-bold text-on-surface leading-snug">
          {current.q}
        </h2>

        <div className="mt-6 space-y-3">
          {current.options.map((opt, i) => {
            const isSelected = selected === i;
            const isAnswer = current.answer === i;
            let style =
              "bg-surface-container-lowest border-outline-variant/50 text-on-surface";
            if (revealed) {
              if (isAnswer) style = "bg-emerald-50 border-emerald-400 text-emerald-800";
              else if (isSelected) style = "bg-rose-50 border-rose-400 text-rose-800";
            } else if (isSelected) {
              style = "bg-primary/5 border-primary text-on-surface";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${style}`}
              >
                <span
                  className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-display text-xs font-bold ${
                    isSelected || (revealed && isAnswer)
                      ? "bg-white/60"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <span className="font-display text-sm font-semibold flex-1">{opt}</span>
                {revealed && isAnswer && (
                  <span className="material-symbols-outlined text-[20px] text-emerald-600 leading-none">
                    check_circle
                  </span>
                )}
                {revealed && isSelected && !isAnswer && (
                  <span className="material-symbols-outlined text-[20px] text-rose-500 leading-none">
                    cancel
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-gutter pb-5 pt-3 bg-background">
        {revealed ? (
          <button
            type="button"
            onClick={next}
            className="w-full py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold squishy-press"
          >
            {index + 1 >= total ? "See results" : "Next question"}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={selected === null}
            className="w-full py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
          >
            Submit answer
          </button>
        )}
      </div>
    </div>
  );
}
