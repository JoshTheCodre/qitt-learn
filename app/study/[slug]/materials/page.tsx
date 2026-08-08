"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BackHeader from "@/components/BackHeader";
import { resolveCourse, type ResolvedCourse } from "@/lib/store";
import { groupByType, typeMeta, type MaterialItem } from "@/lib/materials";

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

type Upload = {
  id: string;
  title: string;
  url: string;
  ext: string | null;
  size: number | null;
  uploader: string | null;
  createdAt: string;
};

type Status = "idle" | "loading" | "done" | "error";

function human(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function CourseMaterialsPage() {
  const slug = String(useParams().slug);
  const [course, setCourse] = useState<ResolvedCourse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"community" | "uploads">("community");

  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploadsStatus, setUploadsStatus] = useState<Status>("idle");

  useEffect(() => {
    setCourse(resolveCourse(slug));
    setLoaded(true);
  }, [slug]);

  // Curated library (admin-published) for this course.
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
        } else setStatus("error");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [course]);

  // Coursemates' shared uploads for this course.
  useEffect(() => {
    if (!course) return;
    let alive = true;
    setUploadsStatus("loading");
    fetch(`/api/materials/community?code=${encodeURIComponent(course.code)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.ok) {
          setUploads(data.materials as Upload[]);
          setUploadsStatus("done");
        } else setUploadsStatus("error");
      })
      .catch(() => alive && setUploadsStatus("error"));
    return () => {
      alive = false;
    };
  }, [course]);

  if (!loaded) return <div className={FRAME} />;
  if (!course) {
    return (
      <div className={FRAME}>
        <BackHeader title="Course Materials" />
        <p className="px-gutter pt-8 font-display text-sm font-medium text-on-surface-variant">Course not found.</p>
      </div>
    );
  }

  const groups = groupByType(materials);

  return (
    <div className={FRAME}>
      <BackHeader title="Course Materials" />

      <main className="px-gutter pt-2 pb-28">
        <div className="mb-4">
          <p className="font-display text-xs font-semibold text-primary">{course.code}</p>
          <h2 className="mt-1 font-display text-[18px] font-bold leading-tight text-on-surface">{course.title}</h2>
        </div>

        {/* Community / User uploads tabs */}
        <div className="mb-5 flex rounded-full bg-surface-container p-1">
          {([
            ["community", "Community", materials.length],
            ["uploads", "User uploads", uploads.length],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 font-display text-[13px] font-semibold transition-all squishy-press ${
                tab === key
                  ? "bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-on-surface-variant"
              }`}
            >
              {label}
              <span className={`font-body text-[11px] font-bold ${tab === key ? "text-primary" : "text-on-surface/40"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {tab === "community" ? (
          <CommunityTab status={status} groups={groups} count={materials.length} courseCode={course.code} />
        ) : (
          <UploadsTab status={uploadsStatus} uploads={uploads} />
        )}
      </main>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[72px] animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container/60" />
      ))}
    </div>
  );
}

function ErrorRow() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="material-symbols-outlined text-[36px] text-outline-variant">cloud_off</span>
      <p className="font-display text-sm font-medium text-on-surface-variant">
        Couldn&apos;t load. Check your connection and try again.
      </p>
    </div>
  );
}

function CommunityTab({
  status,
  groups,
  count,
  courseCode,
}: {
  status: Status;
  groups: ReturnType<typeof groupByType>;
  count: number;
  courseCode: string;
}) {
  if (status === "loading") return <LoadingRows />;
  if (status === "error") return <ErrorRow />;
  if (count === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-center">
        <span className="material-symbols-outlined text-[40px] text-outline-variant">search_off</span>
        <p className="font-display text-sm font-semibold text-on-surface">No materials for {courseCode} yet</p>
        <p className="max-w-[260px] font-body text-[13px] leading-snug text-on-surface-variant">
          Nothing curated for this course yet. Request it and we&apos;ll add it when available.
        </p>
        <Link
          href="/request"
          className="mt-2 rounded-full bg-primary px-5 py-2.5 font-display text-[13px] font-semibold text-on-primary squishy-press"
        >
          Request material
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {groups.map(({ type, items }) => {
        const meta = typeMeta(type);
        return (
          <section key={type}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.wrap}`}>
                <span className="material-symbols-outlined text-[16px] leading-none">{meta.icon}</span>
              </span>
              <h3 className="font-display text-[14px] font-bold text-on-surface">{meta.label}</h3>
              <span className="rounded-full bg-surface-container px-2 py-0.5 font-display text-[11px] font-semibold text-on-surface-variant">
                {items.length}
              </span>
            </div>
            <div className="space-y-3">
              {items.map((m) => (
                <FileRow key={m.id} title={m.title} url={m.url} meta={[m.format, m.size, m.pages != null ? `${m.pages} pages` : null]} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function UploadsTab({ status, uploads }: { status: Status; uploads: Upload[] }) {
  if (status === "loading") return <LoadingRows />;
  if (status === "error") return <ErrorRow />;
  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-center">
        <span className="material-symbols-outlined text-[40px] text-outline-variant">cloud_upload</span>
        <p className="font-display text-sm font-semibold text-on-surface">No shared uploads yet</p>
        <p className="max-w-[260px] font-body text-[13px] leading-snug text-on-surface-variant">
          Materials your coursemates share for this course show up here. Be the first —
          upload in My Materials and tick &ldquo;share&rdquo;.
        </p>
        <Link
          href="/study/my-materials"
          className="mt-2 rounded-full bg-primary px-5 py-2.5 font-display text-[13px] font-semibold text-on-primary squishy-press"
        >
          Share yours
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {uploads.map((u) => (
        <FileRow
          key={u.id}
          title={u.title}
          url={u.url}
          meta={[(u.ext || "").toUpperCase() || null, human(u.size) || null, u.uploader ? `by ${u.uploader}` : null]}
        />
      ))}
    </div>
  );
}

function FileRow({ title, url, meta }: { title: string; url: string; meta: (string | null | undefined)[] }) {
  const parts = meta.filter(Boolean) as string[];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bento-card-hover squishy-press flex w-full items-center gap-3.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-[22px] leading-none">description</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold text-on-surface">{title}</p>
        {parts.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-on-surface-variant">
            {parts.map((p, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-on-surface-variant/40" />}
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
      <span aria-label="View" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
        <span className="material-symbols-outlined text-[20px] leading-none">visibility</span>
      </span>
    </a>
  );
}
