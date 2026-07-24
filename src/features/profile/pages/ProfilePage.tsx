import { ProfileHeaderCard } from "@/features/profile/components/ProfileHeaderCard";
import { PersonalInformationCard } from "@/features/profile/components/PersonalInformationCard";
import { EmploymentInformationCard } from "@/features/profile/components/EmploymentInformationCard";
import { AccountOverviewCard } from "@/features/profile/components/AccountOverviewCard";

import { useProfile } from "@/features/profile/hooks/use-my-profile";


export function ProfilePage() {

  const {
    user,
    identity,
    permissions,
    isLoading,
  } = useProfile();


  if (
    isLoading ||
    !user ||
    !identity ||
    !permissions
  ) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }


  return (

    <div className="space-y-5">


      <ProfileHeaderCard
        user={user}
        identity={identity}
      />


      <div
        className="
        grid
        gap-5
        xl:grid-cols-[minmax(0,1fr)_330px]
        "
      >


        <div className="space-y-5">

          <PersonalInformationCard
            user={user}
          />


          <EmploymentInformationCard
            user={user}
          />

        </div>



        <AccountOverviewCard
          user={user}
          identity={identity}
        />


      </div>


    </div>

  );
}