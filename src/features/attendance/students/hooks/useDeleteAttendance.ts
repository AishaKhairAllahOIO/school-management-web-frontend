import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.api';

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await studentAttendanceService.deleteRecord(id);
      return response.data; 
    },
    onSuccess: () => {

        queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};