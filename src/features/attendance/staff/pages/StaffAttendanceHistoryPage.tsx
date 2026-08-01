import {
  ArrowLeft,
  BookOpenCheck,
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
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  staffAttendanceHistoryMock,
  staffAttendanceMock,
} from "../mocks/staffAttendance.mock";
import type {
  StaffAbsenceType,
  StaffAttendanceHistoryRecord,
  StaffAttendanceStatus,
} from "../types/staffAttendance.types";

const controlClass =
  "h-9 rounded-[11px] border-border/60 bg-background/80 text-[12px] shadow-none";

type HistoryDraft = Omit<StaffAttendanceHistoryRecord, "id" | "employeeId">;

function createEmptyDraft(isTeacher: boolean): HistoryDraft {
  return {
    date: "",
    status: "Present",
    ...(isTeacher
      ? {
          requiredPeriods: 1,
          attendedPeriods: 1,
        }
      : {}),
  };
}

export function StaffAttendanceHistoryPage() {
  const { employeeId = "" } = useParams();
  const employee = staffAttendanceMock.find(
    (item) => item.employeeId === employeeId,
  );
  const isTeacher = employee?.role === "Teacher";

  const [records, setRecords] = useState<StaffAttendanceHistoryRecord[]>(
    staffAttendanceHistoryMock[employeeId] ?? [],
  );
  const [draft, setDraft] = useState<HistoryDraft>(() =>
    createEmptyDraft(isTeacher),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] =
    useState<StaffAttendanceHistoryRecord | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<StaffAttendanceHistoryRecord | null>(null);

  const totals = useMemo(() => {
    const present = records.filter((item) => item.status === "Present").length;
    const absent = records.filter((item) => item.status === "Absent").length;
    const excused = records.filter(
      (item) => item.absenceType === "Excused",
    ).length;
    const unexcused = records.filter(
      (item) => item.absenceType === "Unexcused",
    ).length;
    const requiredPeriods = records.reduce(
      (total, item) => total + (item.requiredPeriods ?? 0),
      0,
    );
    const attendedPeriods = records.reduce(
      (total, item) => total + (item.attendedPeriods ?? 0),
      0,
    );

    return {
      present,
      absent,
      excused,
      unexcused,
      requiredPeriods,
      attendedPeriods,
    };
  }, [records]);

  function normalizeRecord<
    T extends HistoryDraft | StaffAttendanceHistoryRecord,
  >(record: T): T {
    const next = { ...record };

    if (isTeacher) {
      const requiredPeriods = Math.max(0, Number(next.requiredPeriods ?? 0));
      const attendedPeriods = Math.max(
        0,
        Math.min(Number(next.attendedPeriods ?? 0), requiredPeriods),
      );

      next.requiredPeriods = requiredPeriods;
      next.attendedPeriods = attendedPeriods;
      next.status = attendedPeriods > 0 ? "Present" : "Absent";
    }

    if (next.status === "Present") {
      next.absenceType = undefined;
    } else {
      next.absenceType = next.absenceType ?? "Excused";
      if (isTeacher) next.attendedPeriods = 0;
    }

    return next;
  }

  function addRecord() {
    if (!draft.date) return;

    const next = normalizeRecord({
      ...draft,
      id: `${employeeId}-${Date.now()}`,
      employeeId,
    });

    setRecords((current) => [next, ...current]);
    setDraft(createEmptyDraft(isTeacher));
  }

  function beginEdit(record: StaffAttendanceHistoryRecord) {
    setEditingId(record.id);
    setEditingRecord({ ...record });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingRecord(null);
  }

  function saveEdit() {
    if (!editingRecord) return;

    const normalized = normalizeRecord(editingRecord);
    setRecords((current) =>
      current.map((record) =>
        record.id === normalized.id ? normalized : record,
      ),
    );
    cancelEdit();
  }

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-[13px]"
          >
            <Link to="/attendance/staff" aria-label="Back to staff attendance">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>

          <div>
            <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
              {employee?.employeeName ?? "Staff attendance history"}
            </h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {employee
                ? `${employee.role} · ${employee.employeeId}`
                : `Employee ${employeeId}`}
            </p>
          </div>
        </div>
      </div>

      <div
        className={[
          "grid gap-3 sm:grid-cols-2",
          isTeacher ? "xl:grid-cols-5" : "xl:grid-cols-4",
        ].join(" ")}
      >
        <SummaryCard
          icon={CheckCircle2}
          label="Present"
          value={totals.present}
          detail="Recorded attendance days"
          tone="success"
        />
        <SummaryCard
          icon={CalendarDays}
          label="Total absences"
          value={totals.absent}
          detail={`${totals.excused} excused · ${totals.unexcused} unexcused`}
          tone="destructive"
        />
        <SummaryCard
          icon={CalendarDays}
          label="Excused absences"
          value={totals.excused}
          detail="With an accepted reason"
          tone="info"
        />
        <SummaryCard
          icon={CalendarDays}
          label="Unexcused absences"
          value={totals.unexcused}
          detail="Requires follow-up"
          tone="warning"
        />
        {isTeacher ? (
          <SummaryCard
            icon={BookOpenCheck}
            label="Teaching periods"
            value={totals.attendedPeriods}
            detail={`${totals.attendedPeriods} of ${totals.requiredPeriods} attended`}
            tone="primary"
          />
        ) : null}
      </div>

      <div className="rounded-[20px] border border-border/60 bg-card p-4 shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-info/[0.08] text-info">
            <Plus className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">
              Add attendance record
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {isTeacher
                ? "Choose the date and enter the teacher's required and attended periods."
                : "Choose a date and attendance status, then save."}
            </p>
          </div>
        </div>

        {isTeacher ? (
          <div className="grid gap-3 lg:grid-cols-[220px_170px_170px_minmax(190px,1fr)_120px] lg:items-end">
            <DatePicker
              value={draft.date}
              onChange={(date) => setDraft((current) => ({ ...current, date }))}
              label="Date"
            />

            <NumberField
              label="Required periods"
              value={draft.requiredPeriods ?? 0}
              min={0}
              onChange={(requiredPeriods) =>
                setDraft((current) =>
                  normalizeRecord({
                    ...current,
                    requiredPeriods,
                    attendedPeriods: Math.min(
                      current.attendedPeriods ?? 0,
                      requiredPeriods,
                    ),
                  }),
                )
              }
            />

            <NumberField
              label="Attended periods"
              value={draft.attendedPeriods ?? 0}
              min={0}
              max={draft.requiredPeriods ?? 0}
              onChange={(attendedPeriods) =>
                setDraft((current) =>
                  normalizeRecord({ ...current, attendedPeriods }),
                )
              }
            />

            {draft.status === "Absent" ? (
              <AbsenceTypeSelect
                value={draft.absenceType ?? "Excused"}
                onChange={(absenceType) =>
                  setDraft((current) => ({ ...current, absenceType }))
                }
              />
            ) : (
              <div className="flex h-9 items-center rounded-[11px] border border-info/15 bg-info/[0.05] px-3 text-[11px] text-info">
                {draft.attendedPeriods ?? 0} of {draft.requiredPeriods ?? 0} periods
              </div>
            )}

            <Button
              type="button"
              onClick={addRecord}
              disabled={!draft.date}
              className="h-9 rounded-[11px]"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        ) : (
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

            <AttendanceStatusSelect
              value={draft.status}
              onChange={(status) =>
                setDraft((current) =>
                  normalizeRecord({ ...current, status }),
                )
              }
            />

            {draft.status === "Absent" ? (
              <AbsenceTypeSelect
                value={draft.absenceType ?? "Excused"}
                onChange={(absenceType) =>
                  setDraft((current) => ({ ...current, absenceType }))
                }
              />
            ) : null}

            <Button
              type="button"
              onClick={addRecord}
              disabled={!draft.date}
              className="h-9 rounded-[11px]"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="border-b border-border/50 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-foreground">
            Attendance timeline
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {records.length} recorded dates
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            className={[
              "w-full table-fixed",
              isTeacher ? "min-w-[980px]" : "min-w-[760px]",
            ].join(" ")}
          >
            <colgroup>
              <col className="w-[18%]" />
              {isTeacher ? (
                <>
                  <col className="w-[16%]" />
                  <col className="w-[16%]" />
                </>
              ) : null}
              <col className="w-[20%]" />
              <col className={isTeacher ? "w-[25%]" : "w-[38%]"} />
              <col className="w-[21%]" />
            </colgroup>
            <thead className="bg-muted/[0.28]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.075em] text-muted-foreground">
                <th className="h-11 px-5 text-start">Date</th>
                {isTeacher ? (
                  <>
                    <th className="h-11 px-5 text-start">Required periods</th>
                    <th className="h-11 px-5 text-start">Attended periods</th>
                  </>
                ) : null}
                <th className="h-11 px-5 text-start">Attendance</th>
                <th className="h-11 px-5 text-start">Absence type</th>
                <th className="h-11 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const isEditing = editingId === record.id && editingRecord;

                return (
                  <tr
                    key={record.id}
                    className="border-t border-border/45 text-[13px] hover:bg-muted/[0.20]"
                  >
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <DatePicker
                          value={editingRecord.date}
                          onChange={(date) =>
                            setEditingRecord({ ...editingRecord, date })
                          }
                        />
                      ) : (
                        <span className="font-medium text-foreground">
                          {record.date}
                        </span>
                      )}
                    </td>

                    {isTeacher ? (
                      <>
                        <td className="px-5 py-3.5">
                          {isEditing ? (
                            <NumberField
                              value={editingRecord.requiredPeriods ?? 0}
                              min={0}
                              onChange={(requiredPeriods) =>
                                setEditingRecord(
                                  normalizeRecord({
                                    ...editingRecord,
                                    requiredPeriods,
                                    attendedPeriods: Math.min(
                                      editingRecord.attendedPeriods ?? 0,
                                      requiredPeriods,
                                    ),
                                  }),
                                )
                              }
                            />
                          ) : (
                            <span>{record.requiredPeriods ?? 0}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isEditing ? (
                            <NumberField
                              value={editingRecord.attendedPeriods ?? 0}
                              min={0}
                              max={editingRecord.requiredPeriods ?? 0}
                              onChange={(attendedPeriods) =>
                                setEditingRecord(
                                  normalizeRecord({
                                    ...editingRecord,
                                    attendedPeriods,
                                  }),
                                )
                              }
                            />
                          ) : (
                            <span className="font-medium text-info">
                              {record.attendedPeriods ?? 0}
                            </span>
                          )}
                        </td>
                      </>
                    ) : null}

                    <td className="px-5 py-3.5">
                      {isEditing && !isTeacher ? (
                        <AttendanceStatusSelect
                          value={editingRecord.status}
                          onChange={(status) =>
                            setEditingRecord(
                              normalizeRecord({ ...editingRecord, status }),
                            )
                          }
                        />
                      ) : (
                        <span
                          className={
                            record.status === "Present"
                              ? "font-medium text-success"
                              : "font-medium text-destructive"
                          }
                        >
                          {record.status}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      {isEditing && editingRecord.status === "Absent" ? (
                        <AbsenceTypeSelect
                          value={editingRecord.absenceType ?? "Excused"}
                          onChange={(absenceType) =>
                            setEditingRecord({ ...editingRecord, absenceType })
                          }
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          {record.status === "Absent"
                            ? record.absenceType
                            : isTeacher
                              ? `${record.attendedPeriods ?? 0} of ${record.requiredPeriods ?? 0} periods`
                              : "—"}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={saveEdit}
                              className="h-8 rounded-[10px] px-3"
                            >
                              <Save className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                              className="h-8 rounded-[10px] px-3 text-muted-foreground"
                            >
                              Cancel
                            </Button>
                          </>
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

                        {!isEditing ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(record)}
                            className="rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/[0.07]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={isTeacher ? 6 : 4}
                    className="px-5 py-14 text-center text-[13px] text-muted-foreground"
                  >
                    No attendance history has been recorded for this employee.
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
        description="This attendance date will be removed from the employee history."
        itemName={deleteTarget?.date}
        onConfirm={() => {
          if (!deleteTarget) return;
          setRecords((current) =>
            current.filter((record) => record.id !== deleteTarget.id),
          );
          setDeleteTarget(null);
        }}
      />
    </section>
  );
}

function AttendanceStatusSelect({
  value,
  onChange,
}: {
  value: StaffAttendanceStatus;
  onChange: (value: StaffAttendanceStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as StaffAttendanceStatus)}>
      <SelectTrigger className={controlClass}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Present">Present</SelectItem>
        <SelectItem value="Absent">Absent</SelectItem>
      </SelectContent>
    </Select>
  );
}

function AbsenceTypeSelect({
  value,
  onChange,
}: {
  value: StaffAbsenceType;
  onChange: (value: StaffAbsenceType) => void;
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as StaffAbsenceType)}>
      <SelectTrigger className={controlClass}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Excused">Excused absence</SelectItem>
        <SelectItem value="Unexcused">Unexcused absence</SelectItem>
      </SelectContent>
    </Select>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1 block text-[11px] font-medium text-muted-foreground">
          {label}
        </span>
      ) : null}
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          const safe = Number.isFinite(parsed) ? parsed : 0;
          const bounded = Math.max(
            min ?? Number.NEGATIVE_INFINITY,
            Math.min(safe, max ?? Number.POSITIVE_INFINITY),
          );
          onChange(bounded);
        }}
        className={controlClass}
      />
    </label>
  );
}

type SummaryTone =
  | "success"
  | "destructive"
  | "info"
  | "warning"
  | "primary";

const summaryToneClasses: Record<SummaryTone, string> = {
  success: "bg-success/[0.10] text-success",
  destructive: "bg-destructive/[0.09] text-destructive",
  info: "bg-info/[0.10] text-info",
  warning: "bg-warning/[0.11] text-warning",
  primary: "bg-primary/[0.09] text-primary",
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
      <span
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]",
          summaryToneClasses[tone],
        ].join(" ")}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <strong className="block text-[23px] font-semibold leading-none tracking-[-0.04em] text-foreground">
          {value}
        </strong>
        <span className="mt-1.5 block text-[12px] font-medium text-foreground">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
          {detail}
        </span>
      </div>
    </article>
  );
}
