import { AttendanceOverview } from "@/features/dashboard/components/AttendanceOverview";
import { DashboardInsight } from "@/features/dashboard/components/DashboardInsight";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { FeeCollection } from "@/features/dashboard/components/FeeCollection";
import { RecentActivities } from "@/features/dashboard/components/RecentActivities";
import { StudentsByGrade } from "@/features/dashboard/components/StudentsByGrade";
import { UpcomingEvents } from "@/features/dashboard/components/UpcomingEvents";

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <DashboardStats />

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <AttendanceOverview />
        <RecentActivities />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr_1.1fr]">
        <StudentsByGrade />
        <FeeCollection />
        <UpcomingEvents />
      </div>

      <DashboardInsight />
    </div>
  );
}