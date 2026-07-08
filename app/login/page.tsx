"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/store";

const FIELD =
  "w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary";

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
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20 flex flex-col px-6 pt-14 pb-8">
      <span className="inline-flex w-12 h-12 rounded-2xl bg-white shadow-sm items-center justify-center overflow-hidden border border-outline-variant/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qitt-logo.png" alt="Qitt" className="w-full h-full object-cover" />
      </span>

      <h1 className="mt-6 font-display text-[26px] font-bold text-on-surface tracking-tight">
        Welcome back
      </h1>
      <p className="mt-1 font-body text-sm font-medium text-on-surface-variant">
        Log in to continue to Qitt.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            className={FIELD}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Password
            </label>
            <button type="button" className="font-display text-xs font-semibold text-primary">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">
                {show ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <p className="font-body text-[13px] font-medium text-error text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 w-full py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
        >
          Sign in
        </button>
      </form>

      <p className="mt-auto pt-8 text-center font-body text-sm font-medium text-on-surface-variant">
        New to Qitt?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Create account
        </Link>
      </p>
    </div>
  );
}
