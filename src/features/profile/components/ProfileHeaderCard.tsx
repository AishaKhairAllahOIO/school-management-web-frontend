import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Edit3,
  Mail,
  Phone,
} from "lucide-react";

import type {
  DashboardProfileUser,
  ProfileIdentity,
  ProfilePermissions,
} from "@/features/profile/types/profile.types";
import { formatDate, formatFullName } from "@/features/profile/utils/profileFormatters";

type ProfileHeaderCardProps = {
  user: DashboardProfileUser;
  identity: ProfileIdentity;
  permissions: ProfilePermissions;
};

export function ProfileHeaderCard({
  user,
  identity,
  permissions,
}: ProfileHeaderCardProps) {
  const fullName = formatFullName(user.firstName, user.lastName);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15124A] via-[#33227A] to-[#6D4DF2] p-6 text-white shadow-floating">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_36%)]" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.photoUrl}
              alt={fullName}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white/25"
            />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-[#33227A] bg-success" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-[-0.03em]">{fullName}</h1>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                {identity.roleLabel}
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Mail size={15} /> {identity.email}
              </span>

              <span className="flex items-center gap-2">
                <Phone size={15} /> {user.phoneNumber}
              </span>

              <span className="flex items-center gap-2">
                <BriefcaseBusiness size={15} /> {identity.code}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={15} /> Joined {formatDate(user.hireDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/12 px-4 text-sm font-bold">
            <BadgeCheck size={16} />
            {user.accountStatus}
          </span>

          {permissions.canEditPersonalInfo ? (
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-primary shadow-soft transition hover:bg-white/90"
            >
              <Edit3 size={15} />
              Edit Profile
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}