"use client";

import { usePathname } from "next/navigation";

// 08078350344 in WhatsApp's required international format (Nigeria +234, drop the 0).
const WHATSAPP_NUMBER = "2348078350344";
const PREFILL = "Hi Qitt, I'd like to share some feedback:";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL)}`;

// Pre-auth screens have no app chrome, so the floating button would look out of place.
const HIDDEN_ON = ["/login", "/register", "/landing"];

export default function FeedbackButton() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    // Pinned to the bottom-right of the centered phone frame (not the whole viewport),
    // sitting above BottomNav. The wrapper ignores pointer events so it never blocks
    // taps on the content behind it — only the pill itself is interactive.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] justify-end">
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Send feedback on WhatsApp"
        className="squishy-press pointer-events-auto mb-24 mr-4 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform hover:-translate-y-0.5"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.821 11.821 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.999zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        </svg>
        <span className="font-display text-sm font-semibold">Feedback</span>
      </a>
    </div>
  );
}
