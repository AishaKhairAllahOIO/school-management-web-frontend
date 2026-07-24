import {
  CalendarDays,
  Home,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";


import type {
  DashboardProfileUser,
} from "@/features/profile/types/profile.types";


import { ProfileInfoItem } 
from "@/features/profile/components/ProfileInfoItem";


import {
  formatDate,
  formatLabel,
  formatValue,
} from "@/features/profile/utils/profileFormatters";



type Props = {
  user: DashboardProfileUser;
};



export function PersonalInformationCard({
  user,
}: Props) {


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
Personal Identity
</h2>



<p
className="
mt-1
text-sm
text-muted-foreground
"
>
Basic personal information
</p>




<div
className="
mt-5
grid
gap-3
md:grid-cols-2
xl:grid-cols-3
"
>


<ProfileInfoItem
label="First Name"
value={user.firstName}
icon={UserRound}
/>


<ProfileInfoItem
label="Last Name"
value={user.lastName}
icon={UserRound}
/>



<ProfileInfoItem
label="Birth Date"
value={formatDate(user.birthDate)}
icon={CalendarDays}
/>



<ProfileInfoItem
label="Gender"
value={formatLabel(user.gender)}
icon={UserRound}
/>



<ProfileInfoItem
label="Email"
value={user.email}
icon={Mail}
/>



<ProfileInfoItem
label="Phone"
value={user.phoneNumber}
icon={Phone}
/>



<ProfileInfoItem
label="Address"
value={formatValue(user.address)}
icon={Home}
/>


</div>


</section>

);

}