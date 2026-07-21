import {
  GraduationCap,
  IdCard,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  PersonProfile,
  StudentEnrollment,
} from "../../types/student.types";
import { StudentStatusBadge } from "../shared/StudentStatusBadge";

type StudentProfileHeroProps = {
  student: PersonProfile;
  enrollment: StudentEnrollment;
};

function gradeLabel(
  enrollment: StudentEnrollment,
) {
  if (enrollment.grade?.name) {
    return enrollment.grade.name;
  }

  if (
    enrollment.gradeId !== null &&
    enrollment.gradeId !== undefined
  ) {
    return `Grade #${enrollment.gradeId}`;
  }

  return "Grade not assigned";
}

export function StudentProfileHero({
  student,
  enrollment,
}: StudentProfileHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-border/70 bg-card shadow-[var(--shadow-floating)]">
      <div className="soft-purple-gradient absolute inset-0 opacity-80" />
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[260px_1fr] lg:items-end">
        <div className="relative overflow-hidden rounded-[30px] border border-card/70 bg-muted shadow-[var(--shadow-floating)]">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="h-72 w-full object-cover lg:h-[330px]"
            />
          ) : (
            <div className="flex h-72 items-center justify-center bg-card/60 lg:h-[330px]">
              <div className="flex h-28 w-28 items-center justify-center rounded-[34px] bg-primary/10 text-primary">
                <UserRound className="h-14 w-14" />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 pb-1">
          <StudentStatusBadge
            status={enrollment.enrollmentStatus}
          />

          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            {student.fullName}
          </h1>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/75 px-4 py-2.5 text-sm font-bold text-foreground backdrop-blur">
              <IdCard className="h-4 w-4 text-primary" />
              Student #{student.id}
            </span>

            <span className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/75 px-4 py-2.5 text-sm font-bold text-foreground backdrop-blur">
              <GraduationCap className="h-4 w-4 text-primary" />
              {gradeLabel(enrollment)}
            </span>

            {student.phoneNumber ? (
              <span
                dir="ltr"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/75 px-4 py-2.5 text-sm font-bold text-foreground backdrop-blur"
              >
                <Phone className="h-4 w-4 text-primary" />
                {student.phoneNumber}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
