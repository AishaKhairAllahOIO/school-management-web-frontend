import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveTypeService } from "../api/leaveTypeService";
import type { CreateLeaveTypePayload, UpdateLeaveTypePayload } from "../types/leaveType.types";

export const LEAVE_TYPES_QUERY_KEY = "leave-types";

// جلب جميع أنواع الإجازات
export const useLeaveTypes = () => {
  return useQuery({
    queryKey: [LEAVE_TYPES_QUERY_KEY],
    queryFn: async () => {
      const response = await leaveTypeService.getLeaveTypes();
      const data = response.data;
      
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
  });
};

// إنشاء نوع إجازة جديد
export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeaveTypePayload) => 
      leaveTypeService.createLeaveType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_TYPES_QUERY_KEY] });
    },
  });
};

// تعديل نوع إجازة
export const useUpdateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateLeaveTypePayload) => 
      leaveTypeService.updateLeaveType(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_TYPES_QUERY_KEY] });
    },
  });
};

// حذف نوع إجازة
export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => 
      leaveTypeService.deleteLeaveType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_TYPES_QUERY_KEY] });
    },
  });
};