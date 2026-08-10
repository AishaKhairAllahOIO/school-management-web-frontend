import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.api';
import type { AttendanceStatus, AbsenceType } from '../types/attendance.types';


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
      const response = await studentAttendanceService.createRecord(payload);
      // نستخرج البيانات من غلاف Axios ومن غلاف ApiResponse
      return response.data.data; 
    },
    onSuccess: () => {
      // إجبار React Query على تحديث الجداول والعدادات فوراً بعد نجاح الإضافة
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};