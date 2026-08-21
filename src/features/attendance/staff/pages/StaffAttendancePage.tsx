import {
  CalendarCheck2,
  CalendarDays,
  FileText,
  Save,
  Search,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { StaffAttendanceStats } from "../components/AttendanceStats";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";

import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { StaffDetailsDialog } from "../components/StaffDetailsDialog";

import {
  useStaffAttendanceList,
  useCreateStaffAttendance,
  useUpdateStaffAttendance,
  useDeleteStaffAttendance,
} from "../hooks/useStaffAttendance";

import {
  useTeacherSchedule,
  useCurrentAcademicPeriod,
} from "@/features/scheduling/class-schedules/hooks/useSchedule";

function todayForApi() {
  return new Date().toISOString().slice(0, 10);
}

const controlClass =
  "h-11 rounded-[14px] border-border/60 bg-background text-[13px] font-medium text-foreground shadow-none outline-none transition-all focus:ring-1 focus:ring-primary/20";

export function StaffAttendancePage() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [page, setPage] = useState(1);

  // --------------------------------------------------
  // Local pending edits
  // --------------------------------------------------

  const [pendingEdits, setPendingEdits] = useState<
    Record<number, any>
  >({});

  // --------------------------------------------------
  // Selected staff
  // --------------------------------------------------

  const [selectedStaff, setSelectedStaff] =
    useState<any>(null);

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [absenceTypeFilter, setAbsenceTypeFilter] =
    useState("all");

  // --------------------------------------------------
  // Academic period / schedule
  // --------------------------------------------------

  const { academicYearId, semesterId } =
    useCurrentAcademicPeriod();

  const { data: teacherSchedule } =
    useTeacherSchedule(
      academicYearId,
      semesterId
    );

  // --------------------------------------------------
  // Day
  // --------------------------------------------------

  const getDayName = (dateStr: string) =>
    new Date(dateStr)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

  const currentDay = getDayName(selectedDate);

  // --------------------------------------------------
  // Attendance list
  // --------------------------------------------------

  const {
    data: rosterResult,
    isLoading: isRosterLoading,
  } = useStaffAttendanceList(
    selectedDate,
    page
  );

  const safeRosterData = rosterResult?.data || [];

  const paginationInfo = {
    currentPage:
      rosterResult?.currentPage || 1,
    lastPage:
      rosterResult?.lastPage || 1,
    total:
      rosterResult?.total || 0,
    from:
      rosterResult?.from || 0,
    to:
      rosterResult?.to || 0,
  };

  // --------------------------------------------------
  // Mutations
  // --------------------------------------------------

  const createMutation =
    useCreateStaffAttendance();

  const updateMutation =
    useUpdateStaffAttendance();

  const deleteMutation =
    useDeleteStaffAttendance();

  // --------------------------------------------------
  // Roles
  // --------------------------------------------------

  const roleOptions = useMemo(() => {
    const roles = safeRosterData
      .map((staff: any) => staff.role)
      .filter(
        (role: any): role is string =>
          typeof role === "string" &&
          role.trim().length > 0
      );

    return Array.from(new Set(roles)).sort(
      (a, b) => a.localeCompare(b)
    );
  }, [safeRosterData]);

  // --------------------------------------------------
  // Filtered roster
  // --------------------------------------------------

  const filteredRosterData = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return safeRosterData.filter((staff: any) => {
      const firstName =
        staff.user?.first_name ||
        staff.first_name ||
        "";

      const lastName =
        staff.user?.last_name ||
        staff.last_name ||
        "";

      const fullName =
        `${firstName} ${lastName}`
          .trim()
          .toLowerCase();

      const role = String(
        staff.role ||
          staff.user?.role ||
          ""
      );

      const attendanceStatus =
        staff.attendance?.status ||
        "present";

      const absenceType =
        staff.attendance?.absence_type ||
        "";

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(
          normalizedSearch
        );

      const matchesRole =
        roleFilter === "all" ||
        role.toLowerCase() ===
          roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        attendanceStatus ===
          statusFilter;

      const matchesAbsenceType =
        absenceTypeFilter === "all" ||
        absenceType ===
          absenceTypeFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesAbsenceType
      );
    });
  }, [
    safeRosterData,
    search,
    roleFilter,
    statusFilter,
    absenceTypeFilter,
  ]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalRecords =
    safeRosterData.length;

  const present =
    safeRosterData.filter(
      (staff: any) =>
        (
          staff.attendance?.status ||
          "present"
        ) === "present"
    ).length;

  const absent =
    safeRosterData.filter(
      (staff: any) =>
        staff.attendance?.status ===
        "absent"
    ).length;

  const onLeave =
    safeRosterData.filter(
      (staff: any) =>
        staff.attendance?.status ===
        "on_leave"
    ).length;

  // مهم: لا نحذف partial absence
  const partialAbsence =
    safeRosterData.filter(
      (staff: any) =>
        staff.attendance?.status ===
        "partial_absence"
    ).length;

  // --------------------------------------------------
  // Local update
  // --------------------------------------------------

  const handleUpdateLocal = (
    staffId: number,
    field: string,
    value: any
  ) => {
    setPendingEdits((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value,
      },
    }));
  };

  // --------------------------------------------------
  // Apply date
  // --------------------------------------------------

  const handleApplyDate = () => {
    if (!draftDate) return;

    setSelectedDate(draftDate);
    setPage(1);

    // منع حفظ تعديلات تخص التاريخ السابق
    setPendingEdits({});
  };

  // --------------------------------------------------
  // Bulk save
  // --------------------------------------------------

  const handleBulkSave = async () => {
    const promises = Object.entries(
      pendingEdits
    ).map(
      async ([staffIdStr, edit]) => {
        const staffId =
          Number(staffIdStr);

        const existingRecord =
          safeRosterData.find(
            (staff: any) =>
              staff.id === staffId
          );

        const recordId =
          existingRecord?.attendance?.id;

        // ------------------------------------------------
        // Final status
        // ------------------------------------------------

        const finalStatus =
          edit.status ??
          (
            existingRecord?.attendance
              ?.status || "present"
          );

        // ------------------------------------------------
        // Final absence type
        // ------------------------------------------------

        const finalAbsenceType =
          edit.absence_type ??
          (
            existingRecord?.attendance
              ?.absence_type ||
            "excused"
          );

        // ------------------------------------------------
        // Missing periods
        // ------------------------------------------------

        const rawPeriods =
          edit.missing_periods ??
          existingRecord?.attendance
            ?.missing_periods ??
          [];

        /*
         * Keep backend payload exactly as IDs.
         *
         * Supports both:
         * [
         *   12,
         *   15
         * ]
         *
         * and:
         * [
         *   { schedule_entry_id: 12 },
         *   { schedule_entry_id: 15 }
         * ]
         */
        const finalMissingPeriods =
          rawPeriods.map(
            (period: any) =>
              typeof period ===
                "object" &&
              period !== null
                ? period.schedule_entry_id
                : period
          );

        // ------------------------------------------------
        // Absent / Partial absence
        // ------------------------------------------------

        const isAbsentOrPartial =
          finalStatus === "absent" ||
          finalStatus ===
            "partial_absence";

        // ------------------------------------------------
        // Existing PRESENT record
        // Delete attendance record
        // ------------------------------------------------

        if (
          finalStatus ===
            "present" &&
          recordId
        ) {
          await deleteMutation.mutateAsync(
            recordId
          );
        }

        // ------------------------------------------------
        // Existing attendance record
        // Update
        // ------------------------------------------------

        else if (recordId) {
          await updateMutation.mutateAsync({
            id: recordId,

            payload: {
              status: finalStatus,

              /*
               * absence_type is sent for:
               * - absent
               * - partial_absence
               *
               * and null otherwise.
               */
              absence_type:
                isAbsentOrPartial
                  ? finalAbsenceType
                  : null,

              /*
               * missing_periods is sent ONLY
               * for partial_absence.
               */
              missing_periods:
                finalStatus ===
                "partial_absence"
                  ? finalMissingPeriods
                  : [],
            },
          });
        }

        // ------------------------------------------------
        // No attendance record
        // Create
        // ------------------------------------------------

        else {
          await createMutation.mutateAsync({
            staff_id: staffId,

            attendance_date:
              selectedDate,

            status: finalStatus,

            absence_type:
              isAbsentOrPartial
                ? finalAbsenceType
                : null,

            missing_periods:
              finalStatus ===
              "partial_absence"
                ? finalMissingPeriods
                : [],
          });
        }
      }
    );

    try {
      await Promise.all(promises);

      setPendingEdits({});
    } catch (error) {
      console.error(
        "Failed to save staff attendance",
        error
      );
    }
  };

  // --------------------------------------------------
  // Save state
  // --------------------------------------------------

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const hasUnsavedChanges =
    Object.keys(pendingEdits)
      .length > 0;

  // --------------------------------------------------
  // Filter state
  // --------------------------------------------------

  const hasActiveFilters =
    search.trim().length > 0 ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    absenceTypeFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setAbsenceTypeFilter("all");
    setPage(1);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <section className="space-y-5 pt-5 animate-in fade-in duration-300">

      {/* ================================================= */}
      {/* Statistics */}
      {/* ================================================= */}

      <StaffAttendanceStats
        total={totalRecords}
        present={present}
        absent={absent}
        onLeave={onLeave}
        partialAbsence={partialAbsence}
        isLoading={isRosterLoading}
      />

      {/* ================================================= */}
      {/* Header + Controls + Filters */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">

        {/* Header */}

        <div className="flex flex-col gap-4 bg-card px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex min-w-0 items-center gap-4">

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/20 bg-primary/[0.08] text-primary shadow-xs">
              <CalendarCheck2
                className="h-[22px] w-[22px]"
                strokeWidth={2}
              />
            </span>

            <div className="min-w-0">

              <h2 className="text-[16px] font-medium tracking-tight text-foreground">
                Staff attendance
              </h2>

              <p className="mt-1 text-[12px] font-medium text-muted-foreground">
                Select date, apply, then save changes.
              </p>

            </div>
          </div>

          {/* Controls */}

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:items-end lg:justify-end">

            {/* Manage Leaves */}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  "/attendance/staff-leaves"
                )
              }
              className="h-11 w-full rounded-[14px] border-border/70 bg-background px-5 text-[13px] font-medium text-foreground shadow-none transition-colors hover:bg-muted/50 sm:w-auto"
            >
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Manage Leaves
            </Button>

            {/* Date */}

            <DatePicker
              value={draftDate}
              onChange={setDraftDate}
              className="w-full sm:w-[228px]"
            />

            {/* Apply */}

            <Button
              type="button"
              variant="outline"
              onClick={handleApplyDate}
              disabled={
                !draftDate ||
                draftDate === selectedDate
              }
              className="h-11 w-full rounded-[14px] border-primary/30 bg-transparent px-5 text-[13px] font-medium text-primary shadow-2xs transition-colors hover:bg-primary/10 sm:w-auto"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Apply
            </Button>

            {/* Save */}

            <Button
              type="button"
              onClick={handleBulkSave}
              disabled={
                !hasUnsavedChanges ||
                isSaving
              }
              className="h-11 w-full rounded-[14px] bg-primary px-6 text-[13px] font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />

              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Filters */}

        <div className="border-t border-border/60 bg-muted/20 p-5">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

            {/* Search */}

            <div className="relative">

              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );
                  setPage(1);
                }}
                placeholder="Search staff..."
                className={`${controlClass} w-full ps-9`}
              />

            </div>

            {/* Role */}

            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className={`${controlClass} w-full`}
              >
                <div className="flex items-center gap-2">
                  <UsersRound className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Staff role" />
                </div>
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All roles
                </SelectItem>

                {roleOptions.map(
                  (role) => (
                    <SelectItem
                      key={role}
                      value={role}
                    >
                      {role}
                    </SelectItem>
                  )
                )}

              </SelectContent>
            </Select>

            {/* Status */}

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className={`${controlClass} w-full`}
              >
                <SelectValue placeholder="Attendance status" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All statuses
                </SelectItem>

                <SelectItem
                  value="present"
                  className="text-success"
                >
                  Present
                </SelectItem>

                <SelectItem
                  value="absent"
                  className="text-destructive"
                >
                  Absent
                </SelectItem>

                <SelectItem
                  value="on_leave"
                  className="text-warning"
                >
                  On leave
                </SelectItem>

                {/* مهم: Partial absence موجود */}
                <SelectItem
                  value="partial_absence"
                  className="text-info"
                >
                  Partial absence
                </SelectItem>

              </SelectContent>
            </Select>

            {/* Absence Type */}

            <Select
              value={absenceTypeFilter}
              onValueChange={(value) => {
                setAbsenceTypeFilter(
                  value
                );
                setPage(1);
              }}
            >
              <SelectTrigger
                className={`${controlClass} w-full`}
              >
                <SelectValue placeholder="Absence type" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All absence types
                </SelectItem>

                <SelectItem
                  value="excused"
                  className="text-info"
                >
                  Excused
                </SelectItem>

                <SelectItem
                  value="unexcused"
                  className="text-warning"
                >
                  Unexcused
                </SelectItem>

              </SelectContent>
            </Select>

          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* Filter result info */}
      {/* ================================================= */}

      {hasActiveFilters && (
        <div className="-mt-1 flex items-center justify-between px-1">

          <p className="text-[11.5px] font-medium text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredRosterData.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {safeRosterData.length}
            </span>{" "}
            staff members
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="text-[11.5px] font-medium text-primary transition-colors hover:text-primary/80"
          >
            Clear filters
          </button>

        </div>
      )}

      {/* ================================================= */}
      {/* Attendance Table */}
      {/* ================================================= */}

      <StaffAttendanceTable
        data={filteredRosterData}
        teacherSchedule={teacherSchedule}
        currentDay={currentDay}
        isLoading={isRosterLoading}
        pendingEdits={pendingEdits}
        onUpdateLocal={handleUpdateLocal}
        onViewDetails={setSelectedStaff}
        pagination={paginationInfo}
        onPageChange={setPage}
      />

      {/* ================================================= */}
      {/* Details */}
      {/* ================================================= */}

      <StaffDetailsDialog
        open={!!selectedStaff}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedStaff(null);
          }
        }}
        staff={selectedStaff}
      />

    </section>
  );
}