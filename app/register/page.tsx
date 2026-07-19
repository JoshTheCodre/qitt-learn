"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SelectField } from "@/components/study/StudyFields";
import AvatarPicker from "@/components/AvatarPicker";
import PatternBackdrop from "@/components/PatternBackdrop";
import { SCHOOL, FACULTIES } from "@/lib/uniport";
import { registerUser } from "@/lib/store";

const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];
const FACULTY_NAMES = FACULTIES.map((f) => f.faculty);

const FIELD =
  "w-full rounded-xl border border-[#1a1712]/12 bg-white px-4 py-3.5 font-body text-[#1a1712] placeholder:text-[#1a1712]/35 focus:outline-none focus:border-[#1a1712]/45 transition-colors";
const LABEL =
  "block font-display text-xs font-semibold uppercase tracking-wide text-[#1a1712]/65 mb-2";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
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
      pictureUrl,
      password,
      university: school,
      faculty,
      department,
      level,
    });
    router.push("/");
  }

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-[#f4f0e8] text-[#1a1712] relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-[#1a1712]/10 px-6 pt-6 pb-8">
      {/* Abstract tile — signing up shouldn't already feel like being inside the app. */}
      <PatternBackdrop variant="auth" />

      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.push("/landing")}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-black/5 squishy-press"
      >
        <span className="material-symbols-outlined text-[20px] leading-none text-[#1a1712]/70">
          arrow_back
        </span>
      </button>

      <h1 className="relative z-10 mt-6 font-display text-[32px] font-extrabold tracking-tight leading-tight">
        Create{" "}
        <span className="relative whitespace-nowrap">
          account
          <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#f4a9c4]" />
        </span>
      </h1>
      <p className="relative z-10 mt-2 font-body text-[14px] font-medium text-[#1a1712]/55">
        Join Qitt and get ahead of every exam.
      </p>

      <form onSubmit={handleSubmit} className="relative z-10 mt-7 space-y-4">
        <AvatarPicker value={pictureUrl} onChange={setPictureUrl} />

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
          className="mt-2 w-full rounded-full bg-[#1a1712] py-4 font-display text-sm font-bold text-[#f4f0e8] transition-transform hover:-translate-y-px disabled:translate-y-0 disabled:opacity-40 squishy-press"
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm font-medium text-[#1a1712]/55">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#c9506a]">
          Log in
        </Link>
      </p>
    </div>
  );
}
