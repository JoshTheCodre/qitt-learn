"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// Renders text that may contain LaTeX math (as the practice bank does) — proper fractions,
// roots, matrices, subscripts, etc. — instead of showing raw "$$", "\frac", "\(" markup.
//
// Delimiters recognised: $$…$$ and \[…\] (display), \(…\) (inline), and $…$ (inline, but
// ONLY when the content looks like math). The single-$ guard matters because the bank also
// contains Excel/currency dollar signs like "=$A$1+B2" that must stay literal.

type Seg = { type: "text" | "math"; content: string; display: boolean };

const DELIM =
  /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;

// A single-$ span is only math if it carries a LaTeX control seq or super/subscript.
const LOOKS_MATH = /[\\^_]|\\[a-zA-Z]+/;

function segment(input: string): Seg[] {
  const segs: Seg[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  DELIM.lastIndex = 0;
  while ((m = DELIM.exec(input)) !== null) {
    const [, dd, br, par, single] = m;
    if (single != null && !LOOKS_MATH.test(single)) {
      continue; // leave "$A$1" etc. untouched — it flows into the next text segment
    }
    if (m.index > last) {
      segs.push({ type: "text", content: input.slice(last, m.index), display: false });
    }
    const tex = (dd ?? br ?? par ?? single ?? "").trim();
    segs.push({ type: "math", content: tex, display: dd != null || br != null });
    last = DELIM.lastIndex;
  }
  if (last < input.length) {
    segs.push({ type: "text", content: input.slice(last), display: false });
  }
  return segs;
}

function render(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false, // malformed LaTeX shows in red, never crashes the page
      displayMode: display,
      output: "html",
      strict: false,
    });
  } catch {
    return tex; // last-ditch: show the raw expression rather than nothing
  }
}

export default function MathText({
  children,
  className,
}: {
  children: string | null | undefined;
  className?: string;
}) {
  const text = children ?? "";
  const segs = useMemo(() => segment(text), [text]);

  // Fast path: no math at all — render as plain text (preserves newlines).
  if (segs.length === 1 && segs[0].type === "text") {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segs.map((s, i) =>
        s.type === "text" ? (
          <span key={i}>{s.content}</span>
        ) : (
          <span
            key={i}
            // KaTeX escapes its input into markup; no arbitrary HTML passes through.
            dangerouslySetInnerHTML={{ __html: render(s.content, s.display) }}
          />
        ),
      )}
    </span>
  );
}
