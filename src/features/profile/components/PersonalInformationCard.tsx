import {
  CalendarDays,
  Flag,
  Home,
  MapPin,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { DashboardProfileUser } from "@/features/profile/types/profile.types";
import { ProfileInfoItem } from "@/features/profile/components/ProfileInfoItem";
import { formatDate, formatLabel, formatValue } from "@/features/profile/utils/profileFormatters";

type Props = {
  user: DashboardProfileUser;
};

export function PersonalInformationCard({ user }: Props) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60">
      <h2 className="text-base font-bold text-foreground">Personal Information</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ProfileInfoItem label="First Name" value={user.firstName} icon={UserRound} />
        <ProfileInfoItem label="Last Name" value={user.lastName} icon={UserRound} />
        <ProfileInfoItem label="Father Name" value={user.fatherName} icon={UsersRound} />
        <ProfileInfoItem label="Mother Name" value={user.motherName} icon={UsersRound} />
        <ProfileInfoItem label="Birth Date" value={formatDate(user.birthDate)} icon={CalendarDays} />
        <ProfileInfoItem label="Birth Place" value={user.birthPlace} icon={MapPin} />
        <ProfileInfoItem label="Gender" value={formatLabel(user.gender)} icon={UserRound} />
        <ProfileInfoItem label="Nationality" value={formatLabel(user.nationality)} icon={Flag} />
        <ProfileInfoItem label="Phone Number" value={user.phoneNumber} icon={Phone} />
        <ProfileInfoItem label="Address" value={formatValue(user.address)} icon={Home} />
      </div>
    </section>
  );
}