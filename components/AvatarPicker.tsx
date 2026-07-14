"use client";

import { useState } from "react";
import { avatarChoices } from "@/lib/avatars";
import { haptic } from "@/lib/haptics";

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [page, setPage] = useState(0);
  const choices = avatarChoices(page);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface">
          Profile icon
        </label>
        <button
          type="button"
          onClick={() => {
            haptic("select");
            setPage((p) => p + 1);
          }}
          className="flex items-center gap-1 rounded-full px-2 py-1 font-display text-[11px] font-semibold text-brand active:opacity-70"
        >
          <span className="material-symbols-outlined text-[14px] leading-none">refresh</span>
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {choices.map((c) => {
          const selected = value === c.url;
          return (
            <button
              key={c.id}
              type="button"
              aria-label={`Use the ${c.style} avatar`}
              aria-pressed={selected}
              onClick={() => {
                haptic("select");
                // Tapping the selected one again clears it — the field is optional.
                onChange(selected ? null : c.url);
              }}
              className={`relative aspect-square overflow-hidden rounded-2xl bg-surface-container transition-all squishy-press ${
                selected
                  ? "ring-2 ring-brand ring-offset-2 ring-offset-background"
                  : "ring-1 ring-inset ring-black/[0.06] hover:ring-brand/30"
              }`}
            >
              {/* Plain <img>: these are remote SVGs, which next/image cannot optimise
                  anyway — it would only add a round trip through the optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.url}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
              {selected && (
                <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                  <span className="material-symbols-outlined text-[11px] leading-none text-white">
                    check_circle
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-2 font-body text-[10px] font-medium text-on-surface/45">
        Optional — you can pick one now or later.
      </p>
    </div>
  );
}
