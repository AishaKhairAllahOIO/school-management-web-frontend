import { CalendarDays, Clock3, FileText, MapPin } from "lucide-react";
import { useState } from "react";

import { GradeTabs } from "@/features/scheduling/components/GradeTabs";
import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
import { ScheduleStatusBadge } from "@/features/scheduling/components/ScheduleStatusBadge";
import { examSchedules } from "@/features/scheduling/data/scheduling.mock";
import { exportScheduleWorkbook } from "@/features/scheduling/shared/utils/export-schedule-xlsx";
import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

function formatSubject(subject: string) {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

export function ExamSchedulesPage() {
  const [grade, setGrade] = useState<SchoolGrade>("seventh");
  const exams = examSchedules.filter((exam) => exam.grade === grade);

  function handleExport() {
    exportScheduleWorkbook({
      fileName: `${grade}-exam-schedules`,
      sheetName: "Exam Schedules",
      rows: exams.map((exam) => ({
        Grade: grade,
        Subject: formatSubject(exam.subject),
        Date: exam.date,
        "Start Time": exam.startTime,
        Duration: exam.duration,
        Room: exam.room,
        Status: exam.status,
      })),
    });
  }

  return (
    <div className="space-y-5">
      <SchedulePageHeader
        title="Exam Schedules"
        description="Organize exam dates, rooms and timing by grade."
        icon={FileText}
        onExport={handleExport}
      />

      <section className="rounded-[24px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
        <GradeTabs value={grade} onChange={setGrade} />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam, index) => {
          const tones = [
            "border-violet-200/60 bg-violet-50/60",
            "border-sky-200/60 bg-sky-50/60",
            "border-emerald-200/60 bg-emerald-50/60",
          ];

          return (
            <article
              key={exam.id}
              className={`rounded-[22px] border p-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(30,20,70,0.06)] ${tones[index % tones.length]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">
                    {formatSubject(exam.subject)}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{grade} grade</p>
                </div>
                <ScheduleStatusBadge status={exam.status} />
              </div>

              <div className="mt-4 grid gap-2 text-[10px] text-muted-foreground sm:grid-cols-2">
                <Info icon={CalendarDays} text={exam.date} />
                <Info icon={Clock3} text={`${exam.startTime} · ${exam.duration}`} />
                <Info icon={MapPin} text={exam.room} />
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
    <div className="flex items-center gap-2 rounded-[12px] bg-card/65 px-2.5 py-2">
      <Icon size={13} />
      <span>{text}</span>
    </div>
  );
}
