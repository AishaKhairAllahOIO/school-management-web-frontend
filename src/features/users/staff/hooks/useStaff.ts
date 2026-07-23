import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { staffApi } from "../api/staff.api";
import { staffKeys } from "./staff.keys";

import type {
  ApiId,
  RegisterStaffValues,
  StaffRole,
  UpdateStaffEmploymentValues,
  UpdateStaffPersonalValues,
} from "../types/staff.types";

type UpdateStaffPersonalMutationVariables = {
  staffId: ApiId;
  values: UpdateStaffPersonalValues;
};

type UpdateStaffEmploymentMutationVariables = {
  staffId: ApiId;
  values: UpdateStaffEmploymentValues;
};

function hasStaffId(
  staffId: ApiId | null | undefined,
): staffId is ApiId {
  return (
    staffId !== null &&
    staffId !== undefined &&
    staffId !== ""
  );
}

export function useStaffByRole(
  role: StaffRole,
  page = 1,
  perPage = 15,
) {
  return useQuery({
    queryKey: staffKeys.rolePage(
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
  const isEnabled =
    hasStaffId(staffId);

  return useQuery({
    queryKey: staffKeys.detail(
      isEnabled
        ? staffId
        : "disabled",
    ),

    queryFn: () => {
      if (!isEnabled) {
        throw new Error(
          "A staff ID is required to load staff details.",
        );
      }

      return staffApi.getDetails(
        staffId,
      );
    },

    enabled: isEnabled,
  });
}

export function useMyStaffProfile() {
  return useQuery({
    queryKey:
      staffKeys.profile(),

    queryFn: () =>
      staffApi.getProfile(),
  });
}

export function useRegisterStaff(
  role: StaffRole,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      values: RegisterStaffValues,
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
    }: UpdateStaffPersonalMutationVariables) =>
      staffApi.updatePersonal(
        staffId,
        values,
      ),

    onSuccess: async (
      staff,
      variables,
    ) => {
      queryClient.setQueryData(
        staffKeys.detail(
          variables.staffId,
        ),
        staff,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            staffKeys.role(role),
        }),

        queryClient.invalidateQueries({
          queryKey:
            staffKeys.profile(),
        }),
      ]);
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
    }: UpdateStaffEmploymentMutationVariables) =>
      staffApi.updateEmployment(
        staffId,
        values,
      ),

    onSuccess: async (
      staff,
      variables,
    ) => {
      queryClient.setQueryData(
        staffKeys.detail(
          variables.staffId,
        ),
        staff,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            staffKeys.role(role),
        }),

        queryClient.invalidateQueries({
          queryKey:
            staffKeys.profile(),
        }),
      ]);
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

        queryClient.invalidateQueries({
          queryKey:
            staffKeys.profile(),
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
