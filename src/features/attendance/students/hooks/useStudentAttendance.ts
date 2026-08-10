import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.api';

export const useStudentAttendance = (date: string, classroomId: number = 1) => {
  return useQuery({
    queryKey: ['student-attendance', date, classroomId],
    queryFn: async () => {
      const response = await studentAttendanceService.getRecords({
        class_room_id: classroomId, 
        attendance_date: date,
      });
    
      return response.data.data; 
    },

    enabled: !!classroomId, 
  });
};