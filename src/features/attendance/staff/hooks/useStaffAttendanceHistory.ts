import { useQuery } from '@tanstack/react-query';
import { staffAttendanceService } from '../api/staffAttendance.api';

export const useStaffAttendanceHistory = (staffId: string | number) => {
  return useQuery({
    queryKey: ['staff-attendance-history', staffId],
    queryFn: async () => {
      const response = await staffAttendanceService.getHistory(staffId);
      return response.data.data;
    },
    enabled: !!staffId, 
  });
};