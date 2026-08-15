import {
  CalendarDays,
  Clock,
  Edit3,
  Trash2,
  Users,
} from "lucide-react";

import type { AdminExam } from "../types/exam-schedule.types";

interface Props {
  exam: AdminExam;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExamCard({
  exam,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">

      {/* Exam header */}
      <div className="flex items-center justify-between border-b p-5">

        <div>
          <div className="flex items-center gap-3">

            <h2 className="text-lg font-semibold">
              {exam.title}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                exam.type === "exam"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {exam.type === "exam"
                ? "Exam"
                : "Quiz"}
            </span>

          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {exam.grade_level.name}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={onEdit}
            className="rounded-lg border p-2 hover:bg-muted"
            title="Edit"
          >
            <Edit3 size={17} />
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </div>

      {/* Subjects */}
      <div className="divide-y">

        {exam.subjects.map((subject) => (
          <div
            key={subject.exam_subject_id}
            className="p-5"
          >

            <div className="grid gap-4 md:grid-cols-4">

              {/* Subject */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Subject
                </p>

                <p className="mt-1 font-medium">
                  {subject.subject_name}
                </p>
              </div>

              {/* Date */}
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays size={14} />
                  Date
                </div>

                <p className="mt-1 font-medium">
                  {subject.exam_date}
                </p>
              </div>

              {/* Time */}
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  Time
                </div>

                <p className="mt-1 font-medium">
                  {subject.start_time}
                  {" - "}
                  {subject.end_time}
                </p>
              </div>

              {/* Teachers */}
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users size={14} />
                  Teachers
                </div>

                <div className="mt-1 space-y-1">

                  {subject.teachers.length > 0 ? (
                    subject.teachers.map(
                      (teacher) => (
                        <p
                          key={teacher.staff_id}
                          className="text-sm font-medium"
                        >
                          {teacher.teacher_name}
                        </p>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No teacher assigned
                    </p>
                  )}

                </div>
              </div>

            </div>

            {subject.syllabus && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3">

                <p className="text-xs font-medium text-muted-foreground">
                  Syllabus
                </p>

                <p className="mt-1 text-sm">
                  {subject.syllabus}
                </p>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}