import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import PerformanceView from "@/components/study/PerformanceView";

export default function PerformancePage() {
  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />
      <div className="relative z-10">
        <BackHeader title="Performance" transparent />
      </div>
      <main className="relative z-10 px-gutter pt-2 pb-28">
        <PerformanceView />
      </main>
    </div>
  );
}
