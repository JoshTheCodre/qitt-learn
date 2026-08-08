"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav, AdminAuthPrompt } from "@/components/admin/AdminKit";

type Draft = {
  id: string;
  status: string;
  title: string;
  course: string | null;
  dueAt: string | null;
  dueTextRaw: string | null;
  description: string | null;
  postedBy: string | null;
  confidence: number | null;
  sourceMessage: { sender: string; text: string; timestamp: string | null } | null;
};

// ISO → "YYYY-MM-DDTHH:mm" in the admin's timezone (for <input type="datetime-local">).
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function ConfidenceDots({ value }: { value: number }) {
  const filled = Math.max(1, Math.min(4, Math.round(value * 4)));
  const low = value < 0.6;
  return (
    <span title={`Extraction confidence: ${Math.round(value * 100)}%`} className="inline-flex items-center gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < filled ? (low ? "bg-amber-500" : "bg-primary") : "bg-outline-variant"
          }`}
        />
      ))}
    </span>
  );
}

function ReviewCard({
  draft,
  onPublish,
  onDiscard,
  busy,
}: {
  draft: Draft;
  onPublish: (id: string, patch: { title: string; course: string | null; dueAt: string | null; postedBy: string | null }) => void;
  onDiscard: (id: string) => void;
  busy: boolean;
}) {
  const [title, setTitle] = useState(draft.title);
  const [course, setCourse] = useState(draft.course ?? "");
  const [dueLocal, setDueLocal] = useState(toLocalInput(draft.dueAt));
  const [postedBy, setPostedBy] = useState(draft.postedBy ?? "");
  const low = (draft.confidence ?? 0) < 0.6;

  const field =
    "w-full rounded-lg border border-outline-variant/50 bg-background px-3 py-2 font-body text-[13px] text-on-surface focus:border-primary focus:outline-none";

  return (
    <div
      className={`rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-inset ${
        low ? "ring-amber-300" : "ring-black/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {draft.sourceMessage && (
          <div className="min-w-0 flex-1 rounded-lg border-l-2 border-[#25D366] bg-[#25D366]/[0.06] px-3 py-2">
            <p className="font-body text-[11px] font-semibold text-[#0f7a3d]">💬 {draft.sourceMessage.sender}</p>
            <p className="mt-0.5 font-body text-[12px] italic leading-snug text-on-surface/70">
              “{draft.sourceMessage.text}”
            </p>
          </div>
        )}
        <ConfidenceDots value={draft.confidence ?? 0} />
      </div>

      <div className="mt-3 space-y-2">
        <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <div className="grid grid-cols-2 gap-2">
          <input className={field} value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course (e.g. CSC 201)" />
          <input className={field} type="datetime-local" value={dueLocal} onChange={(e) => setDueLocal(e.target.value)} />
        </div>
        <input className={field} value={postedBy} onChange={(e) => setPostedBy(e.target.value)} placeholder="Posted by (optional)" />
      </div>

      {low && (
        <p className="mt-2 font-body text-[11px] text-amber-700">⚠ Low confidence — double-check the date before publishing.</p>
      )}
      {draft.dueTextRaw && (
        <p className="mt-1 font-body text-[11px] text-on-surface-variant">Message said: “{draft.dueTextRaw}”</p>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onDiscard(draft.id)}
          className="rounded-lg px-3 py-2 font-display text-[13px] font-semibold text-on-surface-variant disabled:opacity-50"
        >
          Discard
        </button>
        <button
          type="button"
          disabled={busy || !title.trim()}
          onClick={() =>
            onPublish(draft.id, {
              title: title.trim(),
              course: course.trim() || null,
              dueAt: dueLocal ? new Date(dueLocal).toISOString() : null,
              postedBy: postedBy.trim() || null,
            })
          }
          className="rounded-lg bg-primary px-4 py-2 font-display text-[13px] font-semibold text-on-primary disabled:opacity-40 squishy-press"
        >
          {busy ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}

export default function AdminAssignmentsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [published, setPublished] = useState<Draft[]>([]);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/assignments");
      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Failed to load");
        return;
      }
      setNeedsAuth(false);
      setError(null);
      setDrafts(data.drafts);
      setPublished(data.published);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function extract() {
    if (!message.trim() || extracting) return;
    setExtracting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: { sender: sender.trim() || undefined, text: message.trim() } }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Extraction failed");
      setDrafts((d) => [data.draft, ...d]);
      setMessage("");
      setSender("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setExtracting(false);
    }
  }

  async function publish(id: string, patch: { title: string; course: string | null; dueAt: string | null; postedBy: string | null }) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Publish failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusyId(null);
    }
  }

  async function discard(id: string) {
    setDrafts((d) => d.filter((x) => x.id !== id));
    setPublished((p) => p.filter((x) => x.id !== id));
    try {
      await fetch(`/api/admin/assignments?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      load();
    }
  }

  if (needsAuth) return <AdminAuthPrompt onUnlock={load} />;

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-5 py-8">
      <AdminNav />
      <header className="mt-5">
        <h1 className="font-display text-[26px] font-bold text-on-surface">Assignments</h1>
        <p className="mt-0.5 font-body text-[13px] text-on-surface/55">
          Paste a class-group message — it&apos;s turned into a draft you review and publish for students.
        </p>
      </header>

      {error && (
        <p className="mt-4 rounded-xl bg-error-container px-4 py-3 font-body text-[13px] font-medium text-error">
          {error}
        </p>
      )}

      {/* Ingest box */}
      <section className="mt-5 rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-inset ring-black/[0.06]">
        <input
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Sender / class rep name (optional)"
          className="mb-2 w-full rounded-lg border border-outline-variant/50 bg-background px-3 py-2 font-body text-[13px] text-on-surface focus:border-primary focus:outline-none"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste the WhatsApp / class-group message here…"
          rows={3}
          className="w-full resize-y rounded-lg border border-outline-variant/50 bg-background px-3 py-2 font-body text-[13px] text-on-surface focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          disabled={!message.trim() || extracting}
          onClick={extract}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 font-display text-[13px] font-semibold text-on-primary disabled:opacity-40 squishy-press"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">auto_awesome</span>
          {extracting ? "Reading message…" : "Extract assignment"}
        </button>
      </section>

      {loading && <p className="mt-6 font-body text-[13px] text-on-surface/50">Loading…</p>}

      {/* Drafts */}
      {drafts.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-display text-[14px] font-bold text-on-surface">
            Needs review ({drafts.length})
          </h2>
          <div className="space-y-3">
            {drafts.map((d) => (
              <ReviewCard key={d.id} draft={d} onPublish={publish} onDiscard={discard} busy={busyId === d.id} />
            ))}
          </div>
        </section>
      )}

      {/* Published */}
      <section className="mt-6">
        <h2 className="mb-2 font-display text-[14px] font-bold text-on-surface">
          Published ({published.length})
        </h2>
        {published.length === 0 ? (
          <p className="rounded-2xl bg-surface-container-lowest px-4 py-8 text-center font-body text-[13px] text-on-surface/50 ring-1 ring-inset ring-black/[0.06]">
            Nothing published yet.
          </p>
        ) : (
          <div className="space-y-2">
            {published.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 ring-1 ring-inset ring-black/[0.06]"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[14px] font-semibold text-on-surface">{p.title}</p>
                  <p className="mt-0.5 font-body text-[11px] text-on-surface-variant">
                    {[p.course, p.dueAt ? new Date(p.dueAt).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : p.dueTextRaw || "no date"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={() => discard(p.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">close</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
