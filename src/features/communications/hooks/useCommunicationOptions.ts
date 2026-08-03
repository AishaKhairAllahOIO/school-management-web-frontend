import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { OptionItem } from "../components/shared/MultiSelectAudience";



const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
};

export function useCommunicationOptions() {
  const gradesQuery = useQuery({
    queryKey: ["settings", "grades"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES);
      const data = extractArray(response.data);
      return data.map((item: any) => ({
        id: Number(item.id),
        name: item.name || item.grade_name || `Grade ${item.id}`,
      }));
    },
  });

  const classroomsQuery = useQuery({
    queryKey: ["settings", "classrooms"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_CLASSROOMS);
      const data = extractArray(response.data);
      return data.map((item: any) => ({
        id: Number(item.id),
        name: item.name || item.classroom_name || `Classroom ${item.id}`,
        subtitle: item.grade?.name || item.grade_name || undefined,

        parentId: Number(item.grade_id || item.grade_level_id || item.grade?.id),
      }));
    },
  });

const studentsQuery = useQuery({
    queryKey: ["students", "options"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.STUDENTS.FILTER); 
        
        let data = [];
        if (Array.isArray(response.data)) {
            data = response.data;
        } else if (Array.isArray(response.data?.data)) {
            data = response.data.data;
        } else if (Array.isArray(response.data?.data?.data)) {
            data = response.data.data.data;
        } else if (Array.isArray(response.data?.students)) {
            data = response.data.students;
        }

        return data.map((item: any) => {

          const rawId = item.enrollmentId ?? item.studentId ?? item.userId ?? item.id;
          const id = Number(rawId);
          
          if (!id || isNaN(id)) return null;


          const name = item.fullName ?? item.name ?? `Student #${id}`;


          const gradeName = item.grade?.name ?? item.grade_name ?? "";
          const className = item.classroom?.name ?? item.classroom_name ?? "";
          const subtitle = `${gradeName} ${className}`.trim() || "Student";
          
          return { id, name, subtitle };
        }).filter(Boolean) as OptionItem[]; 
      } catch (error) {
        console.error("❌ Failed to load students:", error);
        return [];
      }
    },
  });

  const staffQuery = useQuery({
    queryKey: ["staff", "options"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.STAFF.ALPHABETICAL);
        const data = extractArray(response.data);
        return data.map((item: any) => {

          const id = Number(item.id ?? item.staff_id ?? item.user_id ?? item.user?.id);
          if (!id || isNaN(id)) return null;


          const name = item.full_name || item.name || item.first_name || item.user?.name || `Staff #${id}`;
          const subtitle = item.role || item.job_title || item.department || "Staff Member";
          
          return { id, name, subtitle };
        }).filter(Boolean) as OptionItem[];
      } catch (error) {
        console.error("Failed to load staff options", error);
        return [];  
      }
    },
  });

  return {
    gradeLevels: gradesQuery.data ?? [],
    classRooms: classroomsQuery.data ?? [],
    students: studentsQuery.data ?? [],
    staff: staffQuery.data ?? [],
    isLoadingOptions: gradesQuery.isLoading || classroomsQuery.isLoading || studentsQuery.isLoading || staffQuery.isLoading,
  };
}