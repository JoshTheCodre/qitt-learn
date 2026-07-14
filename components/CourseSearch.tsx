"use client";

import { useEffect, useMemo, useState } from "react";
import { loadCatalog, searchCatalog, type CatalogCourse } from "@/lib/catalog";
import { haptic } from "@/lib/haptics";

export default function CourseSearch({
  excludeCodes,
  onSelect,
  onCancel,
}: {
  /** Codes already added — shown as disabled, so you can't add the same course twice. */
  excludeCodes: string[];
  onSelect: (course: CatalogCourse) => void;
  onCancel: () => void;
}) {
  const [all, setAll] = useState<CatalogCourse[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    loadCatalog()
      .then((c) => alive && setAll(c))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const taken = useMemo(
    () => new Set(excludeCodes.map((c) => c.replace(/\s+/g, "").toUpperCase())),
    [excludeCodes]
  );

  const results = useMemo(
    () => (all ? searchCatalog(all, query) : []),
    [all, query]
  );

  return (
    <div className="py-3">
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          search
        </span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={all ? "Search course code or title" : "Loading courses…"}
          disabled={!all && !error}
          className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest py-2.5 pl-9 pr-3 font-display text-[13px] font-medium text-on-surface placeholder:font-normal placeholder:text-on-surface-variant focus:border-brand focus:outline-none disabled:opacity-60"
        />
      </div>

      {error && (
        <p className="mt-2 font-body text-[11px] font-medium text-error">
          Couldn&apos;t load the course list. Check your connection and try again.
        </p>
      )}

      {all && query.trim() && results.length === 0 && (
        <p className="py-4 text-center font-display text-xs text-on-surface-variant">
          No course matches &ldquo;{query.trim()}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-2 max-h-64 space-y-0.5 overflow-y-auto">
          {results.map((c) => {
            const already = taken.has(c.code.replace(/\s+/g, "").toUpperCase());
            return (
              <button
                key={c.code}
                type="button"
                disabled={already}
                onClick={() => {
                  haptic("select");
                  onSelect(c);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-container disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[13px] font-semibold text-on-surface">
                    {c.code}
                  </p>
                  <p className="truncate font-body text-[11px] font-medium text-on-surface/55">
                    {c.title}
                  </p>
                </div>
                <span className="shrink-0 rounded bg-surface-container px-1.5 py-0.5 font-display text-[10px] font-semibold text-on-surface-variant">
                  {already ? "Added" : `${c.unit}u`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="mt-2 w-full rounded-xl bg-surface-container py-2.5 font-display text-[13px] font-semibold text-on-surface-variant squishy-press"
      >
        Cancel
      </button>
    </div>
  );
}
