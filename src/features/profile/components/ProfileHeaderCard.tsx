import {
  BadgeCheck,
  CalendarDays,
  Mail,
  Phone,
  BriefcaseBusiness,
} from "lucide-react";


import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";


import {
  formatDate,
  formatFullName,
  formatLabel,
} from "@/features/profile/utils/profileFormatters";



type ProfileHeaderCardProps = {
  user: DashboardProfileUser;
  identity: ProfileIdentity;
};



export function ProfileHeaderCard({
  user,
  identity,
}: ProfileHeaderCardProps) {


  const fullName =
    user.fullName ||
    formatFullName(
      user.firstName,
      user.lastName,
    );


  const photo =
    user.photoUrl ||
    "/images/avatar-placeholder.png";



  return (

    <section
      className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-border/60
      bg-gradient-to-br
      from-white
      via-white
      to-primary/[0.06]
      px-6
      py-6
      shadow-soft
      "
    >



      {/* soft decoration */}
      <div
        className="
        pointer-events-none
        absolute
        -right-20
        -top-20
        h-56
        w-56
        rounded-full
        bg-primary/10
        blur-3xl
        "
      />




      <div
        className="
        relative
        z-10
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:items-center
        lg:justify-between
        "
      >



        {/* Identity */}
        <div
          className="
          flex
          items-center
          gap-5
          "
        >



          <div
            className="
            relative
            "
          >


            <img
              src={photo}
              alt={fullName}
              className="
              h-[92px]
              w-[92px]
              rounded-[28px]
              border
              border-border
              object-cover
              ring-4
              ring-primary/5
              "
            />



            <span
              className="
              absolute
              bottom-1
              right-1
              h-5
              w-5
              rounded-full
              border-4
              border-card
              bg-emerald-500
              "
            />

          </div>






          <div>


            <div
              className="
              flex
              flex-wrap
              items-center
              gap-2
              "
            >


              <h1
                className="
                text-2xl
                font-bold
                tracking-[-0.04em]
                text-foreground
                "
              >
                {fullName}
              </h1>



              <span
                className="
                rounded-full
                bg-primary/10
                px-3
                py-1
                text-xs
                font-bold
                text-primary
                "
              >
                {identity.roleLabel}
              </span>


            </div>





            <div
              className="
              mt-4
              flex
              flex-wrap
              gap-x-5
              gap-y-3
              text-sm
              text-muted-foreground
              "
            >



              <span
                className="
                flex
                items-center
                gap-2
                "
              >
                <Mail
                  size={15}
                  className="text-primary"
                />

                {identity.email}

              </span>





              <span
                className="
                flex
                items-center
                gap-2
                "
              >

                <Phone
                  size={15}
                  className="text-primary"
                />

                {user.phoneNumber}

              </span>






              <span
                className="
                flex
                items-center
                gap-2
                "
              >

                <BriefcaseBusiness
                  size={15}
                  className="text-primary"
                />

                {formatLabel(
                  user.role[0],
                )}

              </span>







              <span
                className="
                flex
                items-center
                gap-2
                "
              >

                <CalendarDays
                  size={15}
                  className="text-primary"
                />

                Joined {formatDate(user.hireDate)}

              </span>



            </div>



          </div>




        </div>






        {/* Status */}
        <div>


          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            px-5
            py-3
            text-sm
            font-bold
            text-emerald-600
            "
          >

            <BadgeCheck
              size={17}
            />


            {formatLabel(
              user.accountStatus,
            )}


          </div>


        </div>





      </div>


    </section>

  );

}