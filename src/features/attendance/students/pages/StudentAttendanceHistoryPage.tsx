import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Pencil,
  Save,
  ShieldAlert,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import { DatePicker } from "@/shared/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useStudentAttendanceHistory } from "../hooks/useStudentAttendanceHistory";
import { useCreateAttendance } from "../hooks/useStudentAttendance";
import { useUpdateAttendance } from "../hooks/useUpdateAttendance";
import { useDeleteAttendance } from "../hooks/useDeleteAttendance";

import type {
  AttendanceStatus,
  AbsenceType,
  AttendanceRecord,
} from "../types/attendance.types";

const controlClass =
  "h-9 rounded-[12px] border-border/60 bg-background/80 text-[12px] font-medium text-foreground shadow-none outline-none focus:ring-1 focus:ring-primary/30 transition-all";

const emptyDraft = {
  date: "",
  status: "absent" as AttendanceStatus,
  absenceType: "excused" as AbsenceType,
};

export function StudentAttendanceHistoryPage() {
  const { studentId = "" } = useParams();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useStudentAttendanceHistory(
    studentId,
    page,
  );

  const studentInfo = data?.student_info;
  const summary = data?.attendance_summary;
  const paginatedRecords = data?.attendance_records;

  const records: AttendanceRecord[] = paginatedRecords?.data || [];
  const totalPages = paginatedRecords?.last_page || 1;

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | string | null>(
    null,
  );
  const [editingRecord, setEditingRecord] =
    useState<AttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<AttendanceRecord | null>(null);

  const createMutation = useCreateAttendance();
  const updateMutation = useUpdateAttendance();
  const deleteMutation = useDeleteAttendance();

  async function addRecord() {
    if (!draft.date) return;

    try {
      await createMutation.mutateAsync({
        enrollment_id: Number(studentId),
        attendance_date: draft.date,
        status: draft.status,
        absence_type:
          draft.status === "present" ? null : draft.absenceType,
      });

      setDraft(emptyDraft);
    } catch (error) {
      console.error("Failed to add record", error);
    }
  }

  function beginEdit(record: AttendanceRecord) {
    setEditingId(record.id);
    setEditingRecord({ ...record });
  }

  async function saveEdit() {
    if (!editingRecord || editingRecord.id === undefined) return;

    try {
      await updateMutation.mutateAsync({
        id: editingRecord.id,
        payload: {
          attendance_date: editingRecord.attendance_date,
          status: editingRecord.status,
          absence_type:
            editingRecord.status === "present"
              ? null
              : (editingRecord.absence_type ?? "excused"),
        },
      });

      setEditingId(null);
      setEditingRecord(null);
    } catch (error) {
      console.error("Failed to update record", error);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteTarget.id === undefined) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  }

  return (
    <section className="space-y-5 pt-5 animate-in fade-in duration-300">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="rounded-[24px] border border-border/70 bg-card p-5 shadow-sm">
        <div className="space-y-5">
          {/* Student Information + Back */}
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Student Attendance
              </p>

              <h1 className="truncate text-[19px] font-semibold tracking-tight text-foreground">
                {studentInfo
                  ? studentInfo.full_name
                  : "Student History"}
              </h1>

              <p className="mt-1 text-[11.5px] font-medium text-muted-foreground">
                Manage attendance records and absences
              </p>
            </div>

            {/* Back - بدون خلفية أو تحديد */}
            <Button
              asChild
              variant="ghost"
              className="h-auto shrink-0 rounded-none bg-transparent px-0 py-1 text-[12px] font-semibold text-muted-foreground shadow-none hover:bg-transparent hover:text-primary"
            >
              <Link
                to="/attendance/students"
                aria-label="Back to student attendance"
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>Back to student attendance</span>
              </Link>
            </Button>
          </div>

          {/* =====================================================
              ADD NEW ABSENCE
          ===================================================== */}
          <div className="rounded-[18px] border border-border/60 bg-muted/20 p-4">
            <div className="mb-3.5">
              <h2 className="text-[14px] font-semibold text-foreground">
                Add new absence
              </h2>

              <p className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">
                Record a specific date for this student.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
              {/* Date */}
              <div className="w-full xl:w-[220px]">
                <DatePicker
                  value={draft.date}
                  onChange={(date) =>
                    setDraft((current) => ({
                      ...current,
                      date,
                    }))
                  }
                />
              </div>

              {/* Attendance Filter */}
              <div className="w-full xl:w-[130px]">
                <Select
                  value={draft.status}
                  onValueChange={(status) =>
                    setDraft((current) => ({
                      ...current,
                      status: status as AttendanceStatus,
                    }))
                  }
                >
                  <SelectTrigger className={controlClass}>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem
                      value="present"
                      className="font-medium text-success"
                    >
                      Present
                    </SelectItem>

                    <SelectItem
                      value="absent"
                      className="font-medium text-destructive"
                    >
                      Absent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Absence Type */}
              <div className="w-full xl:w-[190px]">
                {draft.status === "absent" ? (
                  <Select
                    value={draft.absenceType ?? "excused"}
                    onValueChange={(absenceType) =>
                      setDraft((current) => ({
                        ...current,
                        absenceType:
                          absenceType as AbsenceType,
                      }))
                    }
                  >
                    <SelectTrigger className={controlClass}>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem
                        value="excused"
                        className="font-medium text-info"
                      >
                        Excused absence
                      </SelectItem>

                      <SelectItem
                        value="unexcused"
                        className="font-medium text-warning"
                      >
                        Unexcused absence
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9" />
                )}
              </div>

              {/* Save */}
              <Button
                type="button"
                onClick={addRecord}
                disabled={
                  !draft.date || createMutation.isPending
                }
                className="h-9 w-full rounded-[12px] bg-primary px-5 text-[12px] font-semibold text-primary-foreground transition-all hover:bg-primary/90 xl:w-[110px]"
              >
                <Save className="mr-1.5 h-4 w-4" />

                {createMutation.isPending
                  ? "Saving..."
                  : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          STATISTICS
      ========================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* Allowed Days */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-success/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-success/[0.12] text-success">
            <CheckCircle2
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Allowed Days
            </span>

            <strong className="text-[20px] font-semibold leading-none text-success">
              {summary?.allowed_absence_days || 0}
            </strong>
          </div>
        </div>

        {/* Unexcused Absents */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-destructive/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-destructive/[0.12] text-destructive">
            <ShieldAlert
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Unexcused Absents
            </span>

            <strong className="text-[20px] font-semibold leading-none text-destructive">
              {summary?.total_unexcused_absent || 0}
            </strong>
          </div>
        </div>

        {/* Remaining Days */}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-primary/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.12] text-primary">
            <Info
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </span>

          <div className="min-w-0">
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              Remaining Days
            </span>

            <strong className="text-[20px] font-semibold leading-none text-primary">
              {summary?.remaining_absence_days || 0}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================================
          ATTENDANCE TIMELINE
      ========================================================= */}
      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">
              Attendance timeline
            </h2>

            <p className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `Showing ${records.length} records on this page`}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[25%]" />
            </colgroup>

            <thead className="bg-muted/40">
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="h-12 px-6 text-start">
                  Date
                </th>

                <th className="h-12 px-6 text-start">
                  Attendance
                </th>

                <th className="h-12 px-6 text-start">
                  Type
                </th>

                <th className="h-12 px-6 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-t border-border/50"
                    >
                      <td
                        colSpan={4}
                        className="px-6 py-4"
                      >
                        <div className="h-10 animate-pulse rounded-[12px] bg-muted/50" />
                      </td>
                    </tr>
                  ))
                : records.map(
                    (record: AttendanceRecord) => {
                      const isEditing =
                        editingId === record.id &&
                        editingRecord;

                      return (
                        <tr
                          key={record.id}
                          className="border-t border-border/50 text-[12.5px] transition-colors hover:bg-muted/30"
                        >
                          {/* Date */}
                          <td className="px-6 py-4 font-semibold text-foreground">
                            {isEditing ? (
                              <DatePicker
                                value={
                                  editingRecord.attendance_date
                                }
                                onChange={(date) =>
                                  setEditingRecord({
                                    ...editingRecord,
                                    attendance_date: date,
                                  })
                                }
                              />
                            ) : (
                              record.attendance_date
                            )}
                          </td>

                          {/* Attendance */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <Select
                                value={
                                  editingRecord.status
                                }
                                onValueChange={(status) =>
                                  setEditingRecord({
                                    ...editingRecord,
                                    status:
                                      status as AttendanceStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className={`${controlClass} w-full max-w-[130px]`}
                                >
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem
                                    value="present"
                                    className="font-medium text-success"
                                  >
                                    Present
                                  </SelectItem>

                                  <SelectItem
                                    value="absent"
                                    className="font-medium text-destructive"
                                  >
                                    Absent
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <span
                                className={
                                  record.status === "present"
                                    ? "font-semibold text-success"
                                    : "font-semibold text-destructive"
                                }
                              >
                                {record.status}
                              </span>
                            )}
                          </td>

                          {/* Type */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              editingRecord.status ===
                              "absent" ? (
                                <Select
                                  value={
                                    editingRecord.absence_type ??
                                    "excused"
                                  }
                                  onValueChange={(
                                    absence_type,
                                  ) =>
                                    setEditingRecord({
                                      ...editingRecord,
                                      absence_type:
                                        absence_type as AbsenceType,
                                    })
                                  }
                                >
                                  <SelectTrigger
                                    className={`${controlClass} w-full max-w-[190px]`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectItem
                                      value="excused"
                                      className="font-medium text-info"
                                    >
                                      Excused absence
                                    </SelectItem>

                                    <SelectItem
                                      value="unexcused"
                                      className="font-medium text-warning"
                                    >
                                      Unexcused absence
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className="font-medium text-muted-foreground">
                                  —
                                </span>
                              )
                            ) : (
                              <span
                                className={`font-medium ${
                                  record.absence_type ===
                                  "excused"
                                    ? "text-info"
                                    : record.absence_type ===
                                        "unexcused"
                                      ? "text-warning"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {record.status === "absent"
                                  ? record.absence_type
                                  : "—"}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={saveEdit}
                                    disabled={
                                      updateMutation.isPending
                                    }
                                    className="h-8 rounded-[10px] bg-primary px-4 text-[12px] font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                                  >
                                    <Save className="mr-1 h-3.5 w-3.5" />
                                    Save
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setEditingId(null)
                                    }
                                    className="h-8 rounded-[10px] px-3 text-[12px] font-medium text-muted-foreground hover:text-foreground"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      beginEdit(record)
                                    }
                                    className="h-8 w-8 rounded-[10px] border-border/60 text-primary transition-colors hover:bg-primary/10"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      setDeleteTarget(record)
                                    }
                                    className="h-8 w-8 rounded-[10px] border-destructive/20 text-destructive transition-colors hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}

              {!isLoading && records.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground"
                  >
                    No absence records found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/10 px-6 py-4">
            <p className="text-[11.5px] font-medium text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1 || isLoading}
                className="h-8 rounded-[10px] border-border/60 text-[11.5px] font-semibold text-foreground"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={
                  page >= totalPages || isLoading
                }
                className="h-8 rounded-[10px] border-border/60 text-[11.5px] font-semibold text-foreground"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          DELETE CONFIRMATION
      ========================================================= */}
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) =>
          !open && setDeleteTarget(null)
        }
        title="Delete record & Mark Present"
        description="This will remove the absence record and automatically mark the student as present for this date."
        itemName={deleteTarget?.attendance_date}
        onConfirm={confirmDelete}
      />
    </section>
  );
}