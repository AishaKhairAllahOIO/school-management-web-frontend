import { useQuery } from '@tanstack/react-query';
import { staffLeaveService } from '../api/staffLeave.api';

export const useStaffLeaves = (staffId: string | number) => {
  return useQuery({
    queryKey: ['staff-leaves', staffId],
    queryFn: async () => {
      const response = await staffLeaveService.getStaffLeaves(staffId);
      return response.data.data;
    },
    enabled: !!staffId,
  });
};