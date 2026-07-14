import Header from "@/components/dashboard/Header";
import SchoolCalendar from "@/components/dashboard/SchoolCalendar";
import QuickActions from "@/components/dashboard/QuickActions";
import OverviewHero from "@/components/dashboard/OverviewHero";
import CourseList from "@/components/study/CourseList";
import BottomNav from "@/components/dashboard/BottomNav";
import PatternBackdrop from "@/components/PatternBackdrop";

export default function DashboardPage() {
  return (
    // theme-home rebinds the brand/accent colour slots for this page only
    <div className="theme-home mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      {/* z-10 lifts the page above the absolutely-positioned backdrop */}
      <div className="relative z-10">
        <Header paddingX="px-2.5" transparent />
        <main className="px-2.5 pb-24">
          <SchoolCalendar />
          <QuickActions />
          <OverviewHero />
          <CourseList topClass="mt-6" showStats />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
