import { useMemo, useState } from "react";

import { useStaffAttendance }
from "../hooks/useStaffAttendance";

import { AttendanceStats }
from "../components/AttendanceStats";

import { StaffAttendanceTable }
from "../components/StaffAttendanceTable";

import { AddStaffAttendanceDialog }
from "../components/AddStaffAttendanceDialog";

import { AttendanceFilters }
from "../components/StaffAttendanceFilters";

import { AttendanceDateNavigator }
from "../components/AttendanceDateNavigator";

export const StaffAttendancePage = () => {
  const {
    data = [],
    isLoading,
  } = useStaffAttendance();

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [date, setDate] =
    useState("");

  const filteredData =
    useMemo(() => {
      return data.filter(
        (employee) => {
          const matchesSearch =
            employee.employeeName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesRole =
            role === "all" ||
            employee.role === role;

          const matchesStatus =
            status === "all" ||
            employee.status === status;

          const matchesDate =
            !date ||
            employee.date === date;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus &&
            matchesDate
          );
        }
      );
    }, [
      data,
      search,
      role,
      status,
      date,
    ]);

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const present =
    filteredData.filter(
      (x) =>
        x.status === "Present"
    ).length;

  const absent =
    filteredData.filter(
      (x) =>
        x.status === "Absent"
    ).length;

  const excused =
    filteredData.filter(
      (x) =>
        x.absenceType ===
        "Excused"
    ).length;

  const unexcused =
    filteredData.filter(
      (x) =>
        x.absenceType ===
        "Unexcused"
    ).length;

  return (
    <div className="space-y-6">

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Staff Attendance
          </h1>

          <p
            className="
              text-muted-foreground
            "
          >
            Manage staff attendance.
          </p>
        </div>

        <AddStaffAttendanceDialog />
      </div>

      <AttendanceStats
        total={
          filteredData.length
        }
        present={present}
        absent={absent}
        excused={excused}
        unexcused={
          unexcused
        }
      />

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <AttendanceDateNavigator
         date={date}
         setDate={setDate}
         />
        <AttendanceFilters
          search={search}
          setSearch={setSearch}
          role={role}
          setRole={setRole}
          status={status}
          setStatus={setStatus}

        />
      </div>

      <StaffAttendanceTable
        data={filteredData}
      />
    </div>
  );
};