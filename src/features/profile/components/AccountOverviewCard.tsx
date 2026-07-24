import {
  BadgeCheck,
  CalendarDays,
  ShieldCheck,
  UserCog,
} from "lucide-react";


import type {
 DashboardProfileUser,
 ProfileIdentity,
} from "@/features/profile/types/profile.types";


import { ProfileInfoItem }
from "@/features/profile/components/ProfileInfoItem";


import {
 formatDate,
 formatLabel,
}
from "@/features/profile/utils/profileFormatters";



type Props = {
 user: DashboardProfileUser;
 identity: ProfileIdentity;
};



export function AccountOverviewCard({
 user,
 identity,
}:Props){


return (

<section
className="
rounded-[32px]
bg-card
p-6
shadow-soft
ring-1
ring-border/60
"
>


<h2
className="
text-base
font-bold
text-foreground
"
>
System Identity
</h2>


<p
className="
mt-1
text-sm
text-muted-foreground
"
>
Account information
</p>



<div
className="
mt-5
space-y-3
"
>


<ProfileInfoItem
label="Role"
value={identity.roleLabel}
icon={UserCog}
/>


<ProfileInfoItem
label="Email"
value={identity.email}
icon={ShieldCheck}
/>


<ProfileInfoItem
label="Status"
value={formatLabel(user.accountStatus)}
icon={BadgeCheck}
/>


<ProfileInfoItem
label="Created"
value={formatDate(user.createdAt)}
icon={CalendarDays}
/>


</div>


</section>

);

}