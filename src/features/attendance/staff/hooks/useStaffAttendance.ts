import {
  useQueries,
} from "@tanstack/react-query";
import {
  useMemo,
} from "react";

import {
  staffApi,
} from "@/features/users/staff/api/staff.api";
import type {
  StaffProfile,
  StaffRole as ApiStaffRole,
} from "@/features/users/staff/types/staff.types";

import type {
  StaffAttendance,
  StaffRole,
} from "../types/staffAttendance.types";

const attendanceRoles: ApiStaffRole[] = [
  "teacher",
  "adviser",
  "secretary",
  "counselor",
  "service_staff",
];

function toAttendanceRole(
  role: ApiStaffRole | null,
): StaffRole | null {
  switch (role) {
    case "teacher":
      return "Teacher";

    case "adviser":
      return "Supervisor";

    case "secretary":
      return "Secretary";

    case "counselor":
      return "Counselor";

    case "service_staff":
      return "Service Staff";

    default:
      return null;
  }
}

function mapStaff(
  staff: StaffProfile,
  attendanceDate: string,
): StaffAttendance | null {
  const role = toAttendanceRole(
    staff.role,
  );

  if (!role || staff.isDeleted) {
    return null;
  }

  return {
    id: String(staff.id),
    employeeId: String(staff.id),

    employeeName:
      staff.fullName ||
      [
        staff.firstName,
        staff.fatherName,
        staff.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Unnamed staff member",

    role,
    date: attendanceDate,
    status: "Present",

    /*
     * Teacher daily periods do not come from a real
     * attendance endpoint yet. Keep the fields ready
     * without inventing a period count.
     */
    requiredPeriods:
      role === "Teacher"
        ? 0
        : undefined,

    attendedPeriods:
      role === "Teacher"
        ? 0
        : undefined,
  };
}

export function useStaffAttendance(
  attendanceDate: string,
) {
  const queryResults = useQueries({
    queries: attendanceRoles.map(
      (role) => ({
        queryKey: [
          "attendance",
          "staff-directory",
          role,
        ],

        queryFn: () =>
          staffApi.getByRole(
            role,
            1,
            100,
          ),

        staleTime: 60_000,
      }),
    ),
  });


  const teacherData =
    queryResults[0]?.data;

  const adviserData =
    queryResults[1]?.data;

  const secretaryData =
    queryResults[2]?.data;

  const counselorData =
    queryResults[3]?.data;

  const serviceStaffData =
    queryResults[4]?.data;

  const data = useMemo<
    StaffAttendance[]
  >(
    () =>
      [
        ...(teacherData?.data ?? []),
        ...(adviserData?.data ?? []),
        ...(secretaryData?.data ?? []),
        ...(counselorData?.data ?? []),
        ...(serviceStaffData?.data ?? []),
      ]
        .map((staff) =>
          mapStaff(
            staff,
            attendanceDate,
          ),
        )
        .filter(
          (
            record,
          ): record is StaffAttendance =>
            record !== null,
        )
        .sort((a, b) =>
          a.employeeName.localeCompare(
            b.employeeName,
          ),
        ),

    [
      attendanceDate,
      teacherData,
      adviserData,
      secretaryData,
      counselorData,
      serviceStaffData,
    ],
  );

  return {
    data,

    isLoading: queryResults.some(
      (query) => query.isLoading,
    ),

    isFetching: queryResults.some(
      (query) => query.isFetching,
    ),

    isError: queryResults.some(
      (query) => query.isError,
    ),

    refetch: async () =>
      Promise.all(
        queryResults.map((query) =>
          query.refetch(),
        ),
      ),
  };
}
