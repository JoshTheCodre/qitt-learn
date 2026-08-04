import Link from "next/link";
import type { Metadata } from "next";
import { BRAND, LEGAL_ENTITY, CONTACT_EMAIL, PHONE_E164, WHATSAPP_LINK, LAST_UPDATED } from "@/lib/legal";

// Standard-form privacy policy for a Nigeria-based student app that collects account and
// profile data. Reflects the app's real practices (account data in our database, files in
// cloud storage, push via a third party, aggregated analytics). Have a Nigerian-qualified
// lawyer review it before you rely on it.

export const metadata: Metadata = {
  title: "Privacy Policy — Qitt",
  description:
    "How Qitt collects, uses and protects your personal data in Nigeria, and your rights under the Nigeria Data Protection Act 2023.",
};

const TOC = [
  { href: "#collect", label: "Information we collect" },
  { href: "#use", label: "How we use your information" },
  { href: "#basis", label: "Legal basis" },
  { href: "#share", label: "How we share information" },
  { href: "#retention", label: "Data retention" },
  { href: "#security", label: "Security" },
  { href: "#rights", label: "Your rights" },
  { href: "#cookies", label: "Cookies & local storage" },
  { href: "#transfers", label: "International transfers" },
  { href: "#contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-[#f4f0e8] text-[#1a1712]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Link href="/" className="font-display text-[20px] font-extrabold tracking-tight">
          {BRAND}
        </Link>
        <Link
          href="/"
          className="rounded-full px-4 py-2 font-display text-[13px] font-bold text-[#1a1712]/70 transition-colors hover:bg-[#1a1712]/[0.06]"
        >
          ← Back
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-4">
        <p className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-[#c9506a]">
          Legal
        </p>
        <h1 className="mt-2 font-display text-[34px] font-extrabold leading-[1.05] tracking-tight sm:text-[44px]">
          Privacy Policy
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-[#1a1712]/70">
          This policy explains what personal data {BRAND} collects, how we use and protect it, and
          the rights you have over it. {BRAND} is a student study platform operated in Nigeria, and
          we handle personal data in line with the Nigeria Data Protection Act 2023 (NDPA), overseen
          by the Nigeria Data Protection Commission (NDPC). For rules on copyright and material you
          upload, see our{" "}
          <Link href="/copyright" className="font-semibold underline">
            Copyright &amp; Content Policy
          </Link>
          .
        </p>

        <nav className="mt-8 rounded-2xl border border-[#1a1712]/10 bg-white/50 p-5">
          <p className="font-display text-[12px] font-bold uppercase tracking-wide text-[#1a1712]/50">
            On this page
          </p>
          <ul className="mt-3 space-y-1.5">
            {TOC.map((t) => (
              <li key={t.href}>
                <a
                  href={t.href}
                  className="font-body text-[14px] font-medium text-[#1a1712]/80 underline decoration-[#f4a9c4] decoration-2 underline-offset-4 transition-colors hover:text-[#1a1712]"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section id="collect" n="1" title="Information we collect">
          <h3 className="mt-1 font-display text-[15px] font-bold">Account &amp; profile</h3>
          <p>
            When you create an account we collect your name, email, and password, and the profile
            details you provide — such as phone number, university, faculty, department, level,
            semester and session, student code, registration number and profile picture. Passwords
            are stored in a hashed form, or handled by our authentication provider; we never store
            them in plain text.
          </p>

          <h3 className="mt-4 font-display text-[15px] font-bold">Your content</h3>
          <p>
            The study materials you upload, the requests you make, your course and carryover lists,
            and your notification preferences.
          </p>

          <h3 className="mt-4 font-display text-[15px] font-bold">Usage &amp; device data</h3>
          <p>
            Aggregated page-view counts (which pages are visited, not tied to your identity), a
            record of when your account was last active, and basic technical information your browser
            sends. We do not use third-party advertising trackers.
          </p>
        </Section>

        <Section id="use" n="2" title="How we use your information">
          <List>
            <li>To provide and personalise the service — your courses, dashboard and practice.</li>
            <li>To sign you in and keep you signed in.</li>
            <li>To send notifications you have opted into.</li>
            <li>To understand usage and improve {BRAND} (using aggregated analytics).</li>
            <li>To keep the platform safe and enforce our policies.</li>
            <li>To meet our legal obligations.</li>
          </List>
        </Section>

        <Section id="basis" n="3" title="Legal basis for processing">
          <p>Under the NDPA 2023, we rely on one or more of the following:</p>
          <List>
            <li>
              <strong>Your consent</strong> — for example, notifications and optional profile fields.
            </li>
            <li>
              <strong>Performance of a contract</strong> — to provide the service you signed up for.
            </li>
            <li>
              <strong>Our legitimate interests</strong> — to secure and improve the service, balanced
              against your rights.
            </li>
            <li>
              <strong>Legal obligation</strong> — where the law requires it.
            </li>
          </List>
          <p className="mt-3">You can withdraw consent at any time (see “Your rights”).</p>
        </Section>

        <Section id="share" n="4" title="How we share information">
          <List>
            <li>
              <strong>Service providers</strong> that help us run {BRAND} — such as cloud hosting and
              file storage, and a push-notification provider — only as needed and under
              confidentiality obligations.
            </li>
            <li>
              <strong>Other users</strong> — material you choose to contribute is shared with other
              students, as described in our{" "}
              <Link href="/copyright" className="font-semibold underline">
                Copyright &amp; Content Policy
              </Link>
              .
            </li>
            <li>
              <strong>Legal &amp; safety</strong> — where required by law, or to protect the rights
              and safety of users and the public.
            </li>
          </List>
          <p className="mt-3 font-semibold">We do not sell your personal data.</p>
        </Section>

        <Section id="retention" n="5" title="Data retention">
          <p>
            We keep your personal data while your account is active and for as long as we need it to
            provide the service or meet legal and operational requirements. When it is no longer
            needed, we delete or anonymise it. You can ask us to delete your account and data at any
            time.
          </p>
        </Section>

        <Section id="security" n="6" title="Security">
          <p>
            We take reasonable technical and organisational measures to protect your data — including
            hashed passwords and access controls. No method of storage or transmission is completely
            secure, but we work to protect your information and to respond quickly if something goes
            wrong.
          </p>
        </Section>

        <Section id="rights" n="7" title="Your rights">
          <p>Under the NDPA 2023 you have the right to:</p>
          <List>
            <li>Access the personal data we hold about you.</li>
            <li>Have inaccurate data corrected.</li>
            <li>Ask us to delete your data.</li>
            <li>Restrict or object to certain processing.</li>
            <li>Receive your data in a portable form.</li>
            <li>Withdraw consent you previously gave.</li>
          </List>
          <p className="mt-3">
            To exercise any of these, email{" "}
            <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            . You also have the right to lodge a complaint with the Nigeria Data Protection Commission
            (NDPC).
          </p>
        </Section>

        <Section id="cookies" n="8" title="Cookies & local storage">
          <p>
            We use a secure session cookie to keep you signed in, and we store some information in
            your browser&apos;s local storage so the app loads quickly. We use aggregated page-view
            analytics to understand how {BRAND} is used. We do not use third-party advertising or
            cross-site tracking cookies.
          </p>
        </Section>

        <Section id="transfers" n="9" title="International transfers">
          <p>
            Some of the providers we use to run {BRAND} may store or process data on servers outside
            Nigeria. Where that happens, we take steps to ensure your data receives a level of
            protection consistent with the NDPA 2023.
          </p>
        </Section>

        <Section id="contact" n="10" title="Contact">
          <p>Questions about this policy, or to exercise your rights:</p>
          <ul className="mt-3 space-y-1.5 font-body text-[14px] text-[#1a1712]/80">
            <li>
              Email:{" "}
              <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a className="font-semibold underline" href={`tel:${PHONE_E164}`}>
                Click to call
              </a>
            </li>
            <li>
              <a
                className="font-semibold underline"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </a>
            </li>
          </ul>
        </Section>

        <p className="mt-12 border-t border-[#1a1712]/10 pt-6 font-body text-[13px] text-[#1a1712]/50">
          © {new Date().getFullYear().toString()} {LEGAL_ENTITY}. Operated in Nigeria. Last updated{" "}
          {LAST_UPDATED}.
        </p>
      </main>
    </div>
  );
}

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-6">
      <h2 className="font-display text-[22px] font-extrabold leading-tight tracking-tight">
        <span className="text-[#c9506a]">{n}.</span> {title}
      </h2>
      <div className="mt-3 font-body text-[14px] leading-relaxed text-[#1a1712]/80 [&_strong]:text-[#1a1712]">
        {children}
      </div>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-[#f4a9c4]">{children}</ul>;
}
