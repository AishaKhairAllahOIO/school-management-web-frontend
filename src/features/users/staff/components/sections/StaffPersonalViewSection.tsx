import {
  CalendarDays,
  Flag,
  MapPin,
  UserRound,
} from "lucide-react";

import type {
  StaffSectionColor,
} from "../../types/staff.types";

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

  color?: StaffSectionColor;
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
  color,
}: StaffPersonalViewSectionProps) {
  return (
    <StaffSection
      eyebrow="Identity"
      title="Personal information"
      description="Legal identity and personal information."
      icon={<UserRound className="h-5 w-5" />}
      contentClassName="grid gap-3 md:grid-cols-2"
      color={color}
    >
      <StaffInfoItem
        color={color}
        label="First name"
        value={firstName}
      />

      <StaffInfoItem
        color={color}
        label="Last name"
        value={lastName}
      />

      <StaffInfoItem
        color={color}
        label="Father name"
        value={fatherName}
      />

      <StaffInfoItem
        color={color}
        label="Mother name"
        value={motherName}
      />

      <StaffInfoItem
        color={color}
        label="Birth date"
        value={birthDate}
        icon={
          <CalendarDays className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        color={color}
        label="Birth place"
        value={birthPlace}
        icon={
          <MapPin className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        color={color}
        label="Gender"
        value={gender}
      />

      <StaffInfoItem
        color={color}
        label="Nationality"
        value={nationality}
        icon={
          <Flag className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        color={color}
        className="md:col-span-2"
        label="Address"
        value={address}
      />
    </StaffSection>
  );
}