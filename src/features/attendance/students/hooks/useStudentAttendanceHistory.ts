import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/studentAttendance.service';
import { getAxiosErrorMessage } from '@/services/axios/axiosError';

export const useStudentAttendanceHistory = (enrollmentId: string | number, page: number = 1) => {
  return useQuery({
    queryKey: ['student-attendance-history', enrollmentId, page],
    queryFn: async () => {
      try {
        const response = await studentAttendanceService.getHistory(enrollmentId, page);

        return response.data?.data; 
      } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
      }
    },
    enabled: !!enrollmentId,
  });
};