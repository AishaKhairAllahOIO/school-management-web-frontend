import {
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

import type {
  StaffSectionColor,
} from "../../types/staff.types";

import { StaffInfoItem } from "../fields/StaffInfoItem";
import { StaffSection } from "../layout/StaffSection";

type Props = {
  degree?: string | null;

  specialization?: string | null;

  university?: string | null;

  graduationYear?: number | null;

  hireDate: string;

  experienceYears?: number | null;

  serviceType?: string | null;

  color?: StaffSectionColor;
};

export function StaffEmploymentViewSection({
  degree,
  specialization,
  university,
  graduationYear,
  hireDate,
  experienceYears,
  serviceType,
  color,
}: Props) {
  return (
    <StaffSection
      eyebrow="Employment"
      title="Professional information"
      description="Education, employment and work history."
      icon={
        <BriefcaseBusiness className="h-5 w-5" />
      }
      contentClassName="grid gap-3 md:grid-cols-2"
      color={color}
    >
      <StaffInfoItem
        color={color}
        label="Degree"
        value={degree}
        icon={
          <GraduationCap className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        color={color}
        label="Specialization"
        value={specialization}
      />

      <StaffInfoItem
        color={color}
        label="University"
        value={university}
      />

      <StaffInfoItem
        color={color}
        label="Graduation year"
        value={graduationYear}
      />

      <StaffInfoItem
        color={color}
        label="Hire date"
        value={hireDate}
      />

      <StaffInfoItem
        color={color}
        label="Experience"
        value={
          experienceYears != null
            ? `${experienceYears} years`
            : null
        }
      />

      {serviceType ? (
        <StaffInfoItem
        color={color}
          label="Service type"
          value={serviceType}
        />
      ) : null}
    </StaffSection>
  );
}