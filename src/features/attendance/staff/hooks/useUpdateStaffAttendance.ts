
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffAttendanceService } from '../api/staffAttendance.api';
import type { CreateStaffAttendancePayload } from '../types/staffAttendance.types';

export const useUpdateStaffAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string | number; payload: Partial<CreateStaffAttendancePayload> }) => {
      const response = await staffAttendanceService.updateRecord(id, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-attendances'] });
    },
  });
};