import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.api';
import type { AttendanceRecord } from '../types/attendance.types';

export const useStudentAttendanceHistory = (studentId: string | number) => {
  return useQuery({
    queryKey: ['student-attendance-history', studentId],
    queryFn: async () => {
      const response = await studentAttendanceService.getHistory(studentId);
      const responseData = response.data.data;

      // 1. الحماية الأساسية: استخراج المصفوفة سواء كانت مباشرة أو داخل كائن Pagination
      let rawArray = [];
      if (Array.isArray(responseData)) {
        rawArray = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        rawArray = responseData.data;
      }

      // 2. تحويل البيانات لتتطابق مع ما تتوقعه الشاشة (تجنباً لأخطاء الـ Map)
      const formattedRecords: AttendanceRecord[] = rawArray.map((item: any) => {
        // إذا كانت البيانات قادمة من مسار الفلتر (تحتوي على كائن attendance داخلي)
        if (item.attendance) {
          return {
            id: item.attendance.id || item.enrollment_id,
            attendance_date: item.attendance.attendance_date || new Date().toISOString().slice(0, 10),
            status: item.attendance.status || 'present',
            absence_type: item.attendance.absence_type || null,
          };
        }
        return item;
      });

      return formattedRecords;
    },
    enabled: !!studentId,
  });
};