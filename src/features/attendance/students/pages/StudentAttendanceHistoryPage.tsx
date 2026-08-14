import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { useCreateAttendance } from "../hooks/useCreateAttendance";
import { useUpdateAttendance } from "../hooks/useUpdateAttendance";
import { useDeleteAttendance } from "../hooks/useDeleteAttendance";
import type { AttendanceStatus, AbsenceType, AttendanceRecord } from "../types/attendance.types";

const controlClass =
  "h-9 rounded-[11px] border-border/60 bg-background/80 text-[12px] shadow-none";

const emptyDraft = {
  date: "",
  status: "present" as AttendanceStatus,
  absenceType: null as AbsenceType,
};

export function StudentAttendanceHistoryPage() {
  const { studentId = "" } = useParams();


  const { data, isLoading } = useStudentAttendanceHistory(studentId);
  const records = Array.isArray(data) ? data : [];

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRecord | null>(null);

  const createMutation = useCreateAttendance();
  const updateMutation = useUpdateAttendance();
  const deleteMutation = useDeleteAttendance();

  const totals = useMemo(() => {
    const present = records.filter((item: AttendanceRecord) => item.status === "present").length;
    const absent = records.filter((item: AttendanceRecord) => item.status === "absent").length;
    const excused = records.filter((item: AttendanceRecord) => item.absence_type === "excused").length;
    const unexcused = records.filter((item: AttendanceRecord) => item.absence_type === "unexcused").length;
    return { present, absent, excused, unexcused };
  }, [records]);

  async function addRecord() {
    if (!draft.date) return;

    try {
      await createMutation.mutateAsync({
        enrollment_id: Number(studentId),
        attendance_date: draft.date,
        status: draft.status,
        absence_type: draft.status === "present" ? null : (draft.absenceType ?? "excused"),
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
    if (!editingRecord) return;

    try {
      await updateMutation.mutateAsync({
        id: editingRecord.id,
        payload: {
          attendance_date: editingRecord.attendance_date,
          status: editingRecord.status,
          absence_type: editingRecord.status === "present" ? null : (editingRecord.absence_type ?? "excused"),
        },
      });
      setEditingId(null);
      setEditingRecord(null);
    } catch (error) {
      console.error("Failed to update record", error);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading history...</div>;
  }

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-[13px]">
            <Link to="/attendance/students" aria-label="Back to student attendance">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
              Student Attendance History
            </h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Enrollment ID: {studentId}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={CheckCircle2} label="Present" value={totals.present} detail="Recorded attendance days" tone="success" />
        <SummaryCard icon={CalendarDays} label="Total absences" value={totals.absent} detail={`${totals.excused} excused · ${totals.unexcused} unexcused`} tone="destructive" />
        <SummaryCard icon={CalendarDays} label="Excused absences" value={totals.excused} detail="With an accepted reason" tone="info" />
        <SummaryCard icon={CalendarDays} label="Unexcused absences" value={totals.unexcused} detail="Requires follow-up" tone="warning" />
      </div>

      <div className="rounded-[20px] border border-border/60 bg-card p-4 shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary">
            <Plus className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Add attendance record</h2>
            <p className="text-[11px] text-muted-foreground">Choose a date and attendance details, then save.</p>
          </div>
        </div>

        <div className="grid gap-3 lg:items-end lg:grid-cols-[220px_180px_minmax(190px,1fr)_120px]">
          <DatePicker
            value={draft.date}
            onChange={(date) => setDraft((current) => ({ ...current, date }))}
            label="Date"
          />
          <Select
            value={draft.status}
            onValueChange={(status) => setDraft((current) => ({ ...current, status: status as AttendanceStatus }))}
          >
            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>

          {draft.status === "absent" ? (
            <Select
              value={draft.absenceType ?? "excused"}
              onValueChange={(absenceType) => setDraft((current) => ({ ...current, absenceType: absenceType as AbsenceType }))}
            >
              <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="excused">Excused absence</SelectItem>
                <SelectItem value="unexcused">Unexcused absence</SelectItem>
              </SelectContent>
            </Select>
          ) : <div />}

          <Button type="button" onClick={addRecord} disabled={!draft.date || createMutation.isPending} className="h-9 rounded-[11px]">
            <Save className="h-4 w-4" />
            {createMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="border-b border-border/50 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-foreground">Attendance timeline</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{records.length} recorded dates</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed">
            <colgroup>
              <col className="w-[21%]" />
              <col className="w-[22%]" />
              <col className="w-[35%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead className="bg-muted/[0.28]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.075em] text-muted-foreground">
                <th className="h-11 px-5 text-start">Date</th>
                <th className="h-11 px-5 text-start">Attendance</th>
                <th className="h-11 px-5 text-start">Type</th>
                <th className="h-11 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: AttendanceRecord) => {
                const isEditing = editingId === record.id && editingRecord;
                return (
                  <tr key={record.id} className="border-t border-border/45 text-[13px] hover:bg-muted/[0.20]">
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <DatePicker
                          value={editingRecord.attendance_date}
                          onChange={(date) => setEditingRecord({ ...editingRecord, attendance_date: date })}
                        />
                      ) : (
                        <span className="font-medium text-foreground">{record.attendance_date}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <Select
                          value={editingRecord.status}
                          onValueChange={(status) => setEditingRecord({ ...editingRecord, status: status as AttendanceStatus })}
                        >
                          <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={record.status === "present" ? "font-medium text-success" : "font-medium text-destructive"}>
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        editingRecord.status === "absent" ? (
                          <Select
                            value={editingRecord.absence_type ?? "excused"}
                            onValueChange={(absence_type) => setEditingRecord({ ...editingRecord, absence_type: absence_type as AbsenceType })}
                          >
                            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excused">Excused absence</SelectItem>
                              <SelectItem value="unexcused">Unexcused absence</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-muted-foreground">{record.status === "absent" ? record.absence_type : "—"}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <Button type="button" size="sm" onClick={saveEdit} disabled={updateMutation.isPending} className="h-8 rounded-[10px] px-3">
                              <Save className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-8 rounded-[10px] px-3 text-muted-foreground">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button type="button" variant="outline" size="icon-sm" onClick={() => beginEdit(record)} className="rounded-[10px] border-info/20 text-info hover:bg-info/[0.08]">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="outline" size="icon-sm" onClick={() => setDeleteTarget(record)} className="rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/[0.07]">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-14 text-center text-muted-foreground">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete attendance record"
        description="This will be removed."
        itemName={deleteTarget?.attendance_date}
        onConfirm={confirmDelete}
      />
    </section>
  );
}


type SummaryTone = "success" | "destructive" | "info" | "warning";
const summaryToneClasses: Record<SummaryTone, string> = { success: "bg-success/[0.10] text-success", destructive: "bg-destructive/[0.09] text-destructive", info: "bg-info/[0.10] text-info", warning: "bg-warning/[0.11] text-warning" };

function SummaryCard({ icon: Icon, label, value, detail, tone }: { icon: LucideIcon | React.ElementType; label: string; value: number; detail: string; tone: SummaryTone; }) {
  return (
    <article className="flex min-h-[102px] items-center gap-3 rounded-[18px] border border-border/60 bg-card p-4 shadow-[0_7px_24px_rgba(30,20,70,0.035)]">
      <span className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]", summaryToneClasses[tone]].join(" ")}><Icon className="h-[18px] w-[18px]" strokeWidth={1.8} /></span>
      <div className="min-w-0">
        <strong className="block text-[23px] font-semibold leading-none tracking-[-0.04em] text-foreground">{value}</strong>
        <span className="mt-1.5 block text-[12px] font-medium text-foreground">{label}</span>
        <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{detail}</span>
      </div>
    </article>
  );
}