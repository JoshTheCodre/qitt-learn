"use client";

import { useRef } from "react";

const FIELD =
  "w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-display text-sm font-medium text-on-surface focus:outline-none focus:border-primary";
const LABEL =
  "block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2";

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  glow = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  // Wrap the control in a drifting green gradient ring. Opt-in, so the plain
  // selects on other pages are untouched.
  glow?: boolean;
}) {
  const control = (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} appearance-none pr-10 ${
          // The ring IS the border when glowing — keeping the grey one too would double it up.
          glow ? "rounded-[10px] border-transparent" : ""
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
        expand_more
      </span>
    </div>
  );

  return (
    <div>
      <label className={LABEL}>{label}</label>
      {glow ? <div className="animated-field rounded-xl p-[1.5px]">{control}</div> : control}
    </div>
  );
}

export function UploadBox({
  fileName,
  onFile,
  accent = "primary",
}: {
  fileName: string | null;
  onFile: (name: string | null) => void;
  accent?: "primary" | "amber" | "emerald";
}) {
  const ref = useRef<HTMLInputElement>(null);
  const tile =
    accent === "amber"
      ? "bg-amber-100/70 text-amber-700"
      : accent === "emerald"
        ? "bg-emerald-100/70 text-emerald-700"
        : "bg-primary/10 text-primary";

  return (
    <div>
      <label className={LABEL}>Upload media</label>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0]?.name ?? null)}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant/60 bg-surface-container-lowest px-6 py-9 text-center hover:border-primary/40 transition-colors squishy-press"
      >
        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tile}`}>
          <span className="material-symbols-outlined text-[26px] leading-none">
            {fileName ? "description" : "add_photo_alternate"}
          </span>
        </span>
        <span className="font-display text-sm font-semibold text-on-surface">
          {fileName ?? "Upload media"}
        </span>
        <span className="font-display text-xs font-medium text-on-surface-variant">
          {fileName ? "Tap to change" : "PDF, slides or image"}
        </span>
      </button>
    </div>
  );
}
