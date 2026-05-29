import { BookOpen } from "lucide-react";
import { useState } from "react";

import { GradeTabs } from "@/features/scheduling/components/GradeTabs";
import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
import { ScheduleStatusBadge } from "@/features/scheduling/components/ScheduleStatusBadge";
import { quizSchedules } from "@/features/scheduling/data/scheduling.mock";
import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

function formatSubject(subject: string) {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

export function QuizSchedulesPage() {
  const [grade, setGrade] = useState<SchoolGrade>("seventh");

  const quizzes = quizSchedules.filter((quiz) => quiz.grade === grade);

  return (
    <section className="soft-card rounded-3xl p-6">
      <SchedulePageHeader
        title="Quiz Schedules"
        description="Manage quiz and short-test schedules by grade"
        icon={BookOpen}
      />

      <GradeTabs value={grade} onChange={setGrade} />

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full min-w-[840px]">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-5 py-4">Subject</th>
              <th>Date</th>
              <th>Lesson</th>
              <th>Teacher</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border-t border-border/60">
                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                  {formatSubject(quiz.subject)}
                </td>
                <td className="text-sm text-muted-foreground">{quiz.date}</td>
                <td className="text-sm text-muted-foreground">
                  {quiz.lesson}
                </td>
                <td className="text-sm text-muted-foreground">
                  {quiz.teacherName}
                </td>
                <td>
                  <ScheduleStatusBadge status={quiz.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}