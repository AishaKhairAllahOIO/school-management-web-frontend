import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/studentAttendance.service';
import type { 
  PaginatedData, 
  StudentAttendance, 
  BulkAttendancePayload, 
  AttendanceStatus, 
  AbsenceType 
} from '../types/attendance.types';
import { getAxiosErrorMessage } from "@/services/axios/axiosError";

type FetchParams = {
  date: string;
  gradeId?: string | number;
  classroomId?: string | number;
  page: number;
  search?: string;
  status?: string;
  absenceType?: string;
  semesterId?: number | null;
};

export const useStudentAttendance = (params: FetchParams) => {
  return useQuery({
    queryKey: [
      'student-attendance', 
      params.date, 
      params.gradeId, 
      params.classroomId, 
      params.page, 
      params.search, 
      params.status, 
      params.absenceType, 
      params.semesterId
    ],
    queryFn: async () => {
      // 🌟 نرسل البيانات مباشرة كما هي قادمة من الواجهة
      // الـ Service التي صنعناها قبل قليل ستتكفل بتنظيف أي قيمة تساوي "all"
      const response = await studentAttendanceService.getRecords({
        attendance_date: params.date,
        grade_level_id: params.gradeId,
        class_room_id: params.classroomId,
        page: params.page,
        search_name: params.search,
        status: params.status,
        absence_type: params.absenceType,
        semester_id: params.semesterId || undefined,
      });
      
      return response.data?.data as PaginatedData<StudentAttendance>; 
    },
    // 🌟 تفعيل دائم للطلب طالما أن هناك تاريخ (حتى لو كانت باقي الفلاتر "all")
    enabled: Boolean(params.date), 
  });
};

export interface CreateAttendancePayload {
  enrollment_id: number;
  attendance_date: string;
  status: AttendanceStatus | string;
  absence_type: AbsenceType | string | null;
}

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAttendancePayload) => {
      try {
        const response = await studentAttendanceService.storeRecord(payload);
        return response.data?.data; 
      } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['student-attendance-history'] });
    },
  });
};

export const useBulkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkAttendancePayload) => {
      try {
        const response = await studentAttendanceService.storeBulk(payload);
        return response.data;
      } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};