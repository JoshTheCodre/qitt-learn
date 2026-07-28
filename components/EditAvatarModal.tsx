"use client";

import { useState } from "react";
import AvatarPicker from "@/components/AvatarPicker";
import { randomAvatarUrl } from "@/lib/avatars";
import { haptic } from "@/lib/haptics";

export default function EditAvatarModal({
  value,
  name,
  onSave,
  onClose,
}: {
  value: string | null;
  name: string;
  onSave: (url: string | null) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<string | null>(value);

  const initials =
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-[430px] max-h-[85vh] overflow-y-auto no-scrollbar rounded-t-3xl bg-background px-5 pt-4 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant/50" />

        <h3 className="font-display text-[18px] font-bold text-on-surface">Profile picture</h3>
        <p className="mt-1 font-body text-[13px] text-on-surface/55">
          Pick an avatar or shuffle for a fresh one.
        </p>

        {/* Live preview of the pending choice */}
        <div className="mt-4 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 via-primary to-sky-500 text-2xl font-bold text-white ring-4 ring-surface-container">
            {draft ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft} alt="" className="h-full w-full object-cover" draggable={false} />
            ) : (
              initials
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            haptic("select");
            // A brand-new random face on each tap — Math.random() is fine here (client only).
            setDraft(randomAvatarUrl(`${name}-${Math.random()}`));
          }}
          className="mx-auto mt-3 flex items-center gap-1.5 rounded-full bg-surface-container px-4 py-2 font-display text-[13px] font-semibold text-on-surface squishy-press"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">refresh</span>
          Surprise me
        </button>

        <div className="mt-5">
          <AvatarPicker value={draft} onChange={setDraft} />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-surface-container py-3.5 font-display text-sm font-semibold text-on-surface squishy-press"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              haptic("select");
              onSave(draft);
              onClose();
            }}
            className="flex-1 rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-on-primary squishy-press"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
