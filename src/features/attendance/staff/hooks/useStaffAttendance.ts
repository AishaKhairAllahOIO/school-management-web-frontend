import { useQuery } from '@tanstack/react-query';
import { staffAttendanceService } from '../api/staffAttendance.api';

export const useStaffAttendance = (date: string) => {
  return useQuery({
    queryKey: ['staff-attendances', date],
    queryFn: async () => {
        const response = await staffAttendanceService.getRecordById(date); // أو استبدالها بدالة الفلترة المناسبة
      return response.data.data;
    },
    enabled: !!date,
  });
};