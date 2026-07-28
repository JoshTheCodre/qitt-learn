"use client";

import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import RequestForm from "@/components/materials/RequestForm";
import ContributeForm from "@/components/materials/ContributeForm";

const TABS = [
  { key: "request", label: "Request" },
  { key: "contribute", label: "Contribute" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MaterialsExchange({ defaultTab = "request" }: { defaultTab?: TabKey }) {
  const [tab, setTab] = useState<TabKey>(defaultTab);

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Materials" />

      {/* Rounded, full-width, centered segmented tab */}
      <div className="px-gutter pt-1">
        <div className="flex rounded-full bg-surface-container p-1">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 rounded-full py-2.5 font-display text-sm font-semibold transition-all squishy-press ${
                  active
                    ? "bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "text-on-surface-variant"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "request" ? <RequestForm /> : <ContributeForm />}
    </div>
  );
}
