"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import RequestForm from "@/components/materials/RequestForm";
import ContributeForm from "@/components/materials/ContributeForm";
import { startPracticeSession } from "@/lib/practice-session";
import { setGeneratedQuiz } from "@/lib/generated-quiz";
import { getUserCourses } from "@/lib/store";

type Material = {
  id: string;
  title: string;
  courseCode: string | null;
  url: string;
  ext: string | null;
  size: number | null;
  shared: boolean;
  createdAt: string;
};

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

function human(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// A cute, colour-coded icon tile per file type.
function fileTile(ext: string | null): { bg: string; fg: string; icon: string } {
  const e = (ext || "").toLowerCase();
  if (e === "pdf") return { bg: "bg-rose-100", fg: "text-rose-600", icon: "picture_as_pdf" };
  if (e === "doc" || e === "docx") return { bg: "bg-blue-100", fg: "text-blue-600", icon: "description" };
  if (e === "ppt" || e === "pptx") return { bg: "bg-amber-100", fg: "text-amber-600", icon: "slideshow" };
  if (e === "txt" || e === "md" || e === "csv") return { bg: "bg-emerald-100", fg: "text-emerald-600", icon: "description" };
  return { bg: "bg-primary/10", fg: "text-primary", icon: "draft" };
}

// PDFs and text files can be turned into practice; others can only be stored/viewed.
const PRACTICEABLE = new Set(["pdf", "txt", "md", "csv"]);

export default function MyMaterialsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"mine" | "request" | "contribute">("mine");
  const fileRef = useRef<HTMLInputElement>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upload, setUpload] = useState<{ name: string; pct: number } | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [uploadCourse, setUploadCourse] = useState("");
  const [uploadShare, setUploadShare] = useState(false);

  useEffect(() => {
    setCourses(getUserCourses().map((c) => c.code));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/my/materials");
      const data = await res.json();
      if (data.ok) {
        setMaterials(data.materials);
        setError(null);
      } else {
        setError(data.error ?? "Failed to load");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFile(file: File) {
    setError(null);
    setUpload({ name: file.name, pct: 0 });
    try {
      const signRes = await fetch("/api/my/materials/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });
      const signed = await signRes.json();
      if (!signed.ok) throw new Error(signed.error ?? "Could not start upload");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed.uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUpload({ name: file.name, pct: Math.round((e.loaded / e.total) * 100) });
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`));
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
      const saveRes = await fetch("/api/my/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          key: signed.key,
          url: signed.publicUrl,
          ext,
          size: file.size,
          courseCode: uploadCourse || undefined,
          shared: uploadShare && !!uploadCourse,
        }),
      });
      const saved = await saveRes.json();
      if (!saved.ok) throw new Error(saved.error ?? "Could not save material");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUpload(null);
    }
  }

  async function practice(m: Material) {
    setError(null);
    setGeneratingId(m.id);
    try {
      const res = await fetch("/api/my/materials/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, count: 10 }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Could not build practice");
      setGeneratedQuiz({ title: data.title, questions: data.questions });
      startPracticeSession();
      router.push(
        `/study/quiz?course=${encodeURIComponent(data.title)}&count=${data.questions.length}&mode=Objective&source=material`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build practice");
      setGeneratingId(null);
    }
  }

  async function remove(m: Material) {
    if (!confirm(`Delete "${m.title}"? This can't be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/my/materials?id=${encodeURIComponent(m.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Delete failed");
      setMaterials((list) => list.filter((x) => x.id !== m.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className={FRAME}>
      <BackHeader title="Materials" />

      <main className="px-gutter pb-28 pt-2">
        {/* My files / Request / Contribute segmented tabs */}
        <div className="mb-5 flex rounded-full bg-surface-container p-1">
          {([
            ["mine", "Uploads"],
            ["request", "Request"],
            ["contribute", "Contribute"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 rounded-full py-2 font-display text-[13px] font-semibold transition-all squishy-press ${
                tab === key
                  ? "bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-on-surface-variant"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "request" ? (
          <RequestForm />
        ) : tab === "contribute" ? (
          <ContributeForm />
        ) : (
          <>
        <p className="font-display text-sm font-medium text-on-surface-variant mb-4">
          Upload your notes or past questions, then generate practice from them.
        </p>

        {/* Optional course tag + opt-in share with coursemates */}
        <div className="mb-3 space-y-2">
          <select
            value={uploadCourse}
            onChange={(e) => {
              setUploadCourse(e.target.value);
              if (!e.target.value) setUploadShare(false);
            }}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 font-body text-[13px] text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">No course (private)</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {uploadCourse && (
            <label className="flex cursor-pointer items-center gap-2 px-1">
              <input
                type="checkbox"
                checked={uploadShare}
                onChange={(e) => setUploadShare(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span className="font-body text-[12px] text-on-surface-variant">
                Share with coursemates taking {uploadCourse}
              </span>
            </label>
          )}
        </div>

        {/* Upload box */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt,.md,.csv,.doc,.docx,.ppt,.pptx,image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={!!upload}
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant/60 bg-surface-container-lowest px-6 py-9 text-center hover:border-primary/40 transition-colors squishy-press disabled:opacity-60"
        >
          <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px] leading-none">cloud_upload</span>
          </span>
          <span className="font-display text-sm font-semibold text-on-surface">
            {upload ? `Uploading… ${upload.pct}%` : "Tap to upload"}
          </span>
          <span className="font-display text-xs font-medium text-on-surface-variant">
            PDF or text works best for practice · up to 30MB
          </span>
        </button>

        {upload && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${upload.pct}%` }} />
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-error-container px-4 py-3 font-body text-[13px] font-medium text-error">
            {error}
          </p>
        )}

        {/* List */}
        <div className="mt-7">
          <h2 className="font-display text-[15px] font-bold text-on-surface mb-3 ml-1">
            Your materials{materials.length ? ` (${materials.length})` : ""}
          </h2>

          {loading ? (
            <p className="font-body text-[13px] text-on-surface-variant py-6 text-center">Loading…</p>
          ) : materials.length === 0 ? (
            <p className="rounded-2xl bg-surface-container-lowest px-4 py-10 text-center font-body text-[13px] text-on-surface-variant ring-1 ring-inset ring-outline-variant/30">
              Nothing uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {materials.map((m) => {
                const canPractice = PRACTICEABLE.has((m.ext || "").toLowerCase());
                const busy = generatingId === m.id;
                const tile = fileTile(m.ext);
                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tile.bg} ${tile.fg}`}>
                        <span className="material-symbols-outlined text-[18px] leading-none">{tile.icon}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-[13px] font-semibold text-on-surface">{m.title}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 font-body text-[11px] text-on-surface-variant">
                          <span>
                            {[m.courseCode, (m.ext || "").toUpperCase(), human(m.size), new Date(m.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                          {m.shared && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700">
                              <span className="material-symbols-outlined text-[11px] leading-none">share</span>
                              Shared
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => remove(m)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">close</span>
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      {canPractice ? (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => router.push(`/study/my-materials/read?id=${encodeURIComponent(m.id)}`)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary/10 py-2 font-display text-[12px] font-semibold text-primary disabled:opacity-40 squishy-press"
                          >
                            <span className="material-symbols-outlined text-[15px] leading-none">auto_awesome</span>
                            Easy Read
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => practice(m)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2 font-display text-[12px] font-semibold text-on-primary disabled:opacity-40 squishy-press"
                          >
                            <span className="material-symbols-outlined text-[15px] leading-none">bolt</span>
                            {busy ? "…" : "Practice"}
                          </button>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open file"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant squishy-press"
                          >
                            <span className="material-symbols-outlined text-[17px] leading-none">download</span>
                          </a>
                        </>
                      ) : (
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-container py-2 font-display text-[12px] font-semibold text-on-surface-variant squishy-press"
                        >
                          <span className="material-symbols-outlined text-[15px] leading-none">download</span>
                          Open file
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
          </>
        )}
      </main>
    </div>
  );
}
