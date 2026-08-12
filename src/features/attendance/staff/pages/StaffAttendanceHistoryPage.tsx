import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Trash2,
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

// 👈 استيراد الـ Hooks الحقيقية التي برمجناها
import { useStaffAttendanceHistory } from "../hooks/useStaffAttendanceHistory";
import { useCreateStaffAttendance } from "../hooks/useCreateStaffAttendance";
import { useUpdateStaffAttendance } from "../hooks/useUpdateStaffAttendance";
import { useDeleteStaffAttendance } from "../hooks/useDeleteStaffAttendance";

import type {
  StaffAbsenceType,
  StaffAttendanceStatus,
  StaffAttendanceRecord,
} from "../types/staffAttendance.types";

const controlClass =
  "h-9 rounded-[11px] border-border/60 bg-background/80 text-[12px] shadow-none";

export function StaffAttendanceHistoryPage() {
  const { employeeId = "" } = useParams();

  // ✅ جلب البيانات الحقيقية من السيرفر
  const { data: records = [], isLoading } = useStaffAttendanceHistory(employeeId);
  
  // ✅ استدعاء عمليات التعديل والحذف والإضافة
  const createMutation = useCreateStaffAttendance();
  const updateMutation = useUpdateStaffAttendance();
  const deleteMutation = useDeleteStaffAttendance();

  const [draft, setDraft] = useState({
    date: "",
    status: "present" as StaffAttendanceStatus,
    absence_type: null as StaffAbsenceType | null,
  });

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingRecord, setEditingRecord] = useState<StaffAttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffAttendanceRecord | null>(null);

  // حساب الإحصائيات من البيانات الحقيقية
  const totals = useMemo(() => {
    const present = records.filter((item: StaffAttendanceRecord) => item.status === "present").length;
    const absent = records.filter((item: StaffAttendanceRecord) => item.status === "absent" || item.status === "partial_absence").length;
    const excused = records.filter((item: StaffAttendanceRecord) => item.absence_type === "excused").length;
    const unexcused = records.filter((item: StaffAttendanceRecord) => item.absence_type === "unexcused").length;

    return { present, absent, excused, unexcused };
  }, [records]);

  // إضافة سجل جديد
  async function addRecord() {
    if (!draft.date) return;
    try {
      await createMutation.mutateAsync({
        staff_id: Number(employeeId),
        attendance_date: draft.date,
        status: draft.status,
        absence_type: draft.status === "present" ? null : (draft.absence_type ?? "excused"),
        missing_periods: [],
      });
      setDraft({ date: "", status: "present", absence_type: null });
    } catch (error) {
      console.error("Failed to add record", error);
    }
  }

  // حفظ التعديل
 async function saveEdit() {
    if (!editingRecord) return;
    try {
      await updateMutation.mutateAsync({
        id: editingRecord.id,
        payload: {
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

  // 👇 إضافة دالة الإلغاء هنا
  function cancelEdit() {
    setEditingId(null);
    setEditingRecord(null);
  }

  // حذف سجل
 async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading attendance history...</div>;
  }

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-[13px]">
            <Link to="/attendance/staff" aria-label="Back to staff attendance">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>

          <div>
            <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
              Staff #{employeeId} Attendance History
            </h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Employee ID: {employeeId}
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
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-info/[0.08] text-info">
            <Plus className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Add attendance record</h2>
            <p className="text-[11px] text-muted-foreground">Choose a date and attendance status, then save.</p>
          </div>
        </div>

        <div className="grid gap-3 lg:items-end lg:grid-cols-[220px_180px_minmax(190px,1fr)_120px]">
          <DatePicker
            value={draft.date}
            onChange={(date) => setDraft((current) => ({ ...current, date }))}
            label="Date"
          />

          <Select value={draft.status} onValueChange={(status: StaffAttendanceStatus) => setDraft({ ...draft, status })}>
            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="partial_absence">Partial Absence</SelectItem>
            </SelectContent>
          </Select>

          {draft.status !== "present" ? (
            <Select value={draft.absence_type ?? "excused"} onValueChange={(absence_type: StaffAbsenceType) => setDraft({ ...draft, absence_type })}>
              <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="excused">Excused absence</SelectItem>
                <SelectItem value="unexcused">Unexcused absence</SelectItem>
              </SelectContent>
            </Select>
          ) : <div />}

          <Button type="button" onClick={addRecord} disabled={!draft.date || createMutation.isPending} className="h-9 rounded-[11px]">
            <Save className="h-4 w-4 me-1" />
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
          <table className="w-full table-fixed min-w-[760px]">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[30%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-muted/[0.28]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.075em] text-muted-foreground">
                <th className="h-11 px-5 text-start">Date</th>
                <th className="h-11 px-5 text-start">Attendance</th>
                <th className="h-11 px-5 text-start">Absence type</th>
                <th className="h-11 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: StaffAttendanceRecord) => {
                const isEditing = editingId === record.id && editingRecord;

                return (
                  <tr key={record.id} className="border-t border-border/45 text-[13px] hover:bg-muted/[0.20]">
                    <td className="px-5 py-3.5 font-medium text-foreground">{record.attendance_date}</td>

                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <Select
                          value={editingRecord.status}
                          onValueChange={(status: StaffAttendanceStatus) => setEditingRecord({ ...editingRecord, status })}
                        >
                          <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="partial_absence">Partial Absence</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={record.status === "present" ? "font-medium text-success" : "font-medium text-destructive"}>
                          {record.status}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      {isEditing && editingRecord.status !== "present" ? (
                        <Select
                          value={editingRecord.absence_type ?? "excused"}
                          onValueChange={(absence_type: StaffAbsenceType) => setEditingRecord({ ...editingRecord, absence_type })}
                        >
                          <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excused">Excused absence</SelectItem>
                            <SelectItem value="unexcused">Unexcused absence</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground">
                          {record.status !== "present" ? record.absence_type : "—"}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <Button type="button" size="sm" onClick={saveEdit} disabled={updateMutation.isPending} className="h-8 rounded-[10px] px-3">
                              <Save className="h-3.5 w-3.5 me-1" /> Save
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} className="h-8 rounded-[10px] px-3 text-muted-foreground">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button type="button" variant="outline" size="icon" onClick={() => { setEditingId(record.id); setEditingRecord({ ...record }); }} className="rounded-[10px] border-info/20 text-info hover:bg-info/[0.08]">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {!isEditing && (
                          <Button type="button" variant="outline" size="icon" onClick={() => setDeleteTarget(record)} className="rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/[0.07]">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center text-[13px] text-muted-foreground">
                    No attendance history has been recorded for this employee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete attendance record"
        description="This attendance date will be removed from the employee history."
        itemName={deleteTarget?.attendance_date}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}

// مكون الـ Card الخاص بالاحصائيات
type SummaryTone = "success" | "destructive" | "info" | "warning" | "primary";
const summaryToneClasses: Record<SummaryTone, string> = {
  success: "bg-success/[0.10] text-success",
  destructive: "bg-destructive/[0.09] text-destructive",
  info: "bg-info/[0.10] text-info",
  warning: "bg-warning/[0.11] text-warning",
  primary: "bg-primary/[0.09] text-primary",
};

function SummaryCard({ icon: Icon, label, value, detail, tone }: { icon: typeof CheckCircle2; label: string; value: number; detail: string; tone: SummaryTone }) {
  return (
    <article className="flex min-h-[102px] items-center gap-3 rounded-[18px] border border-border/60 bg-card p-4 shadow-[0_7px_24px_rgba(30,20,70,0.035)]">
      <span className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]", summaryToneClasses[tone]].join(" ")}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <strong className="block text-[23px] font-semibold leading-none tracking-[-0.04em] text-foreground">{value}</strong>
        <span className="mt-1.5 block text-[12px] font-medium text-foreground">{label}</span>
        <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{detail}</span>
      </div>
    </article>
  );
}