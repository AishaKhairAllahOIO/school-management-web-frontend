import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/studendAttendance.service';
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
      // استخدام storeRecord بدلاً من storeBulk
      const response = await studentAttendanceService.storeRecord(payload);
      return response.data.data; 
    },
    onSuccess: () => {
      // إجبار React Query على تحديث الجداول
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
      // تحديث صفحة الـ History الخاصة بالطالب
      queryClient.invalidateQueries({ queryKey: ['student-attendance-history'] });
    },
  });
};