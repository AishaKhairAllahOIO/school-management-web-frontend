import {
  BookOpen,
  Clock3,
  Download,
  Edit3,
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { ClassScheduleFormDialog } from "@/features/scheduling/class-schedules/components/ClassScheduleFormDialog";
import {
  timeSlots,
  weekDays,
} from "@/features/scheduling/class-schedules/mocks/class-schedules.mock";
import type {
  ClassSchedule,
  CreateClassSchedulePayload,
} from "@/features/scheduling/class-schedules/types/class-schedule.types";
import {
  useClassSchedules,
  useCreateClassSchedule,
  useDeleteClassSchedule,
  useUpdateClassSchedule,
} from "@/features/scheduling/class-schedules/hooks/useClassSchedules";
import { useSchedulingCatalog } from "@/features/scheduling/catalog/hooks/useSchedulingCatalog";
import { SchedulingLoadingState } from "@/features/scheduling/shared/components/SchedulingLoadingState";
import { exportScheduleWorkbook } from "@/features/scheduling/shared/utils/export-schedule-xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const pastelByColor = {
  violet: "border-violet-200/70 bg-violet-50/75 text-violet-700",
  sky: "border-sky-200/70 bg-sky-50/75 text-sky-700",
  mint: "border-emerald-200/70 bg-emerald-50/75 text-emerald-700",
  peach: "border-amber-200/70 bg-amber-50/75 text-amber-700",
  rose: "border-rose-200/70 bg-rose-50/75 text-rose-700",
};

export function ClassSchedulesPage() {
  const catalogQuery = useSchedulingCatalog();
  const schedulesQuery = useClassSchedules();
  const createMutation = useCreateClassSchedule();
  const updateMutation = useUpdateClassSchedule();
  const deleteMutation = useDeleteClassSchedule();

  const catalog = catalogQuery.data;
  const schedules = schedulesQuery.data ?? [];

  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<ClassSchedule | null>(null);

  const activeGradeId = selectedGradeId || catalog?.grades[0]?.id || "";
  const classroomOptions = useMemo(
    () => catalog?.classrooms.filter((item) => item.gradeId === activeGradeId) ?? [],
    [catalog, activeGradeId],
  );
  const activeClassroomId =
    selectedClassroomId && classroomOptions.some((item) => item.id === selectedClassroomId)
      ? selectedClassroomId
      : classroomOptions[0]?.id || "";

  const visibleSchedules = schedules.filter(
    (schedule) => schedule.classroomId === activeClassroomId,
  );

  const subjectMap = new Map(catalog?.subjects.map((item) => [item.id, item]) ?? []);
  const teacherMap = new Map(catalog?.teachers.map((item) => [item.id, item]) ?? []);
  const classroomMap = new Map(catalog?.classrooms.map((item) => [item.id, item]) ?? []);
  const gradeMap = new Map(catalog?.grades.map((item) => [item.id, item]) ?? []);
  const slotMap = new Map(timeSlots.map((item) => [item.id, item]));

  if (catalogQuery.isLoading || schedulesQuery.isLoading) {
    return <SchedulingLoadingState />;
  }

  if (catalogQuery.isError || schedulesQuery.isError || !catalog) {
    return (
      <section className="rounded-[26px] border border-destructive/15 bg-card p-6 text-center">
        <p className="text-sm font-medium text-destructive">Scheduling data could not be loaded.</p>
        <button
          type="button"
          onClick={() => {
            void catalogQuery.refetch();
            void schedulesQuery.refetch();
          }}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground"
        >
          Try again
        </button>
      </section>
    );
  }

  const selectedClassroom = classroomMap.get(activeClassroomId);
  const totalAssigned = visibleSchedules.length;
  const uniqueTeachers = new Set(visibleSchedules.map((item) => item.teacherId)).size;
  const uniqueSubjects = new Set(visibleSchedules.map((item) => item.subjectId)).size;
  const completion = Math.round((totalAssigned / (weekDays.length * timeSlots.length)) * 100);

  function openCreateDialog() {
    setDialogMode("create");
    setEditingSchedule(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(schedule: ClassSchedule) {
    setDialogMode("edit");
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  }

  function handleSubmit(payload: CreateClassSchedulePayload) {
    if (dialogMode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
      return;
    }

    if (!editingSchedule) return;

    updateMutation.mutate(
      { scheduleId: editingSchedule.id, payload },
      { onSuccess: () => setIsDialogOpen(false) },
    );
  }

  function handleExport() {
    exportScheduleWorkbook({
      fileName: `${gradeMap.get(activeGradeId)?.name ?? "grade"}-${selectedClassroom?.name ?? "classroom"}-schedule`,
      sheetName: "Class Schedule",
      rows: visibleSchedules.map((schedule) => ({
        Grade: gradeMap.get(classroomMap.get(schedule.classroomId)?.gradeId ?? "")?.name ?? "",
        Classroom: classroomMap.get(schedule.classroomId)?.name ?? schedule.classroomId,
        Day: schedule.day,
        Time: slotMap.get(schedule.timeSlotId)?.label ?? schedule.timeSlotId,
        Subject: subjectMap.get(schedule.subjectId)?.name ?? schedule.subjectId,
        Teacher: teacherMap.get(schedule.teacherId)?.name ?? schedule.teacherId,
        Room: schedule.roomNumber ?? "",
        Status: schedule.status,
      })),
    });
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Assigned Lessons" value={totalAssigned} icon={BookOpen} className="border-violet-200/60 bg-violet-50/65 text-violet-700" />
        <MetricCard label="Active Teachers" value={uniqueTeachers} icon={Users} className="border-sky-200/60 bg-sky-50/65 text-sky-700" />
        <MetricCard label="Subjects Covered" value={uniqueSubjects} icon={GraduationCap} className="border-emerald-200/60 bg-emerald-50/65 text-emerald-700" />
        <MetricCard label="Schedule Coverage" value={`${completion}%`} icon={Clock3} className="border-amber-200/60 bg-amber-50/65 text-amber-700" />
      </section>

      <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-muted-foreground">Grade</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {catalog.grades.map((grade) => (
                <button
                  key={grade.id}
                  type="button"
                  onClick={() => {
                    setSelectedGradeId(grade.id);
                    setSelectedClassroomId("");
                  }}
                  className={[
                    "rounded-full border px-4 py-2 text-[13px] font-medium transition",
                    activeGradeId === grade.id
                      ? pastelByColor[grade.color]
                      : "border-border/60 bg-background text-muted-foreground hover:bg-muted/35 hover:text-foreground",
                  ].join(" ")}
                >
                  {grade.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[260px]">
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">Classroom</p>
            <Select value={activeClassroomId} onValueChange={setSelectedClassroomId}>
              <SelectTrigger className="h-11 rounded-[13px] border-border/70 bg-background px-3.5 text-sm font-normal">
                <SelectValue placeholder="Select classroom" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px] border-border/60 p-1.5">
                {classroomOptions.map((item) => (
                  <SelectItem key={item.id} value={item.id} className="rounded-[10px] font-normal">
                    {item.name} · Room {item.roomNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-medium text-foreground">
              {gradeMap.get(activeGradeId)?.name} · {selectedClassroom?.name}
            </h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Room {selectedClassroom?.roomNumber ?? "—"} · {selectedClassroom?.studentCount ?? 0} students
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleExport} className="inline-flex h-9 items-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45">
              <Download size={14}/>Export
            </button>
            <button type="button" onClick={openCreateDialog} className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground">
              <Plus size={14}/>Add Lesson
            </button>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-[20px] border border-border/55 lg:block">
          <div className="grid grid-cols-[110px_repeat(6,minmax(0,1fr))] bg-muted/[0.18]">
            <div className="border-r border-border/45 px-3 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Period</div>
            {weekDays.map((day, index) => <div key={day} className={`border-r border-border/45 px-3 py-3 text-center text-[12px] font-medium last:border-r-0 ${["bg-violet-50/55","bg-sky-50/55","bg-emerald-50/55","bg-amber-50/55","bg-rose-50/55","bg-fuchsia-50/45"][index]}`}>{day}</div>)}
          </div>
          {timeSlots.map((slot) => (
            <div key={slot.id} className="grid grid-cols-[110px_repeat(6,minmax(0,1fr))] border-t border-border/45">
              <div className="flex flex-col justify-center border-r border-border/45 bg-muted/[0.10] px-3 py-3"><span className="text-[12px] font-medium text-foreground">{slot.label}</span><span className="mt-1 text-[10px] text-muted-foreground">{slot.start} – {slot.end}</span></div>
              {weekDays.map((day) => {
                const schedule = visibleSchedules.find((item) => item.day === day && item.timeSlotId === slot.id);
                const subject = schedule ? subjectMap.get(schedule.subjectId) : undefined;
                const teacher = schedule ? teacherMap.get(schedule.teacherId) : undefined;
                return <div key={day} className="min-h-[112px] border-r border-border/45 p-2 last:border-r-0">
                  {schedule ? <article className={`group h-full rounded-[15px] border p-2.5 ${subject ? pastelByColor[subject.color] : "border-border/55 bg-muted/15"}`}>
                    <div className="flex items-start justify-between gap-1"><p className="truncate text-[11px] font-medium text-foreground">{subject?.name ?? "Subject"}</p><div className="flex gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100"><button onClick={()=>openEditDialog(schedule)} className="flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-primary"><Edit3 size={11}/></button><button onClick={()=>setDeletingSchedule(schedule)} className="flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-destructive"><Trash2 size={11}/></button></div></div>
                    <p className="mt-2 truncate text-[10px] text-foreground/75">{teacher?.name}</p><p className="mt-1 text-[10px] text-muted-foreground">Room {schedule.roomNumber ?? selectedClassroom?.roomNumber ?? "—"}</p>
                  </article> : <button onClick={openCreateDialog} className="flex h-full w-full flex-col items-center justify-center rounded-[15px] border border-dashed border-border/55 text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.025] hover:text-primary"><Plus size={14}/><span className="mt-1 text-[10px]">Add</span></button>}
                </div>;
              })}
            </div>
          ))}
        </div>

        <div className="space-y-3 lg:hidden">
          {weekDays.map((day, dayIndex) => <div key={day} className="rounded-[18px] border border-border/55 p-3"><div className={`rounded-[14px] px-3 py-2 text-[12px] font-medium ${["bg-violet-50 text-violet-700","bg-sky-50 text-sky-700","bg-emerald-50 text-emerald-700","bg-amber-50 text-amber-700","bg-rose-50 text-rose-700","bg-fuchsia-50 text-fuchsia-700"][dayIndex]}`}>{day}</div><div className="mt-2 grid gap-2 sm:grid-cols-2">{visibleSchedules.filter(i=>i.day===day).map(schedule=>{const subject=subjectMap.get(schedule.subjectId);const teacher=teacherMap.get(schedule.teacherId);return <article key={schedule.id} className={`rounded-[15px] border p-3 ${subject?pastelByColor[subject.color]:"border-border/55"}`}><div className="flex justify-between"><p className="text-[11px] font-medium">{subject?.name}</p><div className="flex gap-1"><button onClick={()=>openEditDialog(schedule)}><Edit3 size={12}/></button><button onClick={()=>setDeletingSchedule(schedule)} className="text-destructive"><Trash2 size={12}/></button></div></div><p className="mt-1 text-[10px] text-muted-foreground">{slotMap.get(schedule.timeSlotId)?.label}</p><p className="mt-2 text-[10px]">{teacher?.name}</p></article>})}</div></div>)}
        </div>
      </section>

      <ClassScheduleFormDialog
        open={isDialogOpen}
        mode={dialogMode}
        schedule={editingSchedule}
        classroomOptions={catalog.classrooms.map((item) => ({
          value: item.id,
          label: `${gradeMap.get(item.gradeId)?.name ?? "Grade"} · ${item.name}`,
        }))}
        subjectOptions={catalog.subjects.map((item) => ({ value: item.id, label: item.name }))}
        teacherOptions={catalog.teachers.map((item) => ({ value: item.id, label: item.name }))}
        academicYearId={catalog.academicYearId}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteScheduleDialog
        schedule={deletingSchedule}
        subjectName={deletingSchedule ? subjectMap.get(deletingSchedule.subjectId)?.name : undefined}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingSchedule(null)}
        onConfirm={() => {
          if (!deletingSchedule) return;
          deleteMutation.mutate(deletingSchedule.id, {
            onSuccess: () => setDeletingSchedule(null),
          });
        }}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon: typeof BookOpen;
  className: string;
}) {
  return (
    <article className={`rounded-[22px] border p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium opacity-75">{label}</p>
          <p className="mt-2 text-[23px] font-semibold tracking-[-0.03em]">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-card/75">
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>
    </article>
  );
}

function DeleteScheduleDialog({
  schedule,
  subjectName,
  isPending,
  onClose,
  onConfirm,
}: {
  schedule: ClassSchedule | null;
  subjectName?: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!schedule) return null;

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-[24px] border border-border/55 bg-card p-5 shadow-[0_28px_90px_rgba(15,10,40,0.22)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-destructive/[0.08] text-destructive">
          <Trash2 size={19} />
        </span>
        <h2 className="mt-4 text-[16px] font-semibold text-foreground">Delete this lesson?</h2>
        <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">
          {subjectName ?? "This lesson"} on {schedule.day} will be removed from the classroom schedule.
        </p>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-border/45 pt-4">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-9 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 disabled:opacity-50"
          >
            Keep lesson
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-destructive px-4 text-[12px] font-medium text-destructive-foreground disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
