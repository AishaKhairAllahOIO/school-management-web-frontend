import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { GradeTabs } from "@/features/scheduling/components/GradeTabs";
import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
import {
  classSchedules,
  timeSlots,
  upcomingClasses,
  weekDays,
} from "@/features/scheduling/data/scheduling.mock";
import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

const subjectClasses: Record<string, string> = {
  arabic: "bg-success/10 text-success",
  english: "bg-info/10 text-info",
  math: "bg-primary/10 text-primary",
  science: "bg-success/10 text-success",
  french: "bg-warning/10 text-warning",
  national: "bg-destructive/10 text-destructive",
  sports: "bg-info/10 text-info",
};

function formatSubject(subject: string) {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

export function ClassSchedulesPage() {
  const [grade, setGrade] = useState<SchoolGrade>("seventh");

  return (
    <div className="space-y-4">
      <section className="soft-card rounded-3xl p-6">
        <SchedulePageHeader
          title="Class Schedules"
          description="View and manage class schedules by grade"
          icon={CalendarDays}
        />

        <GradeTabs value={grade} onChange={setGrade} />

        <div className="mt-6">
          <h2 className="mb-4 text-base font-bold text-foreground">
            Weekly Class Timetable - {formatSubject(grade)} Grade
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <table className="w-full min-w-[980px] border-collapse">
              <thead>
                <tr className="bg-muted/40">
                  <th className="border-b border-r border-border/70 px-4 py-3 text-sm font-bold">
                    Time
                  </th>

                  {weekDays.map((day) => (
                    <th
                      key={day}
                      className="border-b border-r border-border/70 px-4 py-3 text-sm font-bold last:border-r-0"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.id}>
                    <td className="border-b border-r border-border/70 px-4 py-3 text-center text-sm font-semibold">
                      {slot.start} - {slot.end}
                    </td>

                    {weekDays.map((day) => {
                      const cell = classSchedules.find(
                        (item) =>
                          item.grade === grade &&
                          item.day === day &&
                          item.timeSlotId === slot.id
                      );

                      return (
                        <td
                          key={`${slot.id}-${day}`}
                          className="border-b border-r border-border/70 px-4 py-3 last:border-r-0"
                        >
                          {cell ? (
                            <div
                              className={[
                                "rounded-xl px-3 py-2 text-center text-xs font-semibold",
                                subjectClasses[cell.subject] ??
                                  "bg-muted text-muted-foreground",
                              ].join(" ")}
                            >
                              {formatSubject(cell.subject)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="soft-card rounded-3xl p-6">
        <h2 className="mb-4 text-base font-bold text-foreground">
          Upcoming Classes
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-border/70 text-left text-xs uppercase text-muted-foreground">
                <th className="py-3">Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {upcomingClasses.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="py-4 text-sm">{item.day}</td>
                  <td className="text-sm text-muted-foreground">{item.time}</td>
                  <td>
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        subjectClasses[item.subject] ??
                          "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {formatSubject(item.subject)}
                    </span>
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {item.teacherName}
                  </td>
                  <td className="text-sm text-muted-foreground">{item.room}</td>
                  <td>
                    <span className="rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info">
                      Upcoming
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}