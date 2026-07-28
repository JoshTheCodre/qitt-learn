"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BackHeader from "@/components/BackHeader";
import { resolveCourse, type ResolvedCourse } from "@/lib/store";
import { groupByType, typeMeta, type MaterialItem } from "@/lib/materials";

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

export default function CourseMaterialsPage() {
  const slug = String(useParams().slug);
  const [course, setCourse] = useState<ResolvedCourse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    const c = resolveCourse(slug);
    setCourse(c);
    setLoaded(true);
  }, [slug]);

  // Pull the real library for this course once we know its code. The code is matched
  // suffix-tolerantly server-side ("GES 103.1" → "GES 103"), so carryovers work too.
  useEffect(() => {
    if (!course) return;
    let alive = true;
    setStatus("loading");
    fetch(`/api/materials?code=${encodeURIComponent(course.code)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.ok) {
          setMaterials(data.materials as MaterialItem[]);
          setStatus("done");
        } else {
          setStatus("error");
        }
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [course]);

  if (!loaded) return <div className={FRAME} />;
  if (!course) {
    return (
      <div className={FRAME}>
        <BackHeader title="Course Materials" />
        <p className="px-gutter pt-8 font-display text-sm font-medium text-on-surface-variant">
          Course not found.
        </p>
      </div>
    );
  }

  const groups = groupByType(materials);

  return (
    <div className={FRAME}>
      <BackHeader title="Course Materials" />

      <main className="px-gutter pt-2 pb-28">
        <div className="mb-6">
          <p className="font-display text-xs font-semibold text-primary">{course.code}</p>
          <h2 className="mt-1 font-display text-[18px] font-bold text-on-surface leading-tight">
            {course.title}
          </h2>
          <p className="mt-1.5 font-display text-xs font-medium text-on-surface-variant">
            {status === "loading"
              ? "Finding materials…"
              : `${materials.length} file${materials.length === 1 ? "" : "s"} available`}
          </p>
        </div>

        {status === "loading" && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[72px] animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container/60"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="material-symbols-outlined text-[36px] text-outline-variant">cloud_off</span>
            <p className="font-display text-sm font-medium text-on-surface-variant">
              Couldn&apos;t load materials. Check your connection and try again.
            </p>
          </div>
        )}

        {status === "done" && materials.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <span className="material-symbols-outlined text-[40px] text-outline-variant">
              search_off
            </span>
            <p className="font-display text-sm font-semibold text-on-surface">
              No materials for {course.code} yet
            </p>
            <p className="max-w-[260px] font-body text-[13px] leading-snug text-on-surface-variant">
              Nothing has been uploaded for this course. You can request it and we&apos;ll add it
              when it&apos;s available.
            </p>
            <Link
              href="/request"
              className="mt-2 rounded-full bg-primary px-5 py-2.5 font-display text-[13px] font-semibold text-on-primary squishy-press"
            >
              Request material
            </Link>
          </div>
        )}

        {status === "done" && groups.length > 0 && (
          <div className="space-y-7">
            {groups.map(({ type, items }) => {
              const meta = typeMeta(type);
              return (
                <section key={type}>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.wrap}`}
                    >
                      <span className="material-symbols-outlined text-[16px] leading-none">
                        {meta.icon}
                      </span>
                    </span>
                    <h3 className="font-display text-[14px] font-bold text-on-surface">
                      {meta.label}
                    </h3>
                    <span className="rounded-full bg-surface-container px-2 py-0.5 font-display text-[11px] font-semibold text-on-surface-variant">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {items.map((m) => (
                      <a
                        key={m.id}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-3.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] bento-card-hover squishy-press"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-[22px] leading-none">
                            description
                          </span>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold text-on-surface">
                            {m.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-on-surface-variant">
                            {m.format && <span>{m.format}</span>}
                            {m.size && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-on-surface-variant/40" />
                                <span>{m.size}</span>
                              </>
                            )}
                            {m.pages != null && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-on-surface-variant/40" />
                                <span>{m.pages} pages</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span
                          aria-label="View"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary"
                        >
                          <span className="material-symbols-outlined text-[20px] leading-none">
                            visibility
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
