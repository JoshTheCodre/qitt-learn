import Header from "@/components/dashboard/Header";
import BottomNav from "@/components/dashboard/BottomNav";
import AcademicOverview from "@/components/study/AcademicOverview";
import ForYouTabs from "@/components/study/ForYouTabs";
import CourseList from "@/components/study/CourseList";

export default function StudyPage() {
  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <Header title="Study" showAvatar={false} showUpgrade={false} />
      <main className="px-gutter pb-32">
        <AcademicOverview />
        <ForYouTabs />
        <CourseList />
      </main>
      <BottomNav />
    </div>
  );
}
