import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffAttendanceService } from '../api/staffAttendance.api';
import type { CreateStaffAttendancePayload } from '../types/staffAttendance.types';

export const useCreateStaffAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffAttendancePayload) => {
      const response = await staffAttendanceService.createRecord(payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-attendances'] });
    },
  });
};