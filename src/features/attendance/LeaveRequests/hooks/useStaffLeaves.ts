import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffLeaveService } from "../api/staffLeave.service";
import type {
  CreateStaffLeavePayload,
  UpdateStaffLeavePayload,
} from "../types/staffLeave.types";

export const staffLeavesQueryKey = ["staff-leaves"] as const;

export function useAllStaffLeaves() {
  return useQuery({
    queryKey: [...staffLeavesQueryKey, "all"],
    queryFn: () => staffLeaveService.allRecords(),
  });
}

export function useStaffLeaves(staffId: string | number | null) {
  return useQuery({
    queryKey: [...staffLeavesQueryKey, "staff", staffId],
    queryFn: () => staffLeaveService.getByStaff(staffId!),
    enabled: staffId !== null && staffId !== undefined,
  });
}

export function useStaffLeaveDetails(leaveId: string | number | null) {
  return useQuery({
    queryKey: [...staffLeavesQueryKey, "details", leaveId],
    queryFn: () => staffLeaveService.getDetails(leaveId!),
    enabled: leaveId !== null && leaveId !== undefined,
  });
}

export function useCreateStaffLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffLeavePayload) => staffLeaveService.create(payload),
    onSuccess: () => {
      toast.success("تم تسجيل إجازة الموظف بنجاح.");
      queryClient.invalidateQueries({ queryKey: staffLeavesQueryKey });
      queryClient.invalidateQueries({ queryKey: ["staff-attendance"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل تسجيل الإجازة.");
    },
  });
}

export function useUpdateStaffLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateStaffLeavePayload }) =>
      staffLeaveService.update(id, payload),
    onSuccess: () => {
      toast.success("تم تعديل طلب الإجازة بنجاح.");
      queryClient.invalidateQueries({ queryKey: staffLeavesQueryKey });
      queryClient.invalidateQueries({ queryKey: ["staff-attendance"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل تعديل الإجازة.");
    },
  });
}

export function useDeleteStaffLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => staffLeaveService.remove(id),
    onSuccess: () => {
      toast.success("تم حذف طلب الإجازة بنجاح وإعادة الموظف لحالة حاضر.");
      queryClient.invalidateQueries({ queryKey: staffLeavesQueryKey });
      queryClient.invalidateQueries({ queryKey: ["staff-attendance"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل حذف الإجازة.");
    },
  });
}