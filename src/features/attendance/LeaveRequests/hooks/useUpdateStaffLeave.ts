import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffLeaveService } from '../api/staffLeave.api';
import type { CreateStaffLeavePayload } from '../../staff/types/staffAttendance.types';

export const useUpdateStaffLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string | number; payload: Partial<CreateStaffLeavePayload> }) => {
      const response = await staffLeaveService.updateLeave(id, payload);
      return response.data.data;
    },
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['staff-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['staff-attendances'] });
    },
  });
};