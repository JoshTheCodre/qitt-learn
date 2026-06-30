"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  icon: string;
  iconWrap: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const INITIAL: Notification[] = [
  {
    id: "1",
    icon: "library_books",
    iconWrap: "bg-primary/10 text-primary",
    title: "New material added",
    message: "Lecture Note 3 was added to CSC 202.2.",
    time: "2h ago",
    read: false,
  },
  {
    id: "2",
    icon: "task_alt",
    iconWrap: "bg-emerald-100 text-emerald-600",
    title: "Request fulfilled",
    message: "Someone shared the material you requested (REQ-1024).",
    time: "5h ago",
    read: false,
  },
  {
    id: "3",
    icon: "schedule",
    iconWrap: "bg-amber-100 text-amber-600",
    title: "Class reminder",
    message: "MTH 201.1 starts in 30 minutes at Hall A.",
    time: "Today",
    read: true,
  },
  {
    id: "4",
    icon: "calendar_today",
    iconWrap: "bg-rose-100 text-rose-600",
    title: "Exam approaching",
    message: "Mid-Semester Exams begin in 21 days.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    icon: "celebration",
    iconWrap: "bg-violet-100 text-violet-600",
    title: "Welcome to Qitt",
    message: "Explore courses, study and contribute materials.",
    time: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>(INITIAL);
  const hasUnread = items.some((n) => !n.read);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      {/* Header */}
      <header className="w-full top-0 z-40 bg-background">
        <div className="flex items-center gap-3 px-gutter py-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 squishy-press"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
              arrow_back
            </span>
          </button>
          <h1 className="font-display text-[20px] font-bold text-on-surface">Notifications</h1>
          {hasUnread && (
            <button
              type="button"
              onClick={markAllRead}
              className="ml-auto font-display text-xs font-semibold text-primary squishy-press"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      <main className="px-gutter pb-28">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <span className="material-symbols-outlined text-[40px] text-outline-variant">
              notifications_off
            </span>
            <p className="font-display text-sm font-medium text-on-surface-variant">
              You&apos;re all caught up
            </p>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() =>
                  setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                }
                className={`w-full flex items-start gap-3 rounded-2xl p-4 text-left border transition-colors ${
                  n.read
                    ? "bg-surface-container-lowest border-outline-variant/30"
                    : "bg-primary/5 border-primary/10"
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.iconWrap}`}
                >
                  <span className="material-symbols-outlined text-[20px] leading-none">{n.icon}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-on-surface truncate">
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="mt-0.5 font-display text-[13px] font-medium text-on-surface-variant">
                    {n.message}
                  </p>
                  <p className="mt-1 font-display text-[11px] font-medium text-on-surface-variant/70">
                    {n.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
