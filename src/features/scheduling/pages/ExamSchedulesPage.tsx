import { FileText } from "lucide-react";
import { useState } from "react";

import { GradeTabs } from "@/features/scheduling/components/GradeTabs";
import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
import { ScheduleStatusBadge } from "@/features/scheduling/components/ScheduleStatusBadge";
import { examSchedules } from "@/features/scheduling/data/scheduling.mock";
import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

function formatSubject(subject: string) {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

export function ExamSchedulesPage() {
  const [grade, setGrade] = useState<SchoolGrade>("seventh");

  const exams = examSchedules.filter((exam) => exam.grade === grade);

  return (
    <section className="soft-card rounded-3xl p-6">
      <SchedulePageHeader
        title="Exam Schedules"
        description="Manage exam schedules by grade and subject"
        icon={FileText}
      />

      <GradeTabs value={grade} onChange={setGrade} />

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full min-w-[840px]">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-5 py-4">Subject</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-t border-border/60">
                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                  {formatSubject(exam.subject)}
                </td>
                <td className="text-sm text-muted-foreground">{exam.date}</td>
                <td className="text-sm text-muted-foreground">
                  {exam.startTime}
                </td>
                <td className="text-sm text-muted-foreground">
                  {exam.duration}
                </td>
                <td className="text-sm text-muted-foreground">{exam.room}</td>
                <td>
                  <ScheduleStatusBadge status={exam.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}