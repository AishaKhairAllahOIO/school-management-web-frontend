import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Pencil,
  Plus,
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
import type { AttendanceStatus, AbsenceType, AttendanceRecord } from "../types/attendance.types";

const controlClass =
  "h-9 rounded-[12px] border-border/60 bg-background/80 text-[12px] shadow-none outline-none focus:ring-1 focus:ring-violet-500/30 transition-all";

const emptyDraft = {
  date: "",
  status: "absent" as AttendanceStatus,
  absenceType: "excused" as AbsenceType,
};

export function StudentAttendanceHistoryPage() {
  const { studentId = "" } = useParams(); // هذا هو الـ enrollment_id للطالب
  const [page, setPage] = useState(1);

  // 🌟 استدعاء الهوك بـ enrollmentId والـ page الحالية
  const { data, isLoading } = useStudentAttendanceHistory(studentId, page);

  const studentInfo = data?.student_info;
  const summary = data?.attendance_summary;
  const paginatedRecords = data?.attendance_records;
  
  const records: AttendanceRecord[] = paginatedRecords?.data || [];
  const totalPages = paginatedRecords?.last_page || 1;

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRecord | null>(null);

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
        absence_type: draft.status === "present" ? null : draft.absenceType,
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="h-11 w-11 rounded-[14px] border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors">
            <Link to="/attendance/students" aria-label="Back to student attendance">
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-[18px] font-extrabold tracking-tight text-foreground">
              {studentInfo ? studentInfo.full_name : "Student History"}
            </h1>
            <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
              Enrollment ID: {studentId}
            </p>
          </div>
        </div>
      </div>

      {/* العدادات المستخرجة من الباك إند */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="flex items-center gap-3.5 rounded-[18px] border border-success/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-success/[0.10] text-success">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Allowed Days</span>
            <strong className="text-[20px] font-bold text-success leading-none">{summary?.allowed_absence_days || 0}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-[18px] border border-destructive/25 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-destructive/[0.10] text-destructive">
            <ShieldAlert className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Unexcused Absents</span>
            <strong className="text-[20px] font-bold text-destructive leading-none">{summary?.total_unexcused_absent || 0}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-[18px] border border-violet-200 bg-card px-4 py-3 shadow-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-violet-600/[0.10] text-violet-700">
            <Info className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Remaining Days</span>
            <strong className="text-[20px] font-bold text-violet-700 leading-none">{summary?.remaining_absence_days || 0}</strong>
          </div>
        </div>
      </div>

      {/* إضافة غياب جديد */}
      <div className="rounded-[22px] border border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-violet-600/10 text-violet-700 border border-violet-600/20">
            <Plus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-foreground">Add new absence</h2>
            <p className="text-[11.5px] text-muted-foreground font-medium">Record a specific date for this student.</p>
          </div>
        </div>

        <div className="grid gap-3 lg:items-end lg:grid-cols-[220px_180px_minmax(190px,1fr)_130px]">
          <DatePicker value={draft.date} onChange={(date) => setDraft((current) => ({ ...current, date }))} label="Date" />
          <Select value={draft.status} onValueChange={(status) => setDraft((current) => ({ ...current, status: status as AttendanceStatus }))}>
            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="present" className="text-emerald-600">Present</SelectItem>
              <SelectItem value="absent" className="text-rose-600">Absent</SelectItem>
            </SelectContent>
          </Select>

          {draft.status === "absent" ? (
            <Select value={draft.absenceType ?? "excused"} onValueChange={(absenceType) => setDraft((current) => ({ ...current, absenceType: absenceType as AbsenceType }))}>
              <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="excused" className="text-sky-600">Excused absence</SelectItem>
                <SelectItem value="unexcused" className="text-amber-600">Unexcused absence</SelectItem>
              </SelectContent>
            </Select>
          ) : <div />}

          <Button type="button" onClick={addRecord} disabled={!draft.date || createMutation.isPending} className="h-9 rounded-[12px] bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all">
            <Save className="h-4 w-4 mr-1.5" />
            {createMutation.isPending ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </div>

      {/* جدول السجل التاريخي */}
      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 bg-muted/20 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[15px] font-bold text-foreground">Attendance timeline</h2>
            <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
              {isLoading ? "Loading..." : `Showing ${records.length} records on this page`}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead className="bg-muted/40">
              <tr className="text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <th className="h-12 px-6 text-start">Date</th>
                <th className="h-12 px-6 text-start">Attendance</th>
                <th className="h-12 px-6 text-start">Type</th>
                <th className="h-12 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-t border-border/50"><td colSpan={4} className="px-6 py-4"><div className="h-10 animate-pulse rounded-[12px] bg-muted/50" /></td></tr>
                  ))
                : records.map((record: AttendanceRecord) => {
                const isEditing = editingId === record.id && editingRecord;
                return (
                  <tr key={record.id} className="border-t border-border/50 text-[13px] hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {isEditing ? (
                        <DatePicker value={editingRecord.attendance_date} onChange={(date) => setEditingRecord({ ...editingRecord, attendance_date: date })} />
                      ) : (
                        record.attendance_date
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Select value={editingRecord.status} onValueChange={(status) => setEditingRecord({ ...editingRecord, status: status as AttendanceStatus })}>
                          <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present" className="text-emerald-600">Present</SelectItem>
                            <SelectItem value="absent" className="text-rose-600">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={record.status === "present" ? "font-bold text-emerald-600" : "font-bold text-rose-600"}>
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        editingRecord.status === "absent" ? (
                          <Select value={editingRecord.absence_type ?? "excused"} onValueChange={(absence_type) => setEditingRecord({ ...editingRecord, absence_type: absence_type as AbsenceType })}>
                            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excused" className="text-sky-600">Excused absence</SelectItem>
                              <SelectItem value="unexcused" className="text-amber-600">Unexcused absence</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : <span className="text-muted-foreground font-medium">—</span>
                      ) : (
                        <span className={`font-medium ${record.absence_type === 'excused' ? 'text-sky-600' : record.absence_type === 'unexcused' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          {record.status === "absent" ? record.absence_type : "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <Button type="button" size="sm" onClick={saveEdit} disabled={updateMutation.isPending} className="h-8 rounded-[10px] px-4 bg-violet-600 text-white hover:bg-violet-700 font-semibold shadow-xs">
                              <Save className="h-3.5 w-3.5 mr-1" /> Save
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-8 rounded-[10px] px-3 font-medium text-muted-foreground hover:text-foreground">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button type="button" variant="outline" size="icon" onClick={() => beginEdit(record)} className="h-8 w-8 rounded-[10px] border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="outline" size="icon" onClick={() => setDeleteTarget(record)} className="h-8 w-8 rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/[0.07] transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && records.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-[13.5px] font-medium text-muted-foreground">No absence records found for this student.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* الباجينيشن */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-6 py-4 bg-muted/10">
            <p className="text-[12px] font-medium text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1 || isLoading} className="h-8 rounded-[10px] text-[12px] font-semibold text-slate-700">
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages || isLoading} className="h-8 rounded-[10px] text-[12px] font-semibold text-slate-700">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete record & Mark Present" description="This will remove the absence record and automatically mark the student as present for this date." itemName={deleteTarget?.attendance_date} onConfirm={confirmDelete} />
    </section>
  );
}