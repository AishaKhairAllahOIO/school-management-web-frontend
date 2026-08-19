// import { useQuery } from '@tanstack/react-query';
// import type { PaginatedData, StudentAttendance } from '../types/attendance.types';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { studentAttendanceService } from '../api/studentAttendance.service';
// import type { BulkAttendancePayload, AttendanceStatus, AbsenceType } from '../types/attendance.types';
// import { getAxiosErrorMessage } from "@/services/axios/axiosError";

// type FetchParams = {
//   date: string;
//   classroomId: string;
//   page: number;
//   search?: string;
//   status?: string;
//   absenceType?: string;
//   semesterId?: number | null;
// };

// export const useStudentAttendance = (params: FetchParams) => {
//   return useQuery({
//     queryKey: ['student-attendance', params.date, params.classroomId, params.page, params.search, params.status, params.absenceType, params.semesterId],
//     queryFn: async () => {
//       const formattedDate = new Date(params.date).toISOString().slice(0, 10);

//       const queryParams: any = {
//         class_room_id: params.classroomId, 
//         attendance_date: formattedDate,
//         page: params.page,
//       };

//       if (params.semesterId) queryParams.semester_id = params.semesterId;
//       if (params.search) queryParams.search_name = params.search;
//       if (params.status && params.status !== "all") queryParams.status = params.status;
//       if (params.status === "absent" && params.absenceType && params.absenceType !== "all") {
//         queryParams.absence_type = params.absenceType;
//       }

//       const response = await studentAttendanceService.getRecords(queryParams);
//       return response.data?.data as PaginatedData<StudentAttendance>; 
//     },
//     enabled: Boolean(params.classroomId) && params.classroomId !== 'all' && Boolean(params.date), 
//   });
// };

// export interface CreateAttendancePayload {
//   enrollment_id: number;
//   attendance_date: string;
//   status: AttendanceStatus | string;
//   absence_type: AbsenceType | string | null;
// }

// // 🌟 هوك الحفظ الفردي
// export const useCreateAttendance = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (payload: CreateAttendancePayload) => {
//       try {
//         const response = await studentAttendanceService.storeRecord(payload);
//         return response.data?.data; 
//       } catch (error) {
//         throw new Error(getAxiosErrorMessage(error));
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
//       queryClient.invalidateQueries({ queryKey: ['student-attendance-history'] });
//     },
//   });
// };


// export const useBulkAttendance = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (payload: BulkAttendancePayload) => {
//       try {
//         const response = await studentAttendanceService.storeBulk(payload);
//         return response.data;
//       } catch (error) {
//         throw new Error(getAxiosErrorMessage(error));
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
//     },
//   });
// };
import { useQuery } from '@tanstack/react-query';
import type { PaginatedData, StudentAttendance } from '../types/attendance.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/studentAttendance.service';
import type { BulkAttendancePayload, AttendanceStatus, AbsenceType } from '../types/attendance.types';
import { getAxiosErrorMessage } from "@/services/axios/axiosError";

type FetchParams = {
  date: string;
  gradeId?: string; // 🌟 أضفنا فلتر المرحلة
  classroomId: string;
  page: number;
  search?: string;
  status?: string;
  absenceType?: string;
  semesterId?: number | null;
};

export const useStudentAttendance = (params: FetchParams) => {
  return useQuery({
    queryKey: ['student-attendance', params.date, params.gradeId, params.classroomId, params.page, params.search, params.status, params.absenceType, params.semesterId],
    queryFn: async () => {
      const formattedDate = new Date(params.date).toISOString().slice(0, 10);

      const queryParams: any = {
        attendance_date: formattedDate,
        page: params.page,
      };

      // 🌟 السحر هنا: نرسل الفلاتر فقط إذا لم تكن "all"
      if (params.gradeId && params.gradeId !== "all") queryParams.grade_level_id = params.gradeId;
      if (params.classroomId && params.classroomId !== "all") queryParams.class_room_id = params.classroomId;
      
      if (params.semesterId) queryParams.semester_id = params.semesterId;
      if (params.search) queryParams.search_name = params.search;
      if (params.status && params.status !== "all") queryParams.status = params.status;
      if (params.status === "absent" && params.absenceType && params.absenceType !== "all") {
        queryParams.absence_type = params.absenceType;
      }

      const response = await studentAttendanceService.getRecords(queryParams);
      return response.data?.data as PaginatedData<StudentAttendance>; 
    },
    // 🌟 تفعيل دائم للطلب طالما هناك تاريخ (بما فيها حالة جلب الكل)
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