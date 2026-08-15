import { useQuery } from '@tanstack/react-query';
import { staffLeaveService } from '../api/staffLeave.api';

export const useStaffLeaves = (staffId?: string | number) => {
  return useQuery({
    queryKey: ['staff-leaves', staffId],
    queryFn: async () => {
      if (!staffId) return [];
      const response = await staffLeaveService.getStaffLeaves(staffId);
      const data = response.data;
      
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
    enabled: !!staffId, // ✅ لا ينفذ الطلب أبدًا إذا لم يكن هناك موظف محدد
  });
};