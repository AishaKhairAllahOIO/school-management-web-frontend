import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type { ApiResponse } from "@/services/types/apiResponse";
import type { SecretaryDashboardData } from "../types/dashboard.types";

import {
  StatsGrid,
  
} from "../components/StatsGrid";
import {dashboardIcons} from "../components/dashboardIcons";
import { FinanceChart } from "../components/FinanceChart";
import { AttendanceChart } from "../components/AttendanceChart";
import { StudentsByStageChart } from "../components/StudentsByStageChart";
import { RecentActivities } from "../components/RecentActivities";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { QuickActions } from "../components/QuickActions";

export function SecretaryDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "secretary"],

    queryFn: async () => {
      const response = await axiosClient.get<
        ApiResponse<SecretaryDashboardData>
      >(API_ENDPOINTS.DASHBOARD.SECRETARY);

      return response.data.data;
    },
  });

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const stats = [
    {
      label: "Students",
      value: data.overview.students_count,
      icon: dashboardIcons.students,
      color: "info" as const,
    },

    {
      label: "Teachers",
      value: data.overview.teachers_count,
      icon: dashboardIcons.teachers,
      color: "success" as const,
    },

    {
      label: "Staff",
      value: data.overview.staff_count,
      icon: dashboardIcons.staff,
      color: "warning" as const,
    },

    {
      label: "Classes",
      value: data.overview.classes_count,
      icon: dashboardIcons.grades,
      color: "primary" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <StatsGrid stats={stats} />

      {/* Finance + Attendance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FinanceChart data={data.finance} />

        <AttendanceChart data={data.attendance} />
      </div>

      {/* Students by Stage */}
      <div className="grid grid-cols-1 gap-6">
        <StudentsByStageChart
          data={data.students_by_stage}
        />
      </div>

      {/* Activities + Quick Actions */}
      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.85fr)]
        "
      >
        <RecentActivities
          activities={data.activities}
        />

        <QuickActions role="secretary" />
      </div>
    </div>
  );
}