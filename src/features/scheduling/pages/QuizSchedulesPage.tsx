import { BookOpen, CalendarDays, UserRound } from "lucide-react";
import { useState } from "react";

import { GradeTabs } from "@/features/scheduling/components/GradeTabs";
import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
import { ScheduleStatusBadge } from "@/features/scheduling/components/ScheduleStatusBadge";
import { quizSchedules } from "@/features/scheduling/data/scheduling.mock";
import { exportScheduleWorkbook } from "@/features/scheduling/shared/utils/export-schedule-xlsx";
import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

function formatSubject(subject: string) {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

export function QuizSchedulesPage() {
  const [grade, setGrade] = useState<SchoolGrade>("seventh");
  const quizzes = quizSchedules.filter((quiz) => quiz.grade === grade);

  function handleExport() {
    exportScheduleWorkbook({
      fileName: `${grade}-quiz-schedules`,
      sheetName: "Quiz Schedules",
      rows: quizzes.map((quiz) => ({
        Grade: grade,
        Subject: formatSubject(quiz.subject),
        Date: quiz.date,
        Lesson: quiz.lesson,
        Teacher: quiz.teacherName,
        Status: quiz.status,
      })),
    });
  }

  return (
    <div className="space-y-5">
      <SchedulePageHeader
        title="Quiz Schedules"
        description="Plan quizzes and short tests with a clean grade-based view."
        icon={BookOpen}
        onExport={handleExport}
      />

      <section className="rounded-[24px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
        <GradeTabs value={grade} onChange={setGrade} />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz, index) => {
          const tones = [
            "border-rose-200/60 bg-rose-50/60",
            "border-sky-200/60 bg-sky-50/60",
            "border-amber-200/60 bg-amber-50/60",
          ];

          return (
            <article key={quiz.id} className={`rounded-[22px] border p-4 ${tones[index % tones.length]}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">
                    {formatSubject(quiz.subject)}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{quiz.lesson}</p>
                </div>
                <ScheduleStatusBadge status={quiz.status} />
              </div>

              <div className="mt-4 space-y-2">
                <Info icon={CalendarDays} text={quiz.date} />
                <Info icon={UserRound} text={quiz.teacherName} />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Info({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[12px] bg-card/65 px-2.5 py-2 text-[10px] text-muted-foreground">
      <Icon size={13} />
      <span>{text}</span>
    </div>
  );
}
