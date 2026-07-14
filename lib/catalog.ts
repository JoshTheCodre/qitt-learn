/**
 * The school's full course catalog (public/uniport_dept_courses.json) — 84 departments,
 * ~7,200 rows, ~730KB.
 *
 * Fetched lazily and cached for the session: it's far too big to ship on every page, and
 * only the carryover picker needs it. The promise itself is cached, so concurrent
 * callers share one request rather than racing.
 */
export type CatalogCourse = {
  code: string;
  title: string;
  unit: number;
  level: number;
};

type RawRow = { code: string; title: string; unit: number; level: number; semester: string };

let cache: Promise<CatalogCourse[]> | null = null;

export function loadCatalog(): Promise<CatalogCourse[]> {
  if (cache) return cache;

  cache = fetch("/uniport_dept_courses.json")
    .then((r) => r.json() as Promise<Record<string, RawRow[]>>)
    .then((byDept) => {
      // The same course appears under many departments — collapse to one row per code.
      const seen = new Map<string, CatalogCourse>();
      for (const rows of Object.values(byDept)) {
        for (const r of rows) {
          const code = r.code.trim();
          if (!code || seen.has(code)) continue;
          seen.set(code, { code, title: r.title.trim(), unit: r.unit, level: r.level });
        }
      }
      // Array.from, not spread: the project's TS target predates downlevel iteration of
      // Map iterators.
      return Array.from(seen.values()).sort((a, b) => a.code.localeCompare(b.code));
    })
    .catch((err) => {
      cache = null; // let a later attempt retry rather than caching the failure
      throw err;
    });

  return cache;
}

export function searchCatalog(all: CatalogCourse[], query: string, limit = 25): CatalogCourse[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const out: CatalogCourse[] = [];
  const starts: CatalogCourse[] = [];

  for (const c of all) {
    const code = c.code.toLowerCase();
    const title = c.title.toLowerCase();
    // Rank code-prefix matches first — typing "CSC2" should surface CSC courses, not
    // some unrelated title that happens to contain the letters.
    if (code.startsWith(q)) starts.push(c);
    else if (code.includes(q) || title.includes(q)) out.push(c);
    if (starts.length >= limit) break;
  }

  return [...starts, ...out].slice(0, limit);
}
