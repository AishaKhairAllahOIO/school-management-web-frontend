import { X } from "lucide-react";
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
    value: CreateClassSchedulePayload[K]
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="schedule-dialog-card w-full max-w-2xl rounded-[28px] p-6 shadow-floating ring-1 ring-border/70">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === "create" ? "Add Class Schedule" : "Edit Class Schedule"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Assign classroom, subject, teacher, day and time slot.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Classroom">
              <select
                required
                className="field-input"
                value={form.classroomId}
                onChange={(e) => updateField("classroomId", e.target.value)}
              >
                <option value="">Select classroom</option>
                {classroomOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Subject">
              <select
                required
                className="field-input"
                value={form.subjectId}
                onChange={(e) => updateField("subjectId", e.target.value)}
              >
                <option value="">Select subject</option>
                {subjectOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Teacher">
              <select
                required
                className="field-input"
                value={form.teacherId}
                onChange={(e) => updateField("teacherId", e.target.value)}
              >
                <option value="">Select teacher</option>
                {teacherOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Day">
              <select
                className="field-input"
                value={form.day}
                onChange={(e) => updateField("day", e.target.value as WeekDay)}
              >
                {weekDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Time Slot">
              <select
                required
                className="field-input"
                value={form.timeSlotId}
                onChange={(e) => updateField("timeSlotId", e.target.value)}
              >
                <option value="">Select time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Room Number">
              <input
                className="field-input"
                placeholder="Optional"
                value={form.roomNumber ?? ""}
                onChange={(e) => updateField("roomNumber", e.target.value)}
              />
            </Field>

            <Field label="Status">
              <select
                className="field-input"
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as ScheduleStatus)
                }
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/70 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl bg-muted px-4 text-xs font-bold text-muted-foreground transition hover:bg-muted/80"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:opacity-60"
            >
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}