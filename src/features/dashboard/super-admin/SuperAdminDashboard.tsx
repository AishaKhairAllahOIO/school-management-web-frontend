import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type { ApiResponse } from "@/services/types/apiResponse";
import type { SuperAdminDashboardData } from "../types/dashboard.types";
import {dashboardIcons} from "../components/dashboardIcons";

import {
  StatsGrid,
} from "../components/StatsGrid";

import { FinanceChart } from "../components/FinanceChart";
import { AttendanceChart } from "../components/AttendanceChart";
import { StudentsByStageChart } from "../components/StudentsByStageChart";
import { StaffByTypeChart } from "../components/StaffByTypeChart";
import { RecentActivities } from "../components/RecentActivities";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { QuickActions } from "../components/QuickActions";

export function SuperAdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "super-admin"],

    queryFn: async () => {
      const response = await axiosClient.get<
        ApiResponse<SuperAdminDashboardData>
      >(API_ENDPOINTS.DASHBOARD.SUPER_ADMIN);

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

      {/* Students + Staff */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentsByStageChart
          data={data.students_by_stage}
        />

        <StaffByTypeChart
          data={data.staff_by_type}
        />
      </div>

      {/* Activities + Quick Actions */}
      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]
        "
      >
        <RecentActivities
          activities={data.activities}
        />

        <QuickActions role="super-admin" />
      </div>
    </div>
  );
}