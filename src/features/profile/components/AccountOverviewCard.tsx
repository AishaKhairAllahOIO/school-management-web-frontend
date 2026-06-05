import {
  BadgeCheck,
  CalendarDays,
  IdCard,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";
import { ProfileInfoItem } from "@/features/profile/components/ProfileInfoItem";
import { formatDate, formatLabel } from "@/features/profile/utils/profileFormatters";

type Props = {
  user: DashboardProfileUser;
  identity: ProfileIdentity;
};

export function AccountOverviewCard({ user, identity }: Props) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60">
      <h2 className="text-base font-bold text-foreground">Account Overview</h2>

      <div className="mt-5 space-y-3">
        <ProfileInfoItem label="Role" value={identity.roleLabel} icon={UserCog} />
        <ProfileInfoItem label="Code" value={identity.code} icon={IdCard} />
        <ProfileInfoItem label="Account Status" value={formatLabel(user.accountStatus)} icon={ShieldCheck} />
        <ProfileInfoItem label="Record Status" value={formatLabel(user.recordStatus)} icon={BadgeCheck} />
        <ProfileInfoItem label="Created At" value={formatDate(user.createdAt)} icon={CalendarDays} />
        <ProfileInfoItem label="Updated At" value={formatDate(user.updatedAt)} icon={CalendarDays} />
      </div>
    </section>
  );
}