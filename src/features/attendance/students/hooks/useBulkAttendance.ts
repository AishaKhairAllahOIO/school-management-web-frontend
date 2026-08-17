import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/studendAttendance.service';
import type { BulkAttendancePayload } from '../types/attendance.types';

export const useBulkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkAttendancePayload) => {
      const response = await studentAttendanceService.storeBulk(payload);
      return response.data;
    },
    onSuccess: () => {
      // إجبار React Query على تحديث الجداول والعدادات فوراً بعد نجاح الإضافة بالجملة
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};