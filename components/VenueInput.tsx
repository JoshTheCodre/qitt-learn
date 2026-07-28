"use client";

import { useState } from "react";

/**
 * Search-and-add venue field: type to filter venues you (or the sample data) have used
 * before, tap one to reuse it, or just keep typing to add a brand-new venue. There's no
 * separate "save venue" step — a venue becomes reusable once it's on a saved class.
 */
export default function VenueInput({
  value,
  onChange,
  suggestions,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const q = value.trim().toLowerCase();

  const matches = suggestions
    .filter((s) => (q ? s.toLowerCase().includes(q) : true) && s.toLowerCase() !== q)
    .slice(0, 6);

  const canAdd = q.length > 0 && !suggestions.some((s) => s.toLowerCase() === q);

  return (
    <div className="relative">
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          location_on
        </span>
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)} // let a click land first
          placeholder="Search or add a venue"
          className={`w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest py-2.5 pl-9 pr-3 font-body text-[14px] text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none ${className}`}
        />
      </div>

      {open && (matches.length > 0 || canAdd) && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-outline-variant/50 bg-surface-container-lowest py-1 shadow-lg">
          {matches.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left font-body text-[13px] text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[16px] leading-none text-on-surface-variant">
                location_on
              </span>
              {s}
            </button>
          ))}
          {canAdd && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left font-display text-[13px] font-semibold text-primary hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[16px] leading-none">add</span>
              Add &ldquo;{value.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
