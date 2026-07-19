"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const KINDS = ["notes", "past-questions", "slides", "recordings", "other"] as const;
type Kind = (typeof KINDS)[number];

type Material = {
  key: string;
  course: string;
  kind: string;
  filename: string;
  size: number;
  uploadedAt: string;
  url: string;
};

type Job = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

function human(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminPage() {
  const [tab, setTab] = useState<"upload" | "view">("upload");

  const [course, setCourse] = useState("");
  const [kind, setKind] = useState<Kind>("past-questions");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);

  // View-tab filters
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | Kind>("all");

  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/materials");
    const data = await res.json();
    if (!data.ok) {
      setLoadError(data.error);
      return;
    }
    setLoadError(null);
    setMaterials(data.materials);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (files: File[]) => {
      if (!course.trim()) {
        alert("Enter a course code first — it decides where the file is filed.");
        return;
      }

      for (const file of files) {
        const id = `${file.name}-${file.size}-${Math.round(performance.now())}`;
        setJobs((j) => [
          { id, name: file.name, size: file.size, progress: 0, status: "uploading" },
          ...j,
        ]);

        try {
          const signRes = await fetch("/api/admin/upload-url", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type || "application/octet-stream",
              size: file.size,
              course,
              kind,
            }),
          });
          const signed = await signRes.json();
          if (!signed.ok) throw new Error(signed.error ?? "Could not get an upload URL");

          // XHR, not fetch: fetch still has no upload-progress event, and a silent
          // progress bar on a 100MB recording is useless.
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", signed.uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
            xhr.upload.onprogress = (e) => {
              if (!e.lengthComputable) return;
              const pct = Math.round((e.loaded / e.total) * 100);
              setJobs((j) => j.map((x) => (x.id === id ? { ...x, progress: pct } : x)));
            };
            xhr.onload = () =>
              xhr.status >= 200 && xhr.status < 300
                ? resolve()
                : reject(new Error(`R2 rejected the upload (${xhr.status}). Check bucket CORS.`));
            xhr.onerror = () =>
              reject(new Error("Network error — usually missing CORS on the R2 bucket."));
            xhr.send(file);
          });

          setJobs((j) =>
            j.map((x) => (x.id === id ? { ...x, progress: 100, status: "done" } : x))
          );
          refresh();
        } catch (err) {
          setJobs((j) =>
            j.map((x) =>
              x.id === id
                ? { ...x, status: "error", error: err instanceof Error ? err.message : "Failed" }
                : x
            )
          );
        }
      }
    },
    [course, kind, refresh]
  );

  async function remove(m: Material) {
    if (!confirm(`Delete "${m.filename}" from R2? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/materials?key=${encodeURIComponent(m.key)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.ok) {
      alert(data.error ?? "Delete failed");
      return;
    }
    setMaterials((list) => list.filter((x) => x.key !== m.key));
  }

  const shown = materials.filter((m) => {
    if (kindFilter !== "all" && m.kind !== kindFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.course.toLowerCase().includes(q) ||
      m.filename.toLowerCase().includes(q) ||
      m.kind.toLowerCase().includes(q)
    );
  });
  const totalBytes = materials.reduce((n, m) => n + m.size, 0);

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-5 py-8">
      <header>
        <h1 className="font-display text-[26px] font-bold text-on-surface">Material uploads</h1>
        <p className="mt-0.5 font-body text-[13px] text-on-surface/55">
          {materials.length} file{materials.length === 1 ? "" : "s"} · {human(totalBytes)} in R2
        </p>
      </header>

      {/* Tabs */}
      <div className="mt-5 inline-flex rounded-full bg-surface-container p-1">
        {(["upload", "view"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 font-display text-[13px] font-semibold transition-colors ${
              tab === t ? "bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-black/55"
            }`}
          >
            {t === "upload" ? "Upload" : `View Materials${materials.length ? ` (${materials.length})` : ""}`}
          </button>
        ))}
      </div>

      {loadError && (
        <p className="mt-4 rounded-xl bg-error-container px-4 py-3 font-body text-[13px] font-medium text-error">
          {loadError}
        </p>
      )}

      {/* ---------- Upload tab ---------- */}
      {tab === "upload" && (
        <section className="mt-5 rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-inset ring-black/[0.06] shadow-[0_10px_24px_-16px_rgba(16,24,40,0.25)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-on-surface">
                Course code
              </label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value.toUpperCase())}
                placeholder="CSC 202.2"
                className="w-full rounded-xl border border-outline-variant/50 bg-background px-3 py-2.5 font-body text-[14px] text-on-surface focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-on-surface">
                Type
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
                className="w-full rounded-xl border border-outline-variant/50 bg-background px-3 py-2.5 font-body text-[14px] text-on-surface focus:border-brand focus:outline-none"
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              upload(Array.from(e.dataTransfer.files));
            }}
            onClick={() => fileRef.current?.click()}
            className={`mt-4 cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? "border-brand bg-brand/[0.06]" : "border-outline-variant/60 hover:border-brand/40"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                upload(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
            <p className="font-display text-sm font-semibold text-on-surface">
              Drop files here, or click to choose
            </p>
            <p className="mt-1 font-body text-[12px] text-on-surface/50">
              Uploads go straight to R2 · up to 200MB each
            </p>
          </div>

          {jobs.length > 0 && (
            <div className="mt-4 space-y-2">
              {jobs.map((j) => (
                <div key={j.id} className="rounded-xl bg-surface-container px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 flex-1 truncate font-body text-[13px] font-medium text-on-surface">
                      {j.name}
                    </span>
                    <span className="shrink-0 font-display text-[11px] font-semibold text-on-surface/55">
                      {j.status === "done"
                        ? "Uploaded"
                        : j.status === "error"
                          ? "Failed"
                          : `${j.progress}%`}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-black/[0.07]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        j.status === "error" ? "bg-error" : "bg-brand"
                      }`}
                      style={{ width: `${j.status === "error" ? 100 : j.progress}%` }}
                    />
                  </div>
                  {j.error && (
                    <p className="mt-1 font-body text-[11px] font-medium text-error">{j.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------- View tab ---------- */}
      {tab === "view" && (
        <section className="mt-5">
          {/* Filters */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course, name or type"
              className="min-w-[200px] flex-1 rounded-full border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2 font-body text-[13px] text-on-surface focus:border-brand focus:outline-none"
            />
            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as "all" | Kind)}
              className="rounded-full border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2 font-display text-[13px] font-semibold text-on-surface focus:border-brand focus:outline-none"
            >
              <option value="all">All types</option>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {shown.length === 0 ? (
            <p className="rounded-2xl bg-surface-container-lowest px-4 py-10 text-center font-body text-[13px] text-on-surface/50 ring-1 ring-inset ring-black/[0.06]">
              {materials.length === 0 ? "Nothing uploaded yet." : "No files match those filters."}
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-black/[0.06]">
              {shown.map((m, i) => (
                <div
                  key={m.key}
                  className={`flex items-center gap-3 bg-surface-container-lowest px-4 py-3 ${
                    i > 0 ? "border-t border-outline-variant/30" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-[14px] font-semibold text-on-surface">
                      {m.filename}
                    </p>
                    <p className="mt-0.5 font-body text-[11px] text-on-surface/50">
                      {m.course} · {m.kind} · {human(m.size)} ·{" "}
                      {new Date(m.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-surface-container px-3 py-1.5 font-display text-[12px] font-semibold text-on-surface-variant"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(m.url)}
                    className="shrink-0 rounded-full bg-surface-container px-3 py-1.5 font-display text-[12px] font-semibold text-on-surface-variant"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    className="shrink-0 rounded-full px-3 py-1.5 font-display text-[12px] font-semibold text-error hover:bg-error-container"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
