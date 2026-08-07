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

import {
  attendanceMock,
  studentAttendanceHistoryMock,
} from "../mocks/attendance.mock";
import type {
  AbsenceType,
  AttendanceStatus,
  StudentAttendanceHistoryRecord,
} from "../types/attendance.types";

const controlClass =
  "h-9 rounded-[11px] border-border/60 bg-background/80 text-[12px] shadow-none";

const emptyDraft: Omit<StudentAttendanceHistoryRecord, "id" | "studentId"> = {
  date: "",
  status: "Present",
};

export function StudentAttendanceHistoryPage() {
  const { studentId = "" } = useParams();
  const student = attendanceMock.find((item) => item.studentId === studentId);

  const [records, setRecords] = useState<StudentAttendanceHistoryRecord[]>(
    studentAttendanceHistoryMock[studentId] ?? [],
  );
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<StudentAttendanceHistoryRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentAttendanceHistoryRecord | null>(null);

  const totals = useMemo(() => {
    const present = records.filter((item) => item.status === "Present").length;
    const absent = records.filter((item) => item.status === "Absent").length;
    const excused = records.filter((item) => item.absenceType === "Excused").length;
    const unexcused = records.filter((item) => item.absenceType === "Unexcused").length;
    return { present, absent, excused, unexcused };
  }, [records]);

  function normalizeRecord<T extends typeof draft | StudentAttendanceHistoryRecord>(record: T): T {
    if (record.status === "Present") {
      return { ...record, absenceType: undefined };
    }

    return { ...record, absenceType: record.absenceType ?? "Excused" };
  }

  function addRecord() {
    if (!draft.date) return;

    const next = normalizeRecord({
      ...draft,
      id: `${studentId}-${Date.now()}`,
      studentId,
    });

    setRecords((current) => [next, ...current]);
    setDraft(emptyDraft);
  }

  function beginEdit(record: StudentAttendanceHistoryRecord) {
    setEditingId(record.id);
    setEditingRecord({ ...record });
  }

  function saveEdit() {
    if (!editingRecord) return;

    const normalized = normalizeRecord(editingRecord);
    setRecords((current) =>
      current.map((record) => (record.id === normalized.id ? normalized : record)),
    );
    setEditingId(null);
    setEditingRecord(null);
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
              {student?.studentName ?? "Student attendance history"}
            </h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {student ? `${student.gradeName} · Classroom ${student.classroomName}` : `Student ${studentId}`}
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

        <div
          className={[
            "grid gap-3 lg:items-end",
            draft.status === "Absent"
              ? "lg:grid-cols-[220px_180px_minmax(190px,1fr)_120px]"
              : "lg:grid-cols-[220px_180px_120px]",
          ].join(" ")}
        >
          <DatePicker
            value={draft.date}
            onChange={(date) => setDraft((current) => ({ ...current, date }))}
            label="Date"
          />

          <Select
            value={draft.status}
            onValueChange={(status) =>
              setDraft((current) => normalizeRecord({ ...current, status: status as AttendanceStatus }))
            }
          >
            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>

          {draft.status === "Absent" ? (
            <Select
              value={draft.absenceType ?? "Excused"}
              onValueChange={(absenceType) =>
                setDraft((current) => ({
                  ...current,
                  absenceType: absenceType as AbsenceType,
                }))
              }
            >
              <SelectTrigger className={controlClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excused">Excused absence</SelectItem>
                <SelectItem value="Unexcused">Unexcused absence</SelectItem>
              </SelectContent>
            </Select>
          ) : null}

          <Button type="button" onClick={addRecord} disabled={!draft.date} className="h-9 rounded-[11px]">
            <Save className="h-4 w-4" />
            Save
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
              {records.map((record) => {
                const isEditing = editingId === record.id && editingRecord;

                return (
                  <tr key={record.id} className="border-t border-border/45 text-[13px] hover:bg-muted/[0.20]">
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <DatePicker
                          value={editingRecord.date}
                          onChange={(date) => setEditingRecord({ ...editingRecord, date })}
                        />
                      ) : (
                        <span className="font-medium text-foreground">{record.date}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <Select
                          value={editingRecord.status}
                          onValueChange={(status) => setEditingRecord(normalizeRecord({ ...editingRecord, status: status as AttendanceStatus }))}
                        >
                          <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={record.status === "Present" ? "font-medium text-success" : "font-medium text-destructive"}>
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        editingRecord.status === "Absent" ? (
                          <Select
                            value={editingRecord.absenceType ?? "Excused"}
                            onValueChange={(absenceType) => setEditingRecord({ ...editingRecord, absenceType: absenceType as AbsenceType })}
                          >
                            <SelectTrigger className={controlClass}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excused">Excused absence</SelectItem>
                              <SelectItem value="Unexcused">Unexcused absence</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          {record.status === "Absent" ? record.absenceType : "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <Button type="button" size="sm" onClick={saveEdit} className="h-8 rounded-[10px] px-3">
                            <Save className="h-3.5 w-3.5" /> Save
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            onClick={() => beginEdit(record)}
                            className="rounded-[10px] border-info/20 text-info hover:bg-info/[0.08]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(record)}
                          className="rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/[0.07]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center text-[13px] text-muted-foreground">
                    No attendance history has been recorded for this student.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete attendance record"
        description="This attendance date will be removed from the student history."
        itemName={deleteTarget?.date}
        onConfirm={() => {
          if (!deleteTarget) return;
          setRecords((current) => current.filter((record) => record.id !== deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </section>
  );
}

type SummaryTone = "success" | "destructive" | "info" | "warning";

const summaryToneClasses: Record<SummaryTone, string> = {
  success: "bg-success/[0.10] text-success",
  destructive: "bg-destructive/[0.09] text-destructive",
  info: "bg-info/[0.10] text-info",
  warning: "bg-warning/[0.11] text-warning",
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  detail: string;
  tone: SummaryTone;
}) {
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
