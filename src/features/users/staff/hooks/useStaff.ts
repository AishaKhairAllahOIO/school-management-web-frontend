import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  staffApi,
} from "../api/staff.api";

import {
  staffKeys,
} from "./staff.keys";

import type {
  ApiId,
  RegisterStaffValues,
  StaffRole,
  UpdateStaffEmploymentValues,
  UpdateStaffPersonalValues,
} from "../types/staff.types";

export function useStaffByRole(
  role: StaffRole,
  page = 1,
  perPage = 15,
) {
  return useQuery({
    queryKey:
      staffKeys.rolePage(
        role,
        page,
        perPage,
      ),

    queryFn: () =>
      staffApi.getByRole(
        role,
        page,
        perPage,
      ),

    placeholderData: (
      previousData,
    ) => previousData,
  });
}

export function useStaffDetails(
  staffId:
    | ApiId
    | null
    | undefined,
) {
  return useQuery({
    queryKey:
      staffKeys.detail(
        staffId ?? "disabled",
      ),

    queryFn: () =>
      staffApi.getDetails(
        staffId!,
      ),

    enabled:
      staffId !== null &&
      staffId !== undefined,
  });
}

export function useRegisterStaff(
  role: StaffRole,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      values:
        RegisterStaffValues,
    ) =>
      staffApi.register(
        role,
        values,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          staffKeys.role(role),
      });
    },
  });
}

export function useUpdateStaffPersonal(
  role: StaffRole,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      values,
    }: {
      staffId: ApiId;
      values:
        UpdateStaffPersonalValues;
    }) =>
      staffApi.updatePersonal(
        staffId,
        values,
      ),

    onSuccess: async (
      staff,
    ) => {
      queryClient.setQueryData(
        staffKeys.detail(
          staff.id,
        ),
        staff,
      );

      await queryClient.invalidateQueries({
        queryKey:
          staffKeys.role(role),
      });
    },
  });
}

export function useUpdateStaffEmployment(
  role: StaffRole,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      values,
    }: {
      staffId: ApiId;
      values:
        UpdateStaffEmploymentValues;
    }) =>
      staffApi.updateEmployment(
        staffId,
        values,
      ),

    onSuccess: async (
      staff,
    ) => {
      queryClient.setQueryData(
        staffKeys.detail(
          staff.id,
        ),
        staff,
      );

      await queryClient.invalidateQueries({
        queryKey:
          staffKeys.role(role),
      });
    },
  });
}

export function useToggleStaffStatus(
  role: StaffRole,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      staffId: ApiId,
    ) =>
      staffApi.toggleStatus(
        staffId,
      ),

    onSuccess: async (
      _data,
      staffId,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            staffKeys.role(role),
        }),

        queryClient.invalidateQueries({
          queryKey:
            staffKeys.detail(
              staffId,
            ),
        }),
      ]);
    },
  });
}

export function useDeleteStaff(
  role: StaffRole,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      staffId: ApiId,
    ) =>
      staffApi.remove(
        staffId,
      ),

    onSuccess: async (
      _data,
      staffId,
    ) => {
      queryClient.removeQueries({
        queryKey:
          staffKeys.detail(
            staffId,
          ),
      });

      await queryClient.invalidateQueries({
        queryKey:
          staffKeys.role(role),
      });
    },
  });
}