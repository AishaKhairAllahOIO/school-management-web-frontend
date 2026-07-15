import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { UserCategoryCard } from "../components/UserCategoryCard";
import type { UsersOverviewCounts } from "../types/users-overview.types";

const emptyCounts: UsersOverviewCounts = {};

export function UsersOverviewPage() {
  /*
   * سنستبدل emptyCounts لاحقًا بنتيجة hook واحدة:
   *
   * const { data: counts } = useUsersOverviewCounts();
   *
   * لا أربط endpoint الآن لأن مساره وشكل response
   * غير ظاهرين في ملفات المستودع الحالية، وتخمينهما
   * قد يسبب ربطًا خاطئًا.
   */
  const counts = emptyCounts;

  return (
    <section className="space-y-7">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground">
          Users
        </h1>

        <p className="mt-2 text-base leading-7 text-muted-foreground">
          Manage school users by category.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <UserCategoryCard
          title="Students"
          description="Manage student records and their parents."
          path="/users/students"
          icon={GraduationCap}
          count={counts.students}
          countLabel="Total students"
          secondaryCount={counts.parents}
          secondaryCountLabel="Parents"
          accentClassName="primary-gradient"
          iconClassName="bg-primary/10 text-primary"
        />

        <UserCategoryCard
          title="Teachers"
          description="Manage teachers and their school information."
          path="/users/teachers"
          icon={BookOpen}
          count={counts.teachers}
          countLabel="Total teachers"
          accentClassName="bg-info"
          iconClassName="bg-info/10 text-info"
        />

        <UserCategoryCard
          title="Supervisors"
          description="Manage educational supervisors."
          path="/users/supervisors"
          icon={ShieldCheck}
          count={counts.supervisors}
          countLabel="Total supervisors"
          accentClassName="bg-success"
          iconClassName="bg-success/10 text-success"
        />

        <UserCategoryCard
          title="Secretaries"
          description="Manage school secretaries."
          path="/users/secretaries"
          icon={BriefcaseBusiness}
          count={counts.secretaries}
          countLabel="Total secretaries"
          accentClassName="bg-warning"
          iconClassName="bg-warning/10 text-warning"
        />

        <UserCategoryCard
          title="Counselors"
          description="Manage psychological counselors."
          path="/users/counselors"
          icon={HeartHandshake}
          count={counts.counselors}
          countLabel="Total counselors"
          accentClassName="bg-destructive"
          iconClassName="bg-destructive/10 text-destructive"
        />

        <UserCategoryCard
          title="Service Staff"
          description="Manage school service staff."
          path="/users/service-staff"
          icon={UserCog}
          count={counts.serviceStaff}
          countLabel="Total service staff"
          accentClassName="bg-secondary-foreground"
          iconClassName="bg-secondary text-secondary-foreground"
        />
      </div>
    </section>
  );
}