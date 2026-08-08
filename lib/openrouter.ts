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

// Generation (MCQs, study notes) produces much larger output than grading, so it needs
// FAST models first and a bigger time budget. The grading lineup leads with a 120B model
// that's accurate but slow — fine for a tiny verdict, too slow for a full quiz. This order
// leads with smaller/faster models and falls back to the big ones. Override with
// OPENROUTER_GEN_MODELS (comma-separated).
const GEN_OVERALL_MS = 48_000;
const GEN_PER_MODEL_MS = 20_000;
const GEN_DEFAULT_MODELS = [
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "inclusionai/ling-3.0-flash:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openrouter/free",
];
function genModelLineup(): string[] {
  const override = process.env.OPENROUTER_GEN_MODELS;
  if (override) return override.split(",").map((s) => s.trim()).filter(Boolean);
  return GEN_DEFAULT_MODELS;
}

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

// ── Question generation from a student's own material ─────────────────────────────────

export interface GeneratedMCQ {
  q: string;
  options: string[];
  answer: number; // 0-based index of the correct option
}

const GEN_SYSTEM =
  "You are a university exam question writer. From the STUDY MATERIAL you are given, write " +
  "clear multiple-choice questions that test understanding of its actual content (not trivia " +
  "about formatting). Each question must have exactly 4 distinct options with exactly ONE " +
  "correct answer. Do not repeat questions. Respond with ONLY a JSON array, no prose: " +
  '[{"q":"...","options":["..","..","..",".."],"answer":0}] where "answer" is the 0-based ' +
  "index of the correct option.";

// One chat call returning the raw assistant text. Throws on HTTP error / timeout.
// Belt-and-braces timeout: the AbortController cancels the fetch, and a Promise.race hard
// timer guarantees this settles even if the abort slips during a slow streamed body (seen
// with free models) — so a route can never blow past the serverless duration cap.
async function chatOnce(key: string, model: string, system: string, user: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const hardTimeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("hard timeout")), timeoutMs + 1500),
  );
  const work = (async () => {
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
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 160)}`);
    const data = await res.json();
    return String(data?.choices?.[0]?.message?.content || "");
  })();
  try {
    return await Promise.race([work, hardTimeout]);
  } finally {
    clearTimeout(timer);
  }
}

function validMCQ(raw: unknown): GeneratedMCQ | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const q = String(o.q || o.question || "").trim();
  const options = Array.isArray(o.options) ? o.options.map((x) => String(x).trim()).filter(Boolean) : [];
  const answer = Number(o.answer);
  if (!q || options.length < 2) return null;
  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) return null;
  return { q, options: options.slice(0, 6), answer };
}

// Generate up to `count` MCQs from source text. Tries the free-model lineup, first usable
// response wins. Throws if none produce valid questions.
export async function generateMCQs(sourceText: string, count: number): Promise<GeneratedMCQ[]> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  const text = sourceText.slice(0, 12000); // cap tokens; enough for a solid quiz
  if (text.trim().length < 40) {
    throw new Error("Not enough readable text in this material to build questions.");
  }
  const n = Math.min(Math.max(count, 1), 20);
  const user = `Write ${n} multiple-choice questions from this study material:\n"""\n${text}\n"""`;

  const start = Date.now();
  let lastErr = "no models configured";
  for (const model of genModelLineup()) {
    const remaining = GEN_OVERALL_MS - (Date.now() - start);
    if (remaining < 5000) break;
    try {
      const content = await chatOnce(key, model, GEN_SYSTEM, user, Math.min(GEN_PER_MODEL_MS, remaining));
      const mcqs = parseJsonArray(content).map(validMCQ).filter((x): x is GeneratedMCQ => x !== null);
      if (mcqs.length > 0) return mcqs.slice(0, n);
      lastErr = `${model}: no valid questions`;
    } catch (e) {
      lastErr = `${model}: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  throw new Error(`Could not generate questions — ${lastErr}`);
}

// ── "Easy read" study notes from a student's own material ─────────────────────────────

export interface StudySection {
  heading: string;
  explanation: string; // plain-English explanation
  everyday: string; // a relatable daily-life example/analogy
}
export interface StudyNotes {
  overview: string;
  sections: StudySection[];
  takeaways: string[];
}

const STUDY_SYSTEM =
  "You are a warm, clear tutor helping a first-year university student truly understand their " +
  "study material. Read the STUDY MATERIAL and produce an easy-read version: (1) a short " +
  "plain-English overview of what it's about; (2) its key concepts (up to 6) broken down — " +
  "for EACH, a simple jargon-free explanation AND a relatable everyday-life example or analogy " +
  "that makes it click; (3) the main takeaways. Keep it accurate to the material. Respond with " +
  "ONLY JSON, no prose: " +
  '{"overview":"...","sections":[{"heading":"...","explanation":"...","everyday":"..."}],"takeaways":["..."]}';

// Free models sometimes wrap JSON in prose/fences — pull out the first {...} object.
function parseJsonObject(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    const v = JSON.parse(cleaned);
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  } catch {
    /* fall through */
  }
  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");
  if (s >= 0 && e > s) {
    try {
      const v = JSON.parse(cleaned.slice(s, e + 1));
      if (v && typeof v === "object") return v as Record<string, unknown>;
    } catch {
      /* give up */
    }
  }
  return null;
}

function toStudyNotes(o: Record<string, unknown>): StudyNotes | null {
  const overview = String(o.overview || "").trim();
  const sections: StudySection[] = Array.isArray(o.sections)
    ? o.sections
        .map((raw) => {
          const s = (raw || {}) as Record<string, unknown>;
          return {
            heading: String(s.heading || s.title || "").trim(),
            explanation: String(s.explanation || s.detail || "").trim(),
            everyday: String(s.everyday || s.example || s.analogy || "").trim(),
          };
        })
        .filter((s) => s.heading || s.explanation)
    : [];
  const takeaways = Array.isArray(o.takeaways)
    ? o.takeaways.map((t) => String(t).trim()).filter(Boolean)
    : [];
  if (!overview && sections.length === 0) return null;
  return { overview, sections, takeaways };
}

// ── Assignment extraction from a class-group message ──────────────────────────────────

export interface ExtractedAssignment {
  title: string;
  course: string | null;
  dueAt: string | null; // ISO 8601, or null if no date could be resolved
  dueTextRaw: string | null; // the exact due phrasing from the message
  description: string | null;
  confidence: number; // 0..1
}

const EXTRACT_SYSTEM =
  "You extract assignment details from a Nigerian university class-group (WhatsApp) message. " +
  "Return ONLY JSON: {\"title\":\"...\",\"course\":\"CSC 201 or null\",\"dueAt\":\"ISO 8601 " +
  "timestamp or null\",\"dueTextRaw\":\"the exact due phrasing from the message or null\"," +
  "\"description\":\"one short line or null\",\"confidence\":0..1}. Resolve relative dates " +
  "(e.g. 'Friday', 'next week') against the provided current time; if you cannot resolve a " +
  "concrete date, set dueAt to null but still fill dueTextRaw. confidence reflects how sure " +
  "you are this is a real assignment with correct fields — set it low if the message is vague " +
  "or not actually an assignment.";

export async function extractAssignment(messageText: string, nowIso: string): Promise<ExtractedAssignment> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  const text = messageText.slice(0, 4000).trim();
  if (text.length < 3) throw new Error("Message is empty.");
  const user = `Current time: ${nowIso}\nMessage:\n"""\n${text}\n"""`;

  const start = Date.now();
  let lastErr = "no models configured";
  for (const model of genModelLineup()) {
    const remaining = GEN_OVERALL_MS - (Date.now() - start);
    if (remaining < 5000) break;
    try {
      const content = await chatOnce(key, model, EXTRACT_SYSTEM, user, Math.min(GEN_PER_MODEL_MS, remaining));
      const o = parseJsonObject(content);
      if (o) {
        const title = String(o.title || "").trim();
        const dueRaw = o.dueAt ? new Date(String(o.dueAt)) : null;
        const dueAt = dueRaw && !Number.isNaN(dueRaw.getTime()) ? dueRaw.toISOString() : null;
        let confidence = Number(o.confidence);
        if (!Number.isFinite(confidence)) confidence = 0.5;
        confidence = Math.max(0, Math.min(1, confidence));
        if (title) {
          return {
            title: title.slice(0, 200),
            course: o.course ? String(o.course).trim().slice(0, 40) : null,
            dueAt,
            dueTextRaw: o.dueTextRaw ? String(o.dueTextRaw).trim().slice(0, 120) : null,
            description: o.description ? String(o.description).trim().slice(0, 300) : null,
            confidence,
          };
        }
      }
      lastErr = `${model}: unusable response`;
    } catch (e) {
      lastErr = `${model}: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  throw new Error(`Could not read an assignment from that message — ${lastErr}`);
}

export async function generateStudyNotes(sourceText: string): Promise<StudyNotes> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  const text = sourceText.slice(0, 14000);
  if (text.trim().length < 40) throw new Error("Not enough readable text in this material to summarise.");
  const user = `Explain this study material in an easy-read way:\n"""\n${text}\n"""`;

  const start = Date.now();
  let lastErr = "no models configured";
  for (const model of genModelLineup()) {
    const remaining = GEN_OVERALL_MS - (Date.now() - start);
    if (remaining < 5000) break;
    try {
      const content = await chatOnce(key, model, STUDY_SYSTEM, user, Math.min(GEN_PER_MODEL_MS, remaining));
      const obj = parseJsonObject(content);
      const notes = obj ? toStudyNotes(obj) : null;
      if (notes) return notes;
      lastErr = `${model}: unusable response`;
    } catch (e) {
      lastErr = `${model}: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  throw new Error(`Could not create the easy-read summary — ${lastErr}`);
}
