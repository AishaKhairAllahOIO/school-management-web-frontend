import { CalendarDays, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  timeSlots,
  weekDays,
} from "@/features/scheduling/class-schedules/mocks/class-schedules.mock";
import type {
  ClassSchedule,
  CreateClassSchedulePayload,
  ScheduleStatus,
  WeekDay,
} from "@/features/scheduling/class-schedules/types/class-schedule.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  schedule?: ClassSchedule | null;
  classroomOptions: SelectOption[];
  subjectOptions: SelectOption[];
  teacherOptions: SelectOption[];
  academicYearId: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateClassSchedulePayload) => void;
};

const emptyForm: CreateClassSchedulePayload = {
  classroomId: "",
  subjectId: "",
  teacherId: "",
  day: "Sunday",
  timeSlotId: "",
  roomNumber: "",
  academicYearId: "",
  status: "upcoming",
};

const statusOptions: { label: string; value: ScheduleStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function ClassScheduleFormDialog({
  open,
  mode,
  schedule,
  classroomOptions,
  subjectOptions,
  teacherOptions,
  academicYearId,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateClassSchedulePayload>({
    ...emptyForm,
    academicYearId,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && schedule) {
      setForm({
        classroomId: schedule.classroomId,
        subjectId: schedule.subjectId,
        teacherId: schedule.teacherId,
        day: schedule.day,
        timeSlotId: schedule.timeSlotId,
        roomNumber: schedule.roomNumber ?? "",
        academicYearId: schedule.academicYearId,
        status: schedule.status,
      });
      return;
    }

    setForm({ ...emptyForm, academicYearId });
  }, [open, mode, schedule, academicYearId]);

  if (!open) return null;

  function updateField<K extends keyof CreateClassSchedulePayload>(
    key: K,
    value: CreateClassSchedulePayload[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...form,
      roomNumber: form.roomNumber || null,
    });
  }

  const canSubmit = Boolean(
    form.classroomId &&
      form.subjectId &&
      form.teacherId &&
      form.timeSlotId &&
      form.academicYearId,
  );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="w-full max-w-[660px] overflow-hidden rounded-[26px] border border-border/55 bg-card shadow-[0_28px_90px_rgba(15,10,40,0.22)]">
        <header className="flex items-start justify-between gap-4 border-b border-border/45 px-5 py-4.5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.09] text-primary">
              <CalendarDays size={18} strokeWidth={1.8} />
            </span>

            <div>
              <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-foreground">
                {mode === "create" ? "Add Class Schedule" : "Edit Class Schedule"}
              </h2>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                Assign a subject, teacher, classroom and time without changing the current API payload.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border border-border/60 bg-background text-muted-foreground transition hover:bg-muted/45 hover:text-foreground disabled:opacity-50"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Classroom">
              <ScheduleSelect
                value={form.classroomId}
                placeholder="Select classroom"
                options={classroomOptions}
                onChange={(value) => updateField("classroomId", value)}
              />
            </Field>

            <Field label="Subject">
              <ScheduleSelect
                value={form.subjectId}
                placeholder="Select subject"
                options={subjectOptions}
                onChange={(value) => updateField("subjectId", value)}
              />
            </Field>

            <Field label="Teacher">
              <ScheduleSelect
                value={form.teacherId}
                placeholder="Select teacher"
                options={teacherOptions}
                onChange={(value) => updateField("teacherId", value)}
              />
            </Field>

            <Field label="Day">
              <ScheduleSelect
                value={form.day}
                placeholder="Select day"
                options={weekDays.map((day) => ({ label: day, value: day }))}
                onChange={(value) => updateField("day", value as WeekDay)}
              />
            </Field>

            <Field label="Time Slot">
              <ScheduleSelect
                value={form.timeSlotId}
                placeholder="Select time slot"
                options={timeSlots.map((slot) => ({ label: slot.label, value: slot.id }))}
                onChange={(value) => updateField("timeSlotId", value)}
              />
            </Field>

            <Field label="Room Number">
              <input
                className="h-11 w-full rounded-[13px] border border-border/70 bg-background px-3.5 text-sm font-normal text-foreground outline-none transition placeholder:text-muted-foreground/75 hover:border-border focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
                placeholder="Optional"
                value={form.roomNumber ?? ""}
                onChange={(event) => updateField("roomNumber", event.target.value)}
              />
            </Field>

            <Field label="Status">
              <ScheduleSelect
                value={form.status}
                placeholder="Select status"
                options={statusOptions}
                onChange={(value) => updateField("status", value as ScheduleStatus)}
              />
            </Field>
          </div>

          <div className="mt-5 flex justify-end gap-2.5 border-t border-border/45 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45 hover:text-foreground disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} strokeWidth={1.8} />
              )}
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create Schedule"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium text-foreground/85">
        {label}
      </span>
      {children}
    </label>
  );
}

function ScheduleSelect({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-11 rounded-[13px] border-border/70 bg-background px-3.5 text-sm font-normal shadow-none focus:ring-4 focus:ring-primary/10">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-[14px] border-border/60 p-1.5 shadow-[0_18px_55px_rgba(24,16,55,0.16)]">
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value} className="rounded-[10px] text-sm font-normal">
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
