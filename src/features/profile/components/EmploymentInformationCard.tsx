import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Award,
  Building2,
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



export function EmploymentInformationCard({
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


<div
className="
flex
items-start
justify-between
"
>

<div>

<h2
className="
text-base
font-bold
text-foreground
"
>
Professional Identity
</h2>


<p
className="
mt-1
text-sm
text-muted-foreground
"
>
Employment and academic background
</p>


</div>


<BriefcaseBusiness
className="
text-primary
"
size={22}
/>


</div>





<div
className="
mt-6
"
>


<h3
className="
mb-3
text-xs
font-bold
uppercase
tracking-wider
text-muted-foreground
"
>
Employment
</h3>



<div
className="
grid
gap-3
md:grid-cols-2
"
>


<ProfileInfoItem
label="Hire Date"
value={formatDate(user.hireDate)}
icon={CalendarDays}
/>



<ProfileInfoItem
label="Experience"
value={`${formatValue(user.experienceYears)} years`}
icon={Award}
/>



<ProfileInfoItem
label="Service Type"
value={formatValue(user.serviceType)}
icon={Building2}
/>



</div>


</div>







<div
className="
mt-7
"
>


<h3
className="
mb-3
text-xs
font-bold
uppercase
tracking-wider
text-muted-foreground
"
>
Education
</h3>



<div
className="
grid
gap-3
md:grid-cols-2
"
>


<ProfileInfoItem
label="Degree"
value={formatLabel(user.degree ?? "")}
icon={GraduationCap}
/>



<ProfileInfoItem
label="Specialization"
value={formatValue(user.specialization)}
icon={BriefcaseBusiness}
/>



<ProfileInfoItem
label="University"
value={formatValue(user.university)}
icon={Building2}
/>



<ProfileInfoItem
label="Graduation Year"
value={formatValue(user.graduationYear)}
icon={CalendarDays}
/>



</div>


</div>



</section>

);

}