import "server-only";
import { verdictScore, type TheoryGrade, type TheoryVerdict } from "./practice";

// OpenRouter grading for open-ended (theory/subjective) answers. Server-only — the API
// key never reaches the browser.
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Free models, best first. We try them in order and fall through on any failure (HTTP
// error, timeout, or unusable output), so grading survives a model being rate-limited or
// retired. Override the whole list with OPENROUTER_MODELS (comma-separated), or just pin
// the top pick with OPENROUTER_MODEL.
//
// This lineup was verified live against the free tier (capability + sensible grading +
// latency). `openrouter/free` is last: an auto-router that finds any available free model
// when every pinned one is rate-limited.
const DEFAULT_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "inclusionai/ling-3.0-flash:free",
  "openrouter/free",
];

// Keep grading within the route's maxDuration even if models hang.
const OVERALL_MS = 50_000;
const PER_MODEL_MS = 20_000;

export interface GradeInput {
  id: number;
  question: string;
  modelAnswer: string;
  studentAnswer: string;
}

export function hasOpenRouter(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

function modelLineup(): string[] {
  const override = process.env.OPENROUTER_MODELS;
  if (override) return override.split(",").map((s) => s.trim()).filter(Boolean);
  const top = process.env.OPENROUTER_MODEL?.trim();
  // A pinned top pick jumps the queue; the rest stay as backups.
  if (top) return [top, ...DEFAULT_MODELS.filter((m) => m !== top)];
  return DEFAULT_MODELS;
}

function normVerdict(v: unknown): TheoryVerdict {
  const s = String(v || "").toLowerCase();
  if (s.startsWith("correct")) return "correct";
  if (s.startsWith("partial")) return "partial";
  return "incorrect";
}

// Free models often wrap JSON in prose or code fences — pull out the first [...] block.
function parseJsonArray(text: string): unknown[] {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    const v = JSON.parse(cleaned);
    if (Array.isArray(v)) return v;
  } catch {
    /* fall through to bracket extraction */
  }
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start >= 0 && end > start) {
    try {
      const v = JSON.parse(cleaned.slice(start, end + 1));
      if (Array.isArray(v)) return v;
    } catch {
      /* give up */
    }
  }
  return [];
}

const SYSTEM =
  "You are a fair but rigorous university exam grader. Compare each student answer to the " +
  "model answer and judge whether it conveys the same key points. Award 'correct' for a " +
  "complete answer, 'partial' when it's on the right track but incomplete or has errors, and " +
  "'incorrect' when it's wrong or empty. Ignore spelling and phrasing. Respond with ONLY a " +
  'JSON array, no prose: [{"index":0,"verdict":"correct|partial|incorrect","feedback":"one short sentence"}].';

// One model attempt. Throws on HTTP error / timeout; returns the parsed array otherwise.
async function callModel(key: string, model: string, payload: unknown, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "X-Title": "Qitt Learn",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Grade these answers:\n${JSON.stringify(payload)}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 160)}`);
    const data = await res.json();
    return parseJsonArray(data?.choices?.[0]?.message?.content || "");
  } finally {
    clearTimeout(timer);
  }
}

function mapGrades(items: GradeInput[], arr: unknown[]): TheoryGrade[] {
  const byIndex = new Map<number, Record<string, unknown>>();
  for (const raw of arr) {
    if (raw && typeof raw === "object") {
      const o = raw as Record<string, unknown>;
      byIndex.set(Number(o.index), o);
    }
  }
  return items.map((it, i) => {
    const o = byIndex.get(i) || {};
    const verdict = normVerdict(o.verdict);
    return { id: it.id, verdict, score: verdictScore(verdict), feedback: String(o.feedback || "").slice(0, 300) };
  });
}

export async function gradeAnswers(items: GradeInput[]): Promise<TheoryGrade[]> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  if (items.length === 0) return [];

  const payload = items.map((it, i) => ({
    index: i,
    question: it.question,
    model_answer: it.modelAnswer,
    student_answer: it.studentAnswer,
  }));

  const start = Date.now();
  let best: unknown[] = []; // largest partial response seen, as a last resort
  let lastErr = "no models configured";

  for (const model of modelLineup()) {
    const remaining = OVERALL_MS - (Date.now() - start);
    if (remaining < 3000) break; // out of budget — stop trying more models
    try {
      const arr = await callModel(key, model, payload, Math.min(PER_MODEL_MS, remaining));
      if (arr.length >= items.length) return mapGrades(items, arr); // full coverage → done
      if (arr.length > best.length) best = arr; // remember the best partial
      lastErr = `${model}: short response (${arr.length}/${items.length})`;
    } catch (e) {
      lastErr = `${model}: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  if (best.length > 0) return mapGrades(items, best); // partial is better than nothing
  throw new Error(`All models failed — ${lastErr}`);
}
