import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { OptionItem } from "../components/shared/MultiSelectAudience";

// دالة ذكية لاستخراج المصفوفة مهما كان شكل تغليف الـ JSON من لارافيل
const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  if (res.data && res.data.data && Array.isArray(res.data.data.data)) return res.data.data.data;
  if (Array.isArray(res.staff)) return res.staff;
  if (Array.isArray(res.students)) return res.students;
  if (Array.isArray(res.grades)) return res.grades;
  if (Array.isArray(res.classrooms)) return res.classrooms;
  return [];
};

export function useCommunicationOptions() {
  // 1. جلب المراحل الدراسية
  const gradesQuery = useQuery({
    queryKey: ["settings", "grades"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES);
      const data = extractArray(response.data);
      return data.map((item: any) => ({
        id: Number(item.id),
        name: item.name || item.grade_name || `مرحلة ${item.id}`,
      }));
    },
  });

  // 2. جلب الشعب المدرسية
  const classroomsQuery = useQuery({
    queryKey: ["settings", "classrooms"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_CLASSROOMS);
      const data = extractArray(response.data);
      return data.map((item: any): OptionItem => ({
        id: Number(item.id),
        name: item.name || item.classroom_name || `شعبة ${item.id}`,
        subtitle: item.grade?.name || item.grade_name || undefined,
      }));
    },
  });

  // 3. جلب الطلاب (مع كاشف ذكي للاسم من أي علاقة في لارافيل)
  const studentsQuery = useQuery({
    queryKey: ["students", "options"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.STUDENTS.FILTER);
      const data = extractArray(response.data);
      return data.map((item: any): OptionItem => {
        const id = Number(item.enrollment_id || item.id || item.user_id);
        
        // 🌟 فحص جميع الحقول والعلاقات الممكنة للاسم
        const name =
          item.full_name ||
          item.name ||
          item.student_name ||
          item.user?.name ||
          item.user?.full_name ||
          `${item.first_name || item.user?.first_name || item.student?.first_name || ""} ${item.last_name || item.user?.last_name || item.student?.last_name || ""}`.trim() ||
          `${item.first_name_ar || ""} ${item.last_name_ar || ""}`.trim() ||
          `طالب رقم ${id}`;

        const subtitle = `${item.grade_name || item.grade?.name || ""} - ${item.classroom_name || item.classroom?.name || ""}`.replace(/^- |- $/g, "") || "طالب";
        return { id, name, subtitle };
      });
    },
  });

  // 4. جلب الموظفين
  const staffQuery = useQuery({
    queryKey: ["staff", "options"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.STAFF.ALPHABETICAL);
      const data = extractArray(response.data);
      return data.map((item: any): OptionItem => {
        const id = Number(item.id || item.staff_id || item.user_id);
        
        const name =
          item.full_name ||
          item.name ||
          item.user?.name ||
          `${item.first_name || item.user?.first_name || ""} ${item.last_name || item.user?.last_name || ""}`.trim() ||
          `موظف رقم ${id}`;

        const subtitle = item.role || item.job_title || item.department || "موظف";
        return { id, name, subtitle };
      });
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