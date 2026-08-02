import {
  CalendarDays,
  Download,
  Edit3,
  Plus,
  School,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";
import { useSubjects } from "@/features/academics/subjects/hooks/useSubjects";
import { ScheduleStatusBadge } from "@/features/scheduling/components/ScheduleStatusBadge";
import { quizSchedules as initialItems } from "@/features/scheduling/data/scheduling.mock";
import { SchedulingLoadingState } from "@/features/scheduling/shared/components/SchedulingLoadingState";
import { exportScheduleWorkbook } from "@/features/scheduling/shared/utils/export-schedule-xlsx";
import type { QuizScheduleItem } from "@/features/scheduling/types/scheduling.types";
import { ConfirmDelete, Editor, Input, SelectField } from "./ExamSchedulesPage";

const formatStatus = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function QuizSchedulesPage() {
  const gradesQuery = useGrades();
  const classroomsQuery = useClassrooms();
  const subjectsQuery = useSubjects();

  const grades = gradesQuery.data ?? [];
  const classrooms = classroomsQuery.data ?? [];
  const subjects = subjectsQuery.data ?? [];

  const [items, setItems] = useState<QuizScheduleItem[]>(initialItems);
  const [gradeId, setGradeId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [editing, setEditing] = useState<QuizScheduleItem | null>(null);
  const [form, setForm] = useState<Omit<QuizScheduleItem, "id"> | null>(null);
  const [deleting, setDeleting] = useState<QuizScheduleItem | null>(null);

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

  const visible = useMemo(
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
      gradeId,
      classroomId: classroomId || classroomOptions[0]?.id || "",
      subjectId: subjects[0]?.id || "",
      date: "",
      lesson: "",
      status: "scheduled",
    });
  }

  function save() {
    if (
      !form?.gradeId ||
      !form.classroomId ||
      !form.subjectId ||
      !form.date ||
      !form.lesson.trim()
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
        { ...form, id: `quiz-${Date.now()}` },
      ]);
    }

    setForm(null);
    setEditing(null);
  }

  function exportRows() {
    exportScheduleWorkbook({
      fileName: `${gradeMap.get(gradeId)?.name ?? "grade"}-quiz-schedules`,
      sheetName: "Quiz Schedules",
      rows: visible.map((item) => ({
        Grade: gradeMap.get(item.gradeId)?.name ?? "—",
        Classroom: classroomMap.get(item.classroomId)?.name ?? "—",
        Subject: subjectMap.get(item.subjectId)?.name ?? "—",
        Date: item.date,
        Lesson: item.lesson,
        Status: item.status,
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
          <select value={classroomId} onChange={(event) => setClassroomId(event.target.value)} className="h-9 min-w-[150px] rounded-full border border-border/65 bg-background px-3 text-[12px] text-foreground outline-none">
            <option value="">All classrooms</option>
            {classroomOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>

          <button onClick={exportRows} className="inline-flex h-9 items-center gap-2 rounded-full border border-border/65 px-4 text-[12px]"><Download size={14} />Export</button>
          <button onClick={openCreate} disabled={!gradeId || classroomOptions.length === 0 || subjects.length === 0} className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Plus size={14} />Add Quiz</button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((quiz, index) => (
          <article key={quiz.id} className={`rounded-[22px] border p-4 ${["border-rose-200/60 bg-rose-50/60", "border-sky-200/60 bg-sky-50/60", "border-amber-200/60 bg-amber-50/60"][index % 3]}`}>
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-[14px] font-medium">{subjectMap.get(quiz.subjectId)?.name ?? "Subject"}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{quiz.lesson}</p>
              </div>
              <ScheduleStatusBadge status={quiz.status} />
            </div>

            <div className="mt-4 space-y-2">
              <Info icon={CalendarDays} text={quiz.date} />
              <Info icon={School} text={`${gradeMap.get(quiz.gradeId)?.name ?? "Grade"} · ${classroomMap.get(quiz.classroomId)?.name ?? "Classroom"}`} />
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-border/35 pt-3">
              <button onClick={() => { setEditing(quiz); setForm({ ...quiz }); }} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 text-[11px]"><Edit3 size={12} />Edit</button>
              <button onClick={() => setDeleting(quiz)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 text-[11px] text-rose-600"><Trash2 size={12} />Delete</button>
            </div>
          </article>
        ))}
      </section>

      {form ? (
        <Editor title={editing ? "Edit Quiz" : "Add Quiz"} onClose={() => setForm(null)} onSave={save}>
          <SelectField label="Grade" value={form.gradeId} onChange={(value) => setForm({ ...form, gradeId: value, classroomId: classrooms.find((item) => item.gradeId === value)?.id || "" })} options={grades.map((item) => ({ value: item.id, label: item.name }))} />
          <SelectField label="Classroom" value={form.classroomId} onChange={(value) => setForm({ ...form, classroomId: value })} options={classrooms.filter((item) => item.gradeId === form.gradeId).map((item) => ({ value: item.id, label: item.name }))} />
          <SelectField label="Subject" value={form.subjectId} onChange={(value) => setForm({ ...form, subjectId: value })} options={subjects.map((item) => ({ value: item.id, label: item.name }))} />
          <Input label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
          <Input label="Lesson" value={form.lesson} onChange={(value) => setForm({ ...form, lesson: value })} />
          <SelectField label="Status" value={form.status} onChange={(value) => setForm({ ...form, status: value as QuizScheduleItem["status"] })} options={["scheduled", "completed", "cancelled"].map((value) => ({ value, label: formatStatus(value) }))} />
        </Editor>
      ) : null}

      {deleting ? (
        <ConfirmDelete title="Delete quiz?" description={`${subjectMap.get(deleting.subjectId)?.name ?? "This quiz"} will be removed.`} onClose={() => setDeleting(null)} onConfirm={() => { setItems((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); }} />
      ) : null}
    </div>
  );
}

function Info({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return <div className="flex items-center gap-2 rounded-[12px] bg-card/65 px-2.5 py-2 text-[11px] text-muted-foreground"><Icon size={13} /><span>{text}</span></div>;
}
