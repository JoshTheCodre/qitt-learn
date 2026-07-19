"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";
import CourseSearch from "@/components/CourseSearch";
import type { CatalogCourse } from "@/lib/catalog";
import { formatCourseCode } from "@/lib/courses";
import {
  getCurrentUser,
  updateCurrentUser,
  logout,
  type UserProfile,
  type CarryoverCourse,
} from "@/lib/store";

function InfoRow({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: string;
  iconColor: string;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-surface-container last:border-0">
      <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
        <span className={`material-symbols-outlined text-[18px] leading-none ${iconColor}`}>
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-[11px] text-on-surface-variant font-medium">{label}</p>
        <p className="font-display text-sm font-semibold text-on-surface truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [carryover, setCarryover] = useState<CarryoverCourse[]>([]);
  const [addingCO, setAddingCO] = useState(false);
  // A confirm step in front of both add and remove — carryovers are a bit of a
  // commitment either way, so neither should happen on a single stray tap.
  const [pending, setPending] = useState<{
    kind: "add" | "remove";
    label: string;
    run: () => void;
  } | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    setProfile(user.profile);
    setCarryover(user.carryover);
  }, [router]);

  function addCarryover(course: CatalogCourse) {
    const next: CarryoverCourse[] = [
      ...carryover,
      { course_code: course.code, course_title: course.title, unit: course.unit },
    ];
    setCarryover(next);
    updateCurrentUser({ carryover: next });
    setAddingCO(false);
  }

  function removeCarryover(code: string) {
    const next = carryover.filter((c) => c.course_code !== code);
    setCarryover(next);
    updateCurrentUser({ carryover: next });
  }

  // Route both actions through the confirm modal.
  function requestAdd(course: CatalogCourse) {
    setPending({
      kind: "add",
      label: formatCourseCode(course.code),
      run: () => addCarryover(course),
    });
  }

  function requestRemove(c: CarryoverCourse) {
    setPending({
      kind: "remove",
      label: formatCourseCode(c.course_code),
      run: () => removeCarryover(c.course_code),
    });
  }

  function signOut() {
    logout();
    router.push("/login");
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20" />
    );
  }

  const initials =
    profile.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      {/* Banner hero */}
      <div className="relative h-32 bg-gradient-to-tr from-primary via-blue-600 to-cyan-400">
        <button
          type="button"
          aria-label="Edit profile"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white squishy-press"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">edit</span>
        </button>
      </div>

      {/* Identity */}
      <div className="relative z-10 px-gutter -mt-12">
        <div className="w-20 h-20 overflow-hidden rounded-full ring-4 ring-background flex items-center justify-center text-white text-[24px] font-bold shadow-lg bg-gradient-to-br from-violet-500 via-primary to-sky-500">
          {profile.picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.picture_url}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            initials
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <h2 className="font-display text-[22px] font-bold text-on-surface">{profile.name}</h2>
          <span className="rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 font-display text-xs font-semibold">
            {profile.level} Level
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] leading-none">mail</span>
          <span className="font-display text-sm font-medium truncate">{profile.email}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-full bg-surface-container px-4 py-2 font-display text-sm font-semibold text-on-surface squishy-press">
            <span className="material-symbols-outlined text-[18px] leading-none">share</span>
            Share
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-display text-sm font-semibold text-on-primary squishy-press">
            Edit Profile
            <span className="material-symbols-outlined text-[18px] leading-none">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="mx-gutter mt-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm px-4">
        <InfoRow icon="mail" iconColor="text-blue-500" label="Email" value={profile.email} />
        <InfoRow icon="call" iconColor="text-emerald-500" label="Phone" value={profile.phone} />
        <InfoRow icon="school" iconColor="text-violet-500" label="University" value={profile.university} />
        <InfoRow icon="menu_book" iconColor="text-amber-500" label="Department" value={profile.department} />
        <InfoRow icon="stairs" iconColor="text-cyan-500" label="Level" value={`${profile.level} Level`} />
        <InfoRow
          icon="calendar_today"
          iconColor="text-rose-500"
          label="Semester"
          value={`${profile.semester}, ${profile.session}`}
        />
        <InfoRow icon="event" iconColor="text-on-surface-variant" label="Joined" value={joinedDate} />
      </div>

      {/* Carryover courses */}
      <div className="mx-gutter mt-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] leading-none text-amber-500">
                bookmark
              </span>
            </div>
            <p className="font-display text-sm font-semibold text-on-surface">Carryover Courses</p>
          </div>
          {carryover.length > 0 && (
            <span className="font-display text-[11px] text-on-surface-variant font-medium">
              {carryover.length}
            </span>
          )}
        </div>
        <div className="px-4">
          {carryover.length === 0 && !addingCO && (
            <p className="font-display text-xs text-on-surface-variant py-3 text-center">
              No carryover courses added
            </p>
          )}
          {carryover.map((c, i) => (
            <div
              key={c.course_code}
              className={`flex items-center justify-between py-3 ${
                i < carryover.length - 1 ? "border-b border-surface-container" : ""
              }`}
            >
              <div>
                <p className="font-display text-[13px] font-semibold text-on-surface">
                  {formatCourseCode(c.course_code)}
                </p>
                {c.course_title && (
                  <p className="font-display text-[11px] text-on-surface-variant mt-0.5">
                    {c.course_title}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Remove course"
                onClick={() => requestRemove(c)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-error hover:bg-error-container transition-colors squishy-press"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">close</span>
              </button>
            </div>
          ))}
          {addingCO ? (
            // Picked from the school catalog, not typed. Free text let you invent a
            // course that doesn't exist, and gave the carryover no real title or units.
            <CourseSearch
              excludeCodes={carryover.map((c) => c.course_code)}
              onSelect={requestAdd}
              onCancel={() => setAddingCO(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAddingCO(true)}
              className="w-full py-3 font-display text-[13px] font-semibold text-primary text-center active:opacity-70"
            >
              + Add carryover course
            </button>
          )}
        </div>
      </div>

      {/* Sign out */}
      <div className="px-gutter mt-4 pb-28">
        <button
          type="button"
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-error-container border border-error/10 text-error font-display text-sm font-semibold squishy-press"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">logout</span>
          Sign Out
        </button>
      </div>

      {/* Add / remove carryover confirmation */}
      {pending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-surface-container-lowest p-5 text-center shadow-2xl">
            <h3 className="font-display text-[17px] font-bold text-on-surface">
              {pending.kind === "add" ? "Add carryover?" : "Remove carryover?"}
            </h3>
            <p className="mt-1.5 font-body text-[13px] leading-snug text-on-surface/60">
              {pending.kind === "add"
                ? `Add ${pending.label} to your carryover courses?`
                : `Remove ${pending.label} from your carryover courses?`}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="flex-1 rounded-xl bg-surface-container py-3 font-display text-sm font-semibold text-on-surface squishy-press"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  pending.run();
                  setPending(null);
                }}
                className={`flex-1 rounded-xl py-3 font-display text-sm font-bold text-white squishy-press ${
                  pending.kind === "add" ? "bg-primary" : "bg-rose-600"
                }`}
              >
                {pending.kind === "add" ? "Add" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
