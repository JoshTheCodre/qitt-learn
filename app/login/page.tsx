"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/store";
import PatternBackdrop from "@/components/PatternBackdrop";

const FIELD =
  "w-full rounded-xl border border-[#1a1712]/12 bg-white px-4 py-3.5 font-body text-[#1a1712] placeholder:text-[#1a1712]/35 focus:outline-none focus:border-[#1a1712]/45 transition-colors";
const LABEL =
  "block font-display text-xs font-semibold uppercase tracking-wide text-[#1a1712]/65 mb-2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim() && password.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (loginUser(email, password)) {
      router.push("/");
    } else {
      setError("Incorrect email or password.");
    }
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#f4f0e8] px-6 pb-8 pt-14 text-[#1a1712] md:border-x md:border-[#1a1712]/10 md:shadow-[0_0_60px_rgba(0,0,0,0.08)]">
      <PatternBackdrop variant="auth" />

      <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qitt-logo.png" alt="Qitt" className="h-full w-full object-cover" />
      </span>

      <h1 className="relative z-10 mt-7 font-display text-[32px] font-extrabold leading-tight tracking-tight">
        Welcome{" "}
        <span className="relative whitespace-nowrap">
          back
          <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#f4a9c4]" />
        </span>
      </h1>
      <p className="relative z-10 mt-2 font-body text-[14px] font-medium text-[#1a1712]/55">
        Log in to pick up where you left off.
      </p>

      <form onSubmit={handleSubmit} className="relative z-10 mt-9 space-y-4">
        <div>
          <label className={LABEL}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            className={FIELD}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="font-display text-xs font-semibold uppercase tracking-wide text-[#1a1712]/65">
              Password
            </label>
            <button type="button" className="font-display text-xs font-bold text-[#c9506a]">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${FIELD} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1712]/50"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">
                {show ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center font-body text-[13px] font-medium text-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 w-full rounded-full bg-[#1a1712] py-4 font-display text-sm font-bold text-[#f4f0e8] transition-transform hover:-translate-y-px disabled:translate-y-0 disabled:opacity-40 squishy-press"
        >
          Sign in
        </button>
      </form>

      <p className="relative z-10 mt-auto pt-8 text-center font-body text-sm font-medium text-[#1a1712]/55">
        New to Qitt?{" "}
        <Link href="/register" className="font-bold text-[#c9506a]">
          Create account
        </Link>
      </p>
    </div>
  );
}
