import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";

import type { OptionItem } from "../components/shared/MultiSelectAudience";

const extractArray = (response: any): any[] => {
  const value = response?.data ?? response;

  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.students)) return value.students;

  return [];
};

function cleanPart(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveStaffName(item: any): string {
  const directName =
    cleanPart(item.fullName) ||
    cleanPart(item.full_name) ||
    cleanPart(item.name) ||
    cleanPart(item.user?.fullName) ||
    cleanPart(item.user?.full_name) ||
    cleanPart(item.user?.name);

  if (directName) return directName;

  const composed = [
    item.firstName ?? item.first_name ?? item.user?.firstName ?? item.user?.first_name,
    item.fatherName ?? item.father_name ?? item.user?.fatherName ?? item.user?.father_name,
    item.lastName ?? item.last_name ?? item.user?.lastName ?? item.user?.last_name,
  ]
    .map(cleanPart)
    .filter(Boolean)
    .join(" ");

  return composed || "Unnamed staff member";
}

function resolveStaffRole(item: any): string {
  const role =
    item.role?.[0] ??
    item.roles?.[0]?.name ??
    item.user?.role?.[0] ??
    item.user?.roles?.[0]?.name ??
    item.role ??
    item.job_title ??
    item.department;

  if (!role) return "Staff member";

  return String(role)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function useCommunicationOptions() {
  const gradesQuery = useQuery({
    queryKey: ["settings", "grades"],
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES,
      );

      return extractArray(response).map((item: any) => ({
        id: Number(item.id),
        name: item.name || item.grade_name || `Grade ${item.id}`,
      }));
    },
  });

  const classroomsQuery = useQuery({
    queryKey: ["settings", "classrooms"],
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ENDPOINTS.SETTINGS.ACADEMIC_CLASSROOMS,
      );

      return extractArray(response).map((item: any) => ({
        id: Number(item.id),
        name: item.name || item.classroom_name || `Classroom ${item.id}`,
        subtitle: item.grade?.name || item.grade_name || undefined,
        parentId: Number(
          item.gradeId ??
            item.grade_id ??
            item.grade_level_id ??
            item.grade?.id,
        ),
      }));
    },
  });

  const studentsQuery = useQuery({
    queryKey: ["students", "communication-options"],
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ENDPOINTS.STUDENTS.FILTER,
        { params: { per_page: 100, sort: "asc" } },
      );

      return extractArray(response)
        .map((item: any) => {
          const rawId =
            item.enrollmentId ??
            item.enrollment_id ??
            item.studentId ??
            item.student_id ??
            item.id;
          const id = Number(rawId);

          if (!Number.isFinite(id) || id <= 0) return null;

          const name =
            item.fullName ??
            item.full_name ??
            item.name ??
            "Unnamed student";
          const gradeName = item.grade?.name ?? item.grade_name ?? "";
          const classroomName =
            item.classroom?.name ?? item.classroom_name ?? "";

          return {
            id,
            name,
            subtitle:
              [gradeName, classroomName].filter(Boolean).join(" · ") ||
              "Student",
          };
        })
        .filter(Boolean) as OptionItem[];
    },
  });

  const staffQuery = useQuery({
    queryKey: ["staff", "communication-options"],
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ENDPOINTS.STAFF.ALPHABETICAL,
        { params: { per_page: 100, direction: "asc" } },
      );

      return extractArray(response)
        .map((item: any) => {
          // Alert payload requires staff.id, not user.id.
          const id = Number(item.id ?? item.staffId ?? item.staff_id);

          if (!Number.isFinite(id) || id <= 0) return null;

          return {
            id,
            name: resolveStaffName(item),
            subtitle: resolveStaffRole(item),
          };
        })
        .filter(Boolean) as OptionItem[];
    },
  });

  return {
    gradeLevels: gradesQuery.data ?? [],
    classRooms: classroomsQuery.data ?? [],
    students: studentsQuery.data ?? [],
    staff: staffQuery.data ?? [],
    isLoadingOptions:
      gradesQuery.isLoading ||
      classroomsQuery.isLoading ||
      studentsQuery.isLoading ||
      staffQuery.isLoading,
  };
}
