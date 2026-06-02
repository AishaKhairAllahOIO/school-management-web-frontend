import { useMemo, useState } from "react";

import { useStudentAttendance }
from "../hooks/useStudentAttendance";

import { AttendanceStats }
from "../components/AttendanceStats";

import { AttendanceTable }
from "../components/AttendanceTable";

import { AttendanceFilters }
from "../components/AttendanceFilters";

export const StudentAttendancePage =
() => {

  const {
    data = [],
    isLoading,
  } = useStudentAttendance();

  const [search, setSearch] =
    useState("");

  const [
    classFilter,
    setClassFilter,
  ] = useState("all");

  const [
    sectionFilter,
    setSectionFilter,
  ] = useState("all");

  const [status, setStatus] =
    useState("all");

  const [
    absenceType,
    setAbsenceType,
  ] = useState("all");

  const filteredData =
    useMemo(() => {
      return data.filter(
        (student) => {

          const matchesSearch =
            student.studentName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesClass =
            classFilter ===
              "all" ||
            student.className ===
              classFilter;

          const matchesSection =
            sectionFilter ===
              "all" ||
            student.section ===
              sectionFilter;

          const matchesStatus =
            status === "all" ||
            student.status ===
              status;

          const matchesAbsenceType =
            absenceType ===
              "all" ||
            student.absenceType ===
              absenceType;

          return (
            matchesSearch &&
            matchesClass &&
            matchesSection &&
            matchesStatus &&
            matchesAbsenceType
          );
        }
      );
    }, [
      data,
      search,
      classFilter,
      sectionFilter,
      status,
      absenceType,
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
        x.status ===
        "Present"
    ).length;

  const absent =
    filteredData.filter(
      (x) =>
        x.status ===
        "Absent"
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

console.log(filteredData);

return (
  <div className="space-y-6">

    {/* Header */}

    <div>
      <h1 className="text-3xl font-bold">
        Student Attendance
      </h1>

      <p className="text-muted-foreground">
        Manage student attendance records.
      </p>
    </div>

    {/* Statistics */}

    <AttendanceStats
      total={filteredData.length}
      present={present}
      absent={absent}
      excused={excused}
      unexcused={unexcused}
    />

    {/* Filters Card */}

    <div
      className="
        soft-card
        rounded-3xl
        p-5
        space-y-4
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="w-full lg:max-w-md">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by student name..."
            className="
              h-11
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              px-4
              outline-none
              transition-all
              focus:ring-2
              focus:ring-primary/20
            "
          />
        </div>

        <div className="flex gap-3">
          <button
            className="
              rounded-2xl
              border
              px-4
              py-2
              text-sm
              font-medium
            "
          >
            Export
          </button>

          <button
            className="
              rounded-2xl
              bg-primary
              px-4
              py-2
              text-sm
              font-medium
              text-white
            "
          >
            Take Attendance
          </button>
        </div>
      </div>

      <AttendanceFilters
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        sectionFilter={sectionFilter}
        setSectionFilter={setSectionFilter}
        status={status}
        setStatus={setStatus}
        absenceType={absenceType}
        setAbsenceType={setAbsenceType}
      />
    </div>

    {/* Table */}

    <AttendanceTable
      data={filteredData as any}
    />
  </div>
);
};