import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
} from "lucide-react";

import type { DashboardProfileUser } from "@/features/profile/types/profile.types";
import { ProfileInfoItem } from "@/features/profile/components/ProfileInfoItem";
import { formatDate, formatLabel, formatValue } from "@/features/profile/utils/profileFormatters";

type Props = {
  user: DashboardProfileUser;
};

export function EmploymentInformationCard({ user }: Props) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60">
      <h2 className="text-base font-bold text-foreground">Employment Information</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <ProfileInfoItem label="Hire Date" value={formatDate(user.hireDate)} icon={CalendarDays} />
        <ProfileInfoItem label="Degree" value={formatLabel(user.degree)} icon={GraduationCap} />
        <ProfileInfoItem label="Specialization" value={user.specialization} icon={BriefcaseBusiness} />
        <ProfileInfoItem label="University" value={user.university} icon={GraduationCap} />
        <ProfileInfoItem label="Graduation Year" value={user.graduationYear} icon={CalendarDays} />
        <ProfileInfoItem
          label="Experience"
          value={`${formatValue(user.yearsOfExperience)} years`}
          icon={BadgeCheck}
        />
      </div>
    </section>
  );
}