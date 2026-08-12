import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.api';

export const useStudentAttendanceHistory = (studentId: string | number) => {
  return useQuery({
    queryKey: ['student-attendance-history', studentId],
    queryFn: async () => {
      const response = await studentAttendanceService.getHistory(studentId);
      return response.data.data;
    },
    enabled: !!studentId,
  });
};