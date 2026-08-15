import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffLeaveService } from '../api/staffLeave.api';

export const useDeleteStaffLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await staffLeaveService.deleteLeave(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['staff-attendances'] });
    },
  });
};