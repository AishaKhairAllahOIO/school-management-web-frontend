import { useQuery } from '@tanstack/react-query';
import { staffAttendanceService } from '../api/staffAttendance.api';

export const useStaffAttendance = (date: string) => {
  return useQuery({
    queryKey: ['staff-attendances', date],
    queryFn: async () => {
      const response = await staffAttendanceService.getDailyRoster(date);
      const data = response.data.data;

      return Array.isArray(data) ? data : (data?.data || []);
    },
    enabled: !!date,
  });
};