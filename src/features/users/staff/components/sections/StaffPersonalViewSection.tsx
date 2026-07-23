import {
  CalendarDays,
  Flag,
  MapPin,
  UserRound,
} from "lucide-react";

import { StaffInfoItem } from "../fields/StaffInfoItem";
import { StaffSection } from "../layout/StaffSection";

type StaffPersonalViewSectionProps = {
  firstName: string;
  lastName: string;

  fatherName: string;
  motherName: string;

  birthDate: string;
  birthPlace: string;

  gender: string;
  nationality: string;

  address: string;
};

export function StaffPersonalViewSection({
  firstName,
  lastName,
  fatherName,
  motherName,
  birthDate,
  birthPlace,
  gender,
  nationality,
  address,
}: StaffPersonalViewSectionProps) {
  return (
    <StaffSection
      eyebrow="Identity"
      title="Personal information"
      description="Legal identity and personal information."
      icon={<UserRound className="h-5 w-5" />}
      contentClassName="grid gap-3 md:grid-cols-2"
    >
      <StaffInfoItem
        label="First name"
        value={firstName}
      />

      <StaffInfoItem
        label="Last name"
        value={lastName}
      />

      <StaffInfoItem
        label="Father name"
        value={fatherName}
      />

      <StaffInfoItem
        label="Mother name"
        value={motherName}
      />

      <StaffInfoItem
        label="Birth date"
        value={birthDate}
        icon={
          <CalendarDays className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        label="Birth place"
        value={birthPlace}
        icon={
          <MapPin className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        label="Gender"
        value={gender}
      />

      <StaffInfoItem
        label="Nationality"
        value={nationality}
        icon={
          <Flag className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        className="md:col-span-2"
        label="Address"
        value={address}
      />
    </StaffSection>
  );
}