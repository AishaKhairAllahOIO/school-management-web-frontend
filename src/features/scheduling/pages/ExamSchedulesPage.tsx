import {
  CalendarDays,
  Clock3,
  Download,
  Edit3,
  FileText,
  MapPin,
  Plus,
  School,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";
import { useSubjects } from "@/features/academics/subjects/hooks/useSubjects";
import { ScheduleStatusBadge } from "@/features/scheduling/components/ScheduleStatusBadge";
import { examSchedules as initialExams } from "@/features/scheduling/data/scheduling.mock";
import { SchedulingLoadingState } from "@/features/scheduling/shared/components/SchedulingLoadingState";
import { exportScheduleWorkbook } from "@/features/scheduling/shared/utils/export-schedule-xlsx";
import type { ExamScheduleItem } from "@/features/scheduling/types/scheduling.types";

const emptyExam: Omit<ExamScheduleItem, "id"> = {
  gradeId: "",
  classroomId: "",
  subjectId: "",
  date: "",
  startTime: "09:00",
  duration: "90 min",
  room: "",
  status: "scheduled",
};

const formatStatus = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function ExamSchedulesPage() {
  const gradesQuery = useGrades();
  const classroomsQuery = useClassrooms();
  const subjectsQuery = useSubjects();

  const grades = gradesQuery.data ?? [];
  const classrooms = classroomsQuery.data ?? [];
  const subjects = subjectsQuery.data ?? [];

  const [items, setItems] = useState<ExamScheduleItem[]>(initialExams);
  const [gradeId, setGradeId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [editing, setEditing] = useState<ExamScheduleItem | null>(null);
  const [form, setForm] = useState<Omit<ExamScheduleItem, "id"> | null>(null);
  const [deleting, setDeleting] = useState<ExamScheduleItem | null>(null);

  useEffect(() => {
    if (!gradeId && grades[0]?.id) setGradeId(grades[0].id);
  }, [gradeId, grades]);

  const classroomOptions = useMemo(
    () => classrooms.filter((item) => item.gradeId === gradeId),
    [classrooms, gradeId],
  );

  useEffect(() => {
    if (
      classroomId &&
      !classroomOptions.some((item) => item.id === classroomId)
    ) {
      setClassroomId("");
    }
  }, [classroomId, classroomOptions]);

  const gradeMap = useMemo(
    () => new Map(grades.map((item) => [item.id, item])),
    [grades],
  );
  const classroomMap = useMemo(
    () => new Map(classrooms.map((item) => [item.id, item])),
    [classrooms],
  );
  const subjectMap = useMemo(
    () => new Map(subjects.map((item) => [item.id, item])),
    [subjects],
  );

  const exams = useMemo(
    () =>
      items.filter(
        (item) =>
          item.gradeId === gradeId &&
          (!classroomId || item.classroomId === classroomId),
      ),
    [items, gradeId, classroomId],
  );

  if (
    gradesQuery.isLoading ||
    classroomsQuery.isLoading ||
    subjectsQuery.isLoading
  ) {
    return <SchedulingLoadingState />;
  }

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyExam,
      gradeId,
      classroomId: classroomId || classroomOptions[0]?.id || "",
      subjectId: subjects[0]?.id || "",
    });
  }

  function openEdit(item: ExamScheduleItem) {
    setEditing(item);
    setForm({ ...item });
  }

  function save() {
    if (
      !form?.gradeId ||
      !form.classroomId ||
      !form.subjectId ||
      !form.date ||
      !form.room.trim()
    ) return;

    if (editing) {
      setItems((current) =>
        current.map((item) =>
          item.id === editing.id ? { ...editing, ...form } : item,
        ),
      );
    } else {
      setItems((current) => [
        ...current,
        { ...form, id: `exam-${Date.now()}` },
      ]);
    }

    setForm(null);
    setEditing(null);
  }

  function handleExport() {
    exportScheduleWorkbook({
      fileName: `${gradeMap.get(gradeId)?.name ?? "grade"}-exam-schedules`,
      sheetName: "Exam Schedules",
      rows: exams.map((exam) => ({
        Grade: gradeMap.get(exam.gradeId)?.name ?? "—",
        Classroom: classroomMap.get(exam.classroomId)?.name ?? "—",
        Subject: subjectMap.get(exam.subjectId)?.name ?? "—",
        Date: exam.date,
        "Start Time": exam.startTime,
        Duration: exam.duration,
        Room: exam.room,
        Status: exam.status,
      })),
    });
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 rounded-[22px] border border-border/45 bg-card p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {grades.map((grade) => (
            <button
              key={grade.id}
              type="button"
              onClick={() => setGradeId(grade.id)}
              className={[
                "h-9 rounded-full border px-4 text-[12px] font-medium transition",
                gradeId === grade.id
                  ? "border-primary/20 bg-primary/[0.08] text-primary"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/40",
              ].join(" ")}
            >
              {grade.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={classroomId}
            onChange={(event) => setClassroomId(event.target.value)}
            className="h-9 min-w-[150px] rounded-full border border-border/65 bg-background px-3 text-[12px] text-foreground outline-none"
          >
            <option value="">All classrooms</option>
            {classroomOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button onClick={handleExport} className="inline-flex h-9 items-center gap-2 rounded-full border border-border/65 px-4 text-[12px] font-medium text-foreground/75 hover:bg-muted/40">
            <Download size={14} /> Export
          </button>

          <button onClick={openCreate} disabled={!gradeId || classroomOptions.length === 0 || subjects.length === 0} className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
            <Plus size={14} /> Add Exam
          </button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam, index) => (
          <article key={exam.id} className={["rounded-[22px] border p-4", ["border-violet-200/60 bg-violet-50/60", "border-sky-200/60 bg-sky-50/60", "border-emerald-200/60 bg-emerald-50/60"][index % 3]].join(" ")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-medium text-foreground">{subjectMap.get(exam.subjectId)?.name ?? "Subject"}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{gradeMap.get(exam.gradeId)?.name ?? "Grade"} · {classroomMap.get(exam.classroomId)?.name ?? "Classroom"}</p>
              </div>
              <ScheduleStatusBadge status={exam.status} />
            </div>

            <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
              <Info icon={CalendarDays} text={exam.date} />
              <Info icon={Clock3} text={`${exam.startTime} · ${exam.duration}`} />
              <Info icon={School} text={classroomMap.get(exam.classroomId)?.name ?? "—"} />
              <Info icon={MapPin} text={exam.room} />
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-border/35 pt-3">
              <Action icon={Edit3} label="Edit" onClick={() => openEdit(exam)} />
              <Action icon={Trash2} label="Delete" destructive onClick={() => setDeleting(exam)} />
            </div>
          </article>
        ))}
      </section>

      {form ? (
        <Editor title={editing ? "Edit Exam" : "Add Exam"} onClose={() => setForm(null)} onSave={save}>
          <SelectField label="Grade" value={form.gradeId} onChange={(value) => setForm({ ...form, gradeId: value, classroomId: classrooms.find((item) => item.gradeId === value)?.id || "" })} options={grades.map((item) => ({ value: item.id, label: item.name }))} />
          <SelectField label="Classroom" value={form.classroomId} onChange={(value) => setForm({ ...form, classroomId: value })} options={classrooms.filter((item) => item.gradeId === form.gradeId).map((item) => ({ value: item.id, label: item.name }))} />
          <SelectField label="Subject" value={form.subjectId} onChange={(value) => setForm({ ...form, subjectId: value })} options={subjects.map((item) => ({ value: item.id, label: item.name }))} />
          <Input label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
          <Input label="Start Time" type="time" value={form.startTime} onChange={(value) => setForm({ ...form, startTime: value })} />
          <Input label="Duration" value={form.duration} onChange={(value) => setForm({ ...form, duration: value })} />
          <Input label="Room" value={form.room} onChange={(value) => setForm({ ...form, room: value })} />
          <SelectField label="Status" value={form.status} onChange={(value) => setForm({ ...form, status: value as ExamScheduleItem["status"] })} options={["scheduled", "completed", "cancelled"].map((value) => ({ value, label: formatStatus(value) }))} />
        </Editor>
      ) : null}

      {deleting ? (
        <ConfirmDelete title="Delete exam?" description={`${subjectMap.get(deleting.subjectId)?.name ?? "This exam"} on ${deleting.date} will be removed.`} onClose={() => setDeleting(null)} onConfirm={() => { setItems((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); }} />
      ) : null}
    </div>
  );
}

function Info({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return <div className="flex items-center gap-2 rounded-[12px] bg-card/65 px-2.5 py-2"><Icon size={13} /><span>{text}</span></div>;
}

function Action({ icon: Icon, label, onClick, destructive = false }: { icon: typeof Edit3; label: string; onClick: () => void; destructive?: boolean }) {
  return <button onClick={onClick} className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium ${destructive ? "border-rose-200 bg-rose-50 text-rose-600" : "border-border/60 bg-card text-foreground/70"}`}><Icon size={12} />{label}</button>;
}

export function Editor({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="w-full max-w-xl overflow-hidden rounded-[24px] border border-border/55 bg-card shadow-[0_28px_90px_rgba(15,10,40,0.22)]"><header className="flex items-center justify-between border-b border-border/45 px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-primary/[0.09] text-primary"><FileText size={17} /></span><h2 className="text-[16px] font-medium">{title}</h2></div><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-[11px] border border-border/60"><X size={15} /></button></header><div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div><footer className="flex justify-end gap-2 border-t border-border/45 px-5 py-4"><button onClick={onClose} className="h-9 rounded-full border border-border/65 px-4 text-[12px]">Cancel</button><button onClick={onSave} className="h-9 rounded-full bg-primary px-4 text-[12px] text-primary-foreground">Save</button></footer></div></div>;
}

export function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label><span className="mb-1.5 block text-[12px] font-medium text-foreground/80">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-[13px] border border-border/70 bg-background px-3.5 text-sm font-normal outline-none focus:border-primary/45 focus:ring-4 focus:ring-primary/10" /></label>;
}

export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label><span className="mb-1.5 block text-[12px] font-medium text-foreground/80">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-[13px] border border-border/70 bg-background px-3.5 text-sm font-normal outline-none focus:border-primary/45 focus:ring-4 focus:ring-primary/10">{options.length === 0 ? <option value="">No options available</option> : null}{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export function ConfirmDelete({ title, description, onClose, onConfirm }: { title: string; description: string; onClose: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]"><div className="w-full max-w-md rounded-[24px] border border-border/55 bg-card p-5"><span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-rose-50 text-rose-600"><Trash2 size={19} /></span><h2 className="mt-4 text-[16px] font-medium">{title}</h2><p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">{description}</p><div className="mt-5 flex justify-end gap-2 border-t border-border/45 pt-4"><button onClick={onClose} className="h-9 rounded-full border border-border/65 px-4 text-[12px]">Cancel</button><button onClick={onConfirm} className="h-9 rounded-full bg-destructive px-4 text-[12px] text-destructive-foreground">Delete</button></div></div></div>;
}
