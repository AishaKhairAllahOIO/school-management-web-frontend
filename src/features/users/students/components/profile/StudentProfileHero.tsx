import {
  GraduationCap,
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

export function StudentProfileHero({
  student,
  enrollment,
}: StudentProfileHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-rose-100 via-white to-orange-100 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.09)] sm:p-8">
      <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/70 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:text-right">
        {student.photoUrl ? (
          <img
            src={student.photoUrl}
            alt={student.fullName}
            className="h-44 w-44 rounded-[38px] object-cover shadow-2xl ring-8 ring-white/80"
          />
        ) : (
          <div className="flex h-44 w-44 items-center justify-center rounded-[38px] bg-white text-rose-400 shadow-xl">
            <UserRound className="h-16 w-16" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <StudentStatusBadge
              status={
                enrollment.enrollmentStatus
              }
            />

            <StudentStatusBadge
              status={student.accountStatus}
            />
          </div>

          <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
            {student.fullName}
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            رقم الطالب: {student.id}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/75 px-4 py-3 text-sm font-bold text-slate-700 backdrop-blur">
              <GraduationCap className="h-4 w-4 text-rose-500" />
              {enrollment.grade?.name ??
                "الصف غير محدد"}
            </div>

            {student.phoneNumber ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/75 px-4 py-3 text-sm font-bold text-slate-700 backdrop-blur">
                <Phone className="h-4 w-4 text-blue-500" />

                <span dir="ltr">
                  {student.phoneNumber}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}