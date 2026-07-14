"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SelectField } from "@/components/study/StudyFields";
import { SCHOOL, FACULTIES } from "@/lib/uniport";
import { registerUser } from "@/lib/store";

const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];
const FACULTY_NAMES = FACULTIES.map((f) => f.faculty);

const FIELD =
  "w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary";
const LABEL =
  "block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState(SCHOOL);
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [busy, setBusy] = useState(false);

  const departmentOptions = FACULTIES.find((f) => f.faculty === faculty)?.departments ?? [];

  const canSubmit =
    name.trim() && email.trim() && password.trim() && faculty && department && level && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    await registerUser({
      name,
      email,
      phone,
      regNumber,
      password,
      university: school,
      faculty,
      department,
      level,
    });
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
          <label className={LABEL}>
            Phone <span className="font-normal normal-case text-on-surface-variant/60">(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 801 234 5678"
            className={FIELD}
          />
        </div>
        <div>
          {/* Optional — deliberately no "(optional)" tag, unlike Phone above. It stays
              out of canSubmit, so a blank value still registers. */}
          <label className={LABEL}>Reg Number</label>
          <input
            type="text"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
            placeholder="U2021/5570001"
            autoComplete="off"
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

        <SelectField label="School" value={school} onChange={setSchool} options={[SCHOOL]} />

        <SelectField
          label="Faculty"
          value={faculty}
          onChange={(v) => {
            setFaculty(v);
            setDepartment("");
          }}
          options={FACULTY_NAMES}
          placeholder="Select faculty"
        />

        <SelectField
          label="Department"
          value={department}
          onChange={setDepartment}
          options={departmentOptions}
          placeholder={faculty ? "Select department" : "Choose a faculty first"}
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
          {busy ? "Creating account…" : "Create account"}
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
