import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffAttendanceService } from "../api/staffAttendance.service";
import type { 
  CreateStaffAttendancePayload, 
  UpdateStaffAttendancePayload,
  StaffDailyRosterRecord
} from "../types/staffAttendance.types";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";



export const staffAttendanceQueryKey = ["staff-attendances"] as const;

const extractLaravelError = (error: any): string => {
  const data = error?.response?.data;
  if (data?.errors) {
    const firstErrorKey = Object.keys(data.errors)[0];
    if (firstErrorKey && Array.isArray(data.errors[firstErrorKey])) return data.errors[firstErrorKey][0];
  }
  return data?.message || "حدث خطأ غير متوقع يرجى المحاولة لاحقاً.";
};

export function useStaffAttendanceList(date: string, page = 1) {
  return useQuery({
    queryKey: [...staffAttendanceQueryKey, date, page],
    queryFn: async () => {

      const filterPromise = staffAttendanceService.getFilteredList(date, page);
      const rolesPromise = staffAttendanceService.getAllStaffRoles().catch(() => null);

      const [filterRes, rolesRes] = await Promise.all([filterPromise, rolesPromise]);
      
      const paginatorResponse = filterRes.data?.data || filterRes.data;
      let allStaff = Array.isArray(paginatorResponse?.data) 
        ? paginatorResponse.data 
        : (Array.isArray(paginatorResponse) ? paginatorResponse : []);

      let rolesData: any[] = [];
      if (rolesRes) {
        let rData = rolesRes.data;
        if (Array.isArray(rData?.data)) rolesData = rData.data;
        else if (Array.isArray(rData?.data?.data)) rolesData = rData.data.data;
        else if (Array.isArray(rData)) rolesData = rData;
      }

      const mergedRoster: StaffDailyRosterRecord[] = allStaff.map((staff: any) => {
        const record = staff.attendance; 
        const nestedUser = staff.user || {};
        
        const staffWithRole = rolesData.find((s: any) => 
          String(s.id) === String(staff.id) || String(s.userId || s.user_id) === String(nestedUser.id)
        ) || {};

        let realRole = "Staff";
        if (staffWithRole.role) {
          realRole = Array.isArray(staffWithRole.role) ? staffWithRole.role[0] : staffWithRole.role;
        } else if (nestedUser.roles && Array.isArray(nestedUser.roles) && nestedUser.roles.length > 0) {
          realRole = nestedUser.roles[0].name;
        }

        return {
          id: staff.id,
          user_id: staff.user_id || nestedUser.id || staff.id,
          
          degree: staffWithRole.degree || staff.degree || null,
          specialization: staffWithRole.specialization || staff.specialization || null,
          email: nestedUser.email || staffWithRole.email || staff.email || null,
          phone: nestedUser.phone_number || nestedUser.phoneNumber || staffWithRole.phoneNumber || null,
          gender: nestedUser.gender || staffWithRole.gender || null,
          
          role: realRole,
          
          user: {
            id: nestedUser.id || staff.id,
            first_name: nestedUser.first_name || nestedUser.firstName || staff.first_name || "Unknown",
            last_name: nestedUser.last_name || nestedUser.lastName || staff.last_name || "",
            role: realRole,
            roles: nestedUser.roles || staffWithRole.roles || staff.roles || [], 
          },
          
          attendance: {
            id: record?.id || null,
            status: record?.status || "present",
            absence_type: record?.absence_type || null,
            attendance_date: record?.attendance_date || date,
            missing_periods: record?.missing_periods?.map((p: any) => p.period_index || p) || [],
          }
        };
      });

      return {
        data: mergedRoster,
        currentPage: paginatorResponse?.current_page || page,
        lastPage: paginatorResponse?.last_page || 1,
        total: paginatorResponse?.total || mergedRoster.length,
        from: paginatorResponse?.from || 1,
        to: paginatorResponse?.to || mergedRoster.length,
      };
    },
    placeholderData: (previousData) => previousData,
    enabled: Boolean(date),
  });
}

export function useStaffAttendanceDetail(staffId: number | string | null) {
  return useQuery({
    queryKey: [...staffAttendanceQueryKey, "details", staffId],
    queryFn: async () => {
      const response = await staffAttendanceService.getDetails(staffId!);
      return response.data?.data || response.data;
    },
    enabled: Boolean(staffId),
  });
}

export function useCreateStaffAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffAttendancePayload) => staffAttendanceService.create(payload),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: staffAttendanceQueryKey });
      toast.success(response.data?.message || "تم تسجيل الحضور/الغياب بنجاح.");
    },
    onError: (error) => toast.error(extractLaravelError(error)),
  });
}

export function useUpdateStaffAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateStaffAttendancePayload }) => staffAttendanceService.update(id, payload),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: staffAttendanceQueryKey });
      toast.success(response.data?.message || "تم تعديل السجل بنجاح.");
    },
    onError: (error) => toast.error(extractLaravelError(error)),
  });
}

export function useDeleteStaffAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => staffAttendanceService.delete(id),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: staffAttendanceQueryKey });
      toast.success(response.data?.message || "تم الحذف بنجاح.");
    },
    onError: (error) => toast.error(extractLaravelError(error)),
  });
}



export const useStaffAttendanceHistory = (staffId: string | number) => {
  return useQuery({
    queryKey: ['staff-attendance-history', staffId],
    queryFn: async () => {
      try {
        const response = await staffAttendanceService.getHistory(staffId);

        return response.data?.data || [];
      } catch (error) {
        const message = getAxiosErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: !!staffId, 
  });
};


export const useStaffAttendanceRecordStats = (recordId: string | number) => {
  return useQuery({
    queryKey: ['staff-attendance-stats', recordId],
    queryFn: async () => {
      try {
        const response = await staffAttendanceService.getStats(recordId);
        return response.data?.data;
      } catch (error) {
        const message = getAxiosErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: !!recordId,
  });
};