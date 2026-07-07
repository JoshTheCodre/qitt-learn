"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { MATERIAL_TYPES } from "@/lib/materials";

export default function RequestMaterialPage() {
  const router = useRouter();
  const [course, setCourse] = useState("");
  const [type, setType] = useState<string>("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = course && type;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  }

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Request Material" />

      {submitted ? (
        <div className="px-gutter pt-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-amber-600 leading-none">
              task_alt
            </span>
          </div>
          <h2 className="mt-6 font-display text-[20px] font-bold text-on-surface">Request sent</h2>
          <p className="mt-2 font-display text-sm font-medium text-on-surface-variant max-w-[280px]">
            We&apos;ll notify you once someone contributes this material.
          </p>
          <div className="mt-10 w-full flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setCourse("");
                setType("");
                setDetails("");
              }}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold squishy-press"
            >
              Request another
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-3.5 rounded-2xl bg-surface-container text-on-surface font-display text-sm font-semibold squishy-press"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-gutter pt-6 pb-32">
          <div className="flex items-center gap-3 mb-9">
            <span className="w-11 h-11 rounded-xl bg-amber-100/70 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-700 leading-none">request_page</span>
            </span>
            <p className="font-display text-sm font-medium text-on-surface-variant">
              Can&apos;t find what you need? Request it and we&apos;ll alert you when it&apos;s shared.
            </p>
          </div>

          <div className="space-y-7">
            {/* Course */}
            <div>
              <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
                Course
              </label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. CSC 202.2"
                className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-display text-sm font-medium text-on-surface placeholder:font-normal placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
            </div>

            {/* Material type */}
            <div>
              <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
                Material type
              </label>
              <div className="flex flex-wrap gap-2">
                {MATERIAL_TYPES.map((t) => {
                  const active = t === type;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-full px-4 py-2 font-display text-xs font-semibold transition-all squishy-press ${
                        active
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50 hover:border-primary/30"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
                Details{" "}
                <span className="font-normal normal-case text-on-surface-variant/60">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Describe what you're looking for — topic, lecturer, year…"
                className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-display text-sm font-medium text-on-surface placeholder:font-normal placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-10 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
          >
            <span
              className="material-symbols-outlined text-[18px] leading-none -rotate-[18deg] -translate-y-px"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
            Send Request
          </button>
        </form>
      )}
    </div>
  );
}
