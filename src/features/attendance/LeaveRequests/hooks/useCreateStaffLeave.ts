import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffLeaveService } from '../api/staffLeave.api';
import type { CreateStaffLeavePayload } from '../../staff/types/staffAttendance.types';

export const useCreateStaffLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffLeavePayload) => {
      const response = await staffLeaveService.createLeave(payload);
      return response.data.data;
    },
    onSuccess: () => {

        queryClient.invalidateQueries({ queryKey: ['staff-leaves'] });
    },
  });
};