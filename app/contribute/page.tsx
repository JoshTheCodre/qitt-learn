"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";

export default function ContributeMaterialPage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [requestId, setRequestId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName) return;
    setSubmitted(true);
  }

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Contribute Material" />

      {submitted ? (
        <div className="px-gutter pt-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-emerald-600 leading-none">
              task_alt
            </span>
          </div>
          <h2 className="mt-6 font-display text-[20px] font-bold text-on-surface">Thanks for sharing!</h2>
          <p className="mt-2 font-display text-sm font-medium text-on-surface-variant max-w-[280px]">
            Your material is under review and will be available to your coursemates soon.
          </p>
          <div className="mt-10 w-full flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFileName(null);
                setRequestId("");
              }}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold squishy-press"
            >
              Contribute another
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
        <form onSubmit={handleSubmit} className="px-gutter pt-8">
          <p className="font-display text-sm font-medium text-on-surface-variant text-center max-w-[300px] mx-auto">
            Upload your notes, slides or past questions to help your coursemates.
          </p>

          {/* Upload component */}
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-10 w-full flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-outline-variant/60 bg-surface-container-lowest px-6 py-14 text-center hover:border-primary/40 transition-colors squishy-press"
          >
            <span className="w-16 h-16 rounded-2xl bg-emerald-100/70 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-emerald-700 leading-none">
                {fileName ? "description" : "upload_file"}
              </span>
            </span>
            <span className="font-display text-base font-semibold text-on-surface">
              {fileName ?? "Tap to upload"}
            </span>
            <span className="font-display text-xs font-medium text-on-surface-variant">
              {fileName ? "Tap to change file" : "PDF, DOCX, PPT or image"}
            </span>
          </button>

          {/* Request ID (optional) */}
          <div className="mt-6">
            <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
              Request ID{" "}
              <span className="font-normal normal-case text-on-surface-variant/60">(optional)</span>
            </label>
            <input
              value={requestId}
              onChange={(e) => setRequestId(e.target.value.toUpperCase())}
              placeholder="e.g. REQ-1024 — if fulfilling a request"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-display text-sm font-medium text-on-surface placeholder:font-normal placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={!fileName}
            className="mt-10 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">cloud_upload</span>
            Upload Material
          </button>
        </form>
      )}
    </div>
  );
}
