import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { OptionItem } from "../components/shared/MultiSelectAudience";

export function useCommunicationOptions() {

  const gradesQuery = useQuery({
    queryKey: ["settings", "grades"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES);
      const data = response.data?.data ?? response.data ?? [];
      return data.map((item: any) => ({
        id: item.id,
        name: item.name || item.grade_name || `مرحلة ${item.id}`,
      }));
    },
  });


  const classroomsQuery = useQuery({
    queryKey: ["settings", "classrooms"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_CLASSROOMS);
      const data = response.data?.data ?? response.data ?? [];
      return data.map((item: any): OptionItem => ({
        id: item.id,
        name: item.name || item.classroom_name || `شعبة ${item.id}`,
        subtitle: item.grade?.name || item.grade_name || undefined,
      }));
    },
  });


  const studentsQuery = useQuery({
    queryKey: ["students", "options"],
    queryFn: async () => {

      const response = await axiosClient.get(API_ENDPOINTS.STUDENTS.FILTER);
      const data = response.data?.data ?? response.data ?? [];
      return data.map((item: any): OptionItem => ({
        id: item.enrollment_id || item.id, 
        name: item.full_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.name,
        subtitle: `${item.grade_name || ""} - ${item.classroom_name || ""}`.replace(/^- |- $/g, "") || "طالب",
      }));
    },
  });


  const staffQuery = useQuery({
    queryKey: ["staff", "options"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.STAFF.ALPHABETICAL);
      const data = response.data?.data ?? response.data ?? [];
      return data.map((item: any): OptionItem => ({
        id: item.id || item.staff_id,
        name: item.full_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.name,
        subtitle: item.role || item.job_title || item.department || "موظف",
      }));
    },
  });

  return {
    gradeLevels: gradesQuery.data ?? [],
    classRooms: classroomsQuery.data ?? [],
    students: studentsQuery.data ?? [],
    staff: staffQuery.data ?? [],
    isLoadingGrades: gradesQuery.isLoading,
    isLoadingClassrooms: classroomsQuery.isLoading,
    isLoadingStudents: studentsQuery.isLoading,
    isLoadingStaff: staffQuery.isLoading,
  };
}