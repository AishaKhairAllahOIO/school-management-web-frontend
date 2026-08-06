import {
  Mail,
  Phone,
} from "lucide-react";

import type {
  StaffSectionColor,
} from "../../types/staff.types";

import {
  StaffInfoItem,
} from "../fields/StaffInfoItem";

import {
  StaffSection,
} from "../layout/StaffSection";

type Props = {
  phoneNumber: string;

  email?: string | null;

  color?: StaffSectionColor;
};

export function StaffContactViewSection({
  phoneNumber,
  email,
  color,
}: Props) {
  return (
    <StaffSection
      eyebrow="Communication"
      title="Contact information"
      description="Primary communication channels."
      icon={
        <Phone className="h-5 w-5" />
      }
      contentClassName="grid gap-3 md:grid-cols-2"
      color={color}
    >
      <StaffInfoItem
        direction="ltr"
        label="Phone number"
        value={phoneNumber}
        icon={
          <Phone className="h-4 w-4" />
        }
        color={color}
      />

      <StaffInfoItem
        direction="ltr"
        label="Email"
        value={email}
        icon={
          <Mail className="h-4 w-4" />
        }
        color={color}
      />
    </StaffSection>
  );
}