import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type { ApiResponse } from "@/services/types/apiResponse";
import type { AdviserDashboardData } from "../types/dashboard.types";

import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { dashboardIcons } from "../components/dashboardIcons";

import { StatsGrid } from "../components/StatsGrid";

import { AttendanceChart } from "../components/AttendanceChart";
import { StudentsByStageChart } from "../components/StudentsByStageChart";
import { RecentActivities } from "../components/RecentActivities";
import { QuickActions } from "../components/QuickActions";

export function AdviserDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "adviser"],

    queryFn: async () => {
      const response = await axiosClient.get<
        ApiResponse<AdviserDashboardData>
      >(API_ENDPOINTS.DASHBOARD.ADVISER);

      return response.data.data;
    },
  });

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const stats = [
    {
      label: "Supervised Students",
      value: data.overview.students_count,
      icon: dashboardIcons.students,
      color: "info" as const,
    },
    {
      label: "Supervised Classes",
      value: data.overview.classes_count,
      icon: dashboardIcons.grades,
      color: "primary" as const,
    },
    {
      label: "Students with Absence",
      value: data.overview.students_with_absence,
      icon: dashboardIcons.attendance,
      color: "warning" as const,
    },
    {
      label: "Unexcused Absence",
      value: data.overview.students_with_unexcused_absence,
      icon: dashboardIcons.warning,
      color: "destructive" as const,
    },
  ];

  return (
    <div className="min-w-0 space-y-6">
      {/* Statistics */}
      <StatsGrid stats={stats} />

      {/* Attendance + Students by Stage */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <AttendanceChart data={data.attendance} />
        </div>

        <div className="min-w-0">
          <StudentsByStageChart data={data.students_by_stage} />
        </div>
      </div>

      {/* Students by Class */}
      <div
        className="
          min-w-0
          rounded-2xl
          border border-border/60
          bg-card
          p-5
          shadow-[0_6px_24px_rgba(148,163,184,0.06)]
        "
      >
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Class Overview
          </p>

          <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
            Students by Class
          </h3>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.classes.map((cls) => (
            <div
              key={cls.class_id}
              className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-xl
                border border-border/50
                bg-gradient-to-br
                from-sky-50/70
                via-card
                to-card
                p-4
                text-center
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <div
                className="
                  absolute
                  -right-5
                  -top-5
                  h-16
                  w-16
                  rounded-full
                  bg-sky-100/60
                  blur-xl
                  transition-transform
                  duration-300
                  group-hover:scale-125
                "
              />

              <div className="relative min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {cls.class_name}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-sky-600">
                  {cls.students_count.toLocaleString()}
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                  Students
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities + Quick Actions */}
      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-5
          xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.85fr)]
        "
      >
        <div className="min-w-0">
          <RecentActivities activities={data.activities} />
        </div>

        <div className="min-w-0">
          <QuickActions role="adviser" />
        </div>
      </div>
    </div>
  );
}