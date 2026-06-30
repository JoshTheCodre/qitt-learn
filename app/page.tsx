import Header from "@/components/dashboard/Header";
import SchoolCalendar from "@/components/dashboard/SchoolCalendar";
import QuickActions from "@/components/dashboard/QuickActions";
import Hero from "@/components/dashboard/Hero";
import TodaysClasses from "@/components/dashboard/TodaysClasses";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <Header paddingX="px-2.5" />
      <main className="px-2.5 pb-24">
        <SchoolCalendar />
        <QuickActions />
        <Hero />
        <TodaysClasses />
      </main>
      <BottomNav />
    </div>
  );
}
