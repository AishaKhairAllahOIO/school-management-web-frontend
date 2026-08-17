import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/studendAttendance.service';
import type { UpdateAttendancePayload } from '../types/attendance.types';

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string | number; payload: UpdateAttendancePayload }) => {
      const response = await studentAttendanceService.updateRecord(id, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['student-attendance-history'] });
    },
  });
};