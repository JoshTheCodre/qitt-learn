import "server-only";

// Extracts plain text from a stored material so we can generate practice questions from it.
// The file already lives in R2; we fetch it server-side (no browser upload-size limit) and
// pull the text out. PDFs and plain-text files are supported; scans/photos/other formats
// have no extractable text and throw UNSUPPORTED so the caller can explain that clearly.

export class UnsupportedMaterialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedMaterialError";
  }
}

const TEXT_EXTS = new Set(["txt", "md", "csv", "text"]);

export async function extractMaterialText(url: string, ext: string | null): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not fetch the file (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  const e = (ext || "").toLowerCase().replace(/^\./, "");

  if (e === "pdf") {
    // Loaded on demand so the pdfjs dependency only initialises when a PDF is processed.
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buf });
    try {
      const result = await parser.getText();
      return (result.text || "").trim();
    } finally {
      await parser.destroy?.();
    }
  }

  if (TEXT_EXTS.has(e)) return buf.toString("utf8").trim();

  throw new UnsupportedMaterialError(
    "We can only build practice from PDF or text files right now.",
  );
}
