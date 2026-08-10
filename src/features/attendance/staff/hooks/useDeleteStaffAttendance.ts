import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffAttendanceService } from '../api/staffAttendance.api';

export const useDeleteStaffAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await staffAttendanceService.deleteRecord(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-attendances'] });
    },
  });
};