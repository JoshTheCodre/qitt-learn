"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SelectField } from "@/components/study/StudyFields";

const DEPARTMENTS = ["Computer Science", "Mathematics", "Physics", "Statistics", "Engineering"];
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

const FIELD =
  "w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary";
const LABEL =
  "block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");

  const canSubmit = name.trim() && email.trim() && password.trim() && department && level;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/");
  }

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20 px-6 pt-6 pb-8">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.push("/landing")}
        className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center squishy-press"
      >
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
          arrow_back
        </span>
      </button>

      <h1 className="mt-5 font-display text-[26px] font-bold text-on-surface tracking-tight">
        Create account
      </h1>
      <p className="mt-1 font-body text-sm font-medium text-on-surface-variant">
        Join Qitt and start studying smarter.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div>
          <label className={LABEL}>Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Joshua Boyi"
            className={FIELD}
          />
        </div>
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
          <label className={LABEL}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className={FIELD}
          />
        </div>
        <SelectField
          label="Department"
          value={department}
          onChange={setDepartment}
          options={DEPARTMENTS}
          placeholder="Select department"
        />
        <SelectField
          label="Level"
          value={level}
          onChange={setLevel}
          options={LEVELS}
          placeholder="Select level"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 w-full py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm font-medium text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
