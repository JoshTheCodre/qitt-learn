import Link from "next/link";
import type { Metadata } from "next";
import { BRAND, LEGAL_ENTITY, CONTACT_EMAIL, PHONE_E164, WHATSAPP_LINK, LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Copyright & Content Policy — Qitt",
  description:
    "How Qitt handles copyright and user-contributed study materials in Nigeria — upload rules, fair dealing, and how to submit a takedown request.",
};

const TOC = [
  { href: "#contributions", label: "Contribution & upload rules" },
  { href: "#fair-dealing", label: "Copyright & fair dealing" },
  { href: "#takedown", label: "Reporting infringement (takedown)" },
  { href: "#counter", label: "Counter-notice" },
  { href: "#repeat", label: "Repeat infringers" },
  { href: "#data", label: "Your data & privacy" },
  { href: "#contact", label: "Contact" },
];

export default function CopyrightPage() {
  return (
    <div className="min-h-screen w-full bg-[#f4f0e8] text-[#1a1712]">
      {/* Header */}
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
          Copyright &amp; Content Policy
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-[#1a1712]/70">
          {BRAND} is a student study platform operated in Nigeria. Much of the material on {BRAND} —
          notes, summaries, past questions and slides — is contributed by students. This policy sets
          out the rules for sharing material, how we respect copyright, and how rights holders can ask
          us to remove infringing content. {BRAND} operates under the laws of the Federal Republic of
          Nigeria, including the Copyright Act 2022, and cooperates with the Nigerian Copyright
          Commission (NCC).
        </p>

        {/* Table of contents */}
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

        <Section id="contributions" n="1" title="Contribution & upload rules">
          <p>When you upload material to {BRAND}, you must follow these rules.</p>

          <h3 className="mt-5 font-display text-[15px] font-bold">You may upload</h3>
          <List>
            <li>Study material you created yourself — your own notes, summaries and solutions.</li>
            <li>Material you own the rights to, or have clear permission to share.</li>
            <li>
              Material that is genuinely in the public domain, or released under a licence that
              allows sharing.
            </li>
          </List>

          <h3 className="mt-5 font-display text-[15px] font-bold">You must not upload</h3>
          <List>
            <li>Copyrighted textbooks or published works, or extracts beyond what fair dealing allows.</li>
            <li>
              A lecturer&apos;s or institution&apos;s slides, handouts, recordings or examination
              papers without permission.
            </li>
            <li>Live or leaked examination material, or anything that facilitates exam malpractice.</li>
            <li>Anything that infringes another person&apos;s copyright, trademark or other rights.</li>
            <li>Someone&apos;s personal or confidential information without their consent.</li>
            <li>Unlawful, defamatory, obscene or otherwise harmful content.</li>
          </List>

          <h3 className="mt-5 font-display text-[15px] font-bold">The permission you give us</h3>
          <p>
            When you upload material, you grant {LEGAL_ENTITY} a non-exclusive, royalty-free licence to
            store, display and make that material available to other users for the educational purpose
            of the platform. You keep ownership of anything you created — this licence only lets us run
            the service.
          </p>

          <h3 className="mt-5 font-display text-[15px] font-bold">Your responsibility</h3>
          <p>
            You confirm that you have the right to share what you upload and that it does not break the
            law or infringe anyone&apos;s rights. You agree to indemnify {LEGAL_ENTITY} against claims,
            losses or costs arising from material you upload.
          </p>
        </Section>

        <Section id="fair-dealing" n="2" title="Copyright & fair dealing">
          <p>
            Nigerian copyright law protects original works automatically, from the moment they are
            created. It also allows limited <strong>fair dealing</strong> for purposes such as private
            study, research, review and education. Fair dealing does not permit copying or sharing whole
            works, or distributing material in a way that harms the rights holder.
          </p>
          <p className="mt-3">
            Past questions and similar materials may themselves be protected by copyright owned by an
            institution or examination body. Only share these where you have the right to, or where the
            law clearly permits it. You are responsible for making sure your uploads stay within what
            the law allows.
          </p>
        </Section>

        <Section id="takedown" n="3" title="Reporting infringement — notice & takedown">
          <p>
            If you are a rights holder (or acting for one) and believe material on {BRAND} infringes
            your copyright, tell us and we will act promptly. Send a takedown notice to{" "}
            <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            including:
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 font-body text-[14px] leading-relaxed text-[#1a1712]/80">
            <li>Your full name and contact details.</li>
            <li>A description of the copyrighted work you say is infringed.</li>
            <li>The exact material on {BRAND} (title and/or link) you want removed.</li>
            <li>
              A statement that you believe in good faith the use is not authorised by you, your agent
              or the law.
            </li>
            <li>
              A statement that the information in your notice is accurate, and that you are the rights
              holder or authorised to act for them.
            </li>
            <li>Your signature — a typed name is accepted for notices sent by email.</li>
          </ol>
          <p className="mt-3">
            When we receive a valid notice, we will remove or disable access to the material
            expeditiously and, where appropriate, notify the person who uploaded it. This follows the
            notice-and-takedown approach for online service providers under the Copyright Act 2022.
          </p>
        </Section>

        <Section id="counter" n="4" title="Counter-notice">
          <p>
            If your material was removed and you believe that was a mistake — for example, you own it or
            the law permits the use — you can send a counter-notice to{" "}
            <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            with your details, the material affected and a short explanation. We will review it and may
            restore the material.
          </p>
        </Section>

        <Section id="repeat" n="5" title="Repeat infringers">
          <p>
            We may suspend or permanently disable the account of anyone who repeatedly uploads
            infringing material.
          </p>
        </Section>

        <Section id="data" n="6" title="Your data & privacy">
          <p>
            How we collect, use and protect your personal data — and the rights you have over it
            under the Nigeria Data Protection Act 2023 — is set out in our{" "}
            <Link href="/privacy" className="font-semibold underline">
              Privacy Policy
            </Link>
            . In short: we use your data to run your account and the service, and we do not sell it.
          </p>
        </Section>

        <Section id="contact" n="7" title="Contact">
          <p>Questions about this policy, or a copyright or takedown request:</p>
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
