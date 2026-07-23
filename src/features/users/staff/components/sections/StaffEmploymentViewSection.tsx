import {
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

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
};

export function StaffEmploymentViewSection({
  degree,
  specialization,
  university,
  graduationYear,
  hireDate,
  experienceYears,
  serviceType,
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
    >
      <StaffInfoItem
        label="Degree"
        value={degree}
        icon={
          <GraduationCap className="h-4 w-4" />
        }
      />

      <StaffInfoItem
        label="Specialization"
        value={specialization}
      />

      <StaffInfoItem
        label="University"
        value={university}
      />

      <StaffInfoItem
        label="Graduation year"
        value={graduationYear}
      />

      <StaffInfoItem
        label="Hire date"
        value={hireDate}
      />

      <StaffInfoItem
        label="Experience"
        value={
          experienceYears != null
            ? `${experienceYears} years`
            : null
        }
      />

      {serviceType ? (
        <StaffInfoItem
          label="Service type"
          value={serviceType}
        />
      ) : null}
    </StaffSection>
  );
}