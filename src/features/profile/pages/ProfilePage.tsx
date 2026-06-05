import { ProfileHeaderCard } from "@/features/profile/components/ProfileHeaderCard";
import { PersonalInformationCard } from "@/features/profile/components/PersonalInformationCard";
import { EmploymentInformationCard } from "@/features/profile/components/EmploymentInformationCard";
import { AccountOverviewCard } from "@/features/profile/components/AccountOverviewCard";
import { QuickActionsCard } from "@/features/profile/components/QuickActionsCard";
import { SecurityCard } from "@/features/profile/components/SecurityCard";
import { useProfile } from "@/features/profile/hooks/useProfile";

export function ProfilePage() {
  const { user, identity, permissions } = useProfile();

  return (
    <div className="space-y-5">
      <ProfileHeaderCard
        user={user}
        identity={identity}
        permissions={permissions}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <PersonalInformationCard user={user} />
          <EmploymentInformationCard user={user} />
          <SecurityCard />
        </div>

        <div className="space-y-5">
          <AccountOverviewCard user={user} identity={identity} />
          <QuickActionsCard permissions={permissions} />
        </div>
      </div>
    </div>
  );
}