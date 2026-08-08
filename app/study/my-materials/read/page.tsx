"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BackHeader from "@/components/BackHeader";

type StudyNotes = {
  overview: string;
  sections: { heading: string; explanation: string; everyday: string }[];
  takeaways: string[];
};

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

function ReadView() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState<StudyNotes | null>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setStatus("error");
      setError("No material selected.");
      return;
    }
    let alive = true;
    setStatus("loading");
    fetch("/api/my/materials/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok) {
          setTitle(d.title || "");
          setNotes(d.notes as StudyNotes);
          setStatus("done");
        } else {
          setError(d.error ?? "Could not create the summary.");
          setStatus("error");
        }
      })
      .catch(() => {
        if (alive) {
          setError("Could not reach the server.");
          setStatus("error");
        }
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className={FRAME}>
      <BackHeader title="Easy Read" />
      <main className="px-gutter pb-28 pt-2">
        {title && (
          <p className="font-body text-[12px] font-semibold uppercase tracking-wide text-on-surface-variant mb-4">
            {title}
          </p>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[34px] text-primary animate-pulse leading-none">
              auto_awesome
            </span>
            <p className="mt-4 font-display text-sm font-semibold text-on-surface">
              Breaking this down for you…
            </p>
            <p className="mt-1 font-body text-[12px] text-on-surface-variant max-w-[240px]">
              Reading your material and writing an easy-to-understand summary. This can take a moment.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 rounded-2xl bg-error-container px-4 py-6 text-center">
            <p className="font-body text-[13px] font-medium text-error">{error}</p>
          </div>
        )}

        {status === "done" && notes && (
          <div className="space-y-6">
            {notes.overview && (
              <section>
                <h2 className="font-display text-[16px] font-bold text-on-surface mb-2">In a nutshell</h2>
                <p className="font-body text-[14px] leading-relaxed text-on-surface/80">{notes.overview}</p>
              </section>
            )}

            {notes.sections.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-display text-[16px] font-bold text-on-surface">Broken down</h2>
                {notes.sections.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4"
                  >
                    <p className="font-display text-[14px] font-bold text-on-surface">{s.heading}</p>
                    {s.explanation && (
                      <p className="mt-1.5 font-body text-[13px] leading-relaxed text-on-surface/80">
                        {s.explanation}
                      </p>
                    )}
                    {s.everyday && (
                      <div className="mt-3 rounded-xl bg-primary/[0.06] px-3 py-2.5">
                        <p className="font-display text-[11px] font-bold uppercase tracking-wide text-primary mb-1">
                          In everyday life
                        </p>
                        <p className="font-body text-[13px] leading-relaxed text-on-surface/80">{s.everyday}</p>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {notes.takeaways.length > 0 && (
              <section>
                <h2 className="font-display text-[16px] font-bold text-on-surface mb-2">Key takeaways</h2>
                <ul className="space-y-2">
                  {notes.takeaways.map((t, i) => (
                    <li key={i} className="flex gap-2 font-body text-[13px] leading-relaxed text-on-surface/80">
                      <span className="material-symbols-outlined text-[16px] leading-[1.4] text-primary shrink-0">
                        check_circle
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function EasyReadPage() {
  return (
    <Suspense fallback={<div className={FRAME} />}>
      <ReadView />
    </Suspense>
  );
}
