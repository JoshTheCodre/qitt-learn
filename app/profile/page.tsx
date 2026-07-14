"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";
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
  const [notifOn, setNotifOn] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [carryover, setCarryover] = useState<CarryoverCourse[]>([]);
  const [addingCO, setAddingCO] = useState(false);
  const [coCode, setCoCode] = useState("");
  const [coTitle, setCoTitle] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    setProfile(user.profile);
    setCarryover(user.carryover);
    setNotifOn(user.notifOn);
  }, [router]);

  function saveCarryover() {
    if (!coCode.trim()) return;
    const next = [
      ...carryover,
      { course_code: coCode.trim().toUpperCase(), course_title: coTitle.trim() || null },
    ];
    setCarryover(next);
    updateCurrentUser({ carryover: next });
    setAddingCO(false);
    setCoCode("");
    setCoTitle("");
  }

  function removeCarryover(code: string) {
    const next = carryover.filter((c) => c.course_code !== code);
    setCarryover(next);
    updateCurrentUser({ carryover: next });
  }

  function toggleNotif() {
    const next = !notifOn;
    setNotifOn(next);
    updateCurrentUser({ notifOn: next });
  }

  function sendTest() {
    setTestMsg("Notification sent ✓");
    setTimeout(() => setTestMsg(null), 4000);
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

      {/* Notifications */}
      <div className="mx-gutter mt-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm px-4">
        <div className="flex items-center gap-3 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <span
              className={`material-symbols-outlined text-[18px] leading-none ${
                notifOn ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {notifOn ? "notifications_active" : "notifications_off"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-semibold text-on-surface">Push Notifications</p>
            <p className="font-display text-[11px] text-on-surface-variant leading-tight mt-0.5">
              {notifOn ? "You'll get alerts for new activity" : "Tap to enable push alerts"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Toggle notifications"
            onClick={toggleNotif}
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
              notifOn ? "bg-primary" : "bg-surface-container-highest"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                notifOn ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
        {notifOn && (
          <div className="pb-3.5">
            <button
              type="button"
              onClick={sendTest}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary font-display text-[13px] font-semibold squishy-press"
            >
              <span className="material-symbols-outlined text-[16px] leading-none">notifications</span>
              {testMsg ?? "Send test notification"}
            </button>
          </div>
        )}
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
                <p className="font-display text-[13px] font-semibold text-on-surface">{c.course_code}</p>
                {c.course_title && (
                  <p className="font-display text-[11px] text-on-surface-variant mt-0.5">
                    {c.course_title}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Remove course"
                onClick={() => removeCarryover(c.course_code)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-error hover:bg-error-container transition-colors squishy-press"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">close</span>
              </button>
            </div>
          ))}
          {addingCO ? (
            <div className="py-3 space-y-2">
              <input
                value={coCode}
                onChange={(e) => setCoCode(e.target.value.toUpperCase())}
                placeholder="Course code (e.g. CSC 301)"
                className="w-full rounded-xl border border-outline-variant/50 px-3 py-2.5 font-display text-[13px] font-medium text-on-surface placeholder:font-normal placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
              <input
                value={coTitle}
                onChange={(e) => setCoTitle(e.target.value)}
                placeholder="Course title (optional)"
                className="w-full rounded-xl border border-outline-variant/50 px-3 py-2.5 font-display text-[13px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2 pb-1">
                <button
                  type="button"
                  onClick={saveCarryover}
                  disabled={!coCode.trim()}
                  className="flex-1 py-2.5 rounded-xl font-display text-[13px] font-semibold text-on-primary bg-primary disabled:opacity-50 squishy-press"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingCO(false);
                    setCoCode("");
                    setCoTitle("");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-display text-[13px] font-semibold squishy-press"
                >
                  Cancel
                </button>
              </div>
            </div>
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

      <BottomNav />
    </div>
  );
}
