import {
  UserRound,
} from "lucide-react";

import { DatePicker } from "@/shared/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";


import {
  StaffFormField,
} from "../fields/StaffFormField";

import {
  StaffSection,
} from "../layout/StaffSection";

import {
  defaultStaffSectionColor,
  getStaffFieldClassName,
} from "../theme/staff-theme";

import type {
  StaffSectionColor,
  RegisterStaffValues,
  StaffGender,
  StaffNationality,
} from "../../types/staff.types";


type StaffPersonalFormSectionProps = {
  values: RegisterStaffValues;

  disabled?: boolean;

  color?: StaffSectionColor;

  updateValue: <
    K extends keyof RegisterStaffValues,
  >(
    key: K,
    value: RegisterStaffValues[K],
  ) => void;
};

export function StaffPersonalFormSection({
  values,
  disabled = false,
  color = defaultStaffSectionColor,
  updateValue,
}: StaffPersonalFormSectionProps) {
  const fieldClassName = getStaffFieldClassName(color);

  return (
    <StaffSection
      eyebrow="Identity"
      title="Personal information"
      description="Enter the staff member's legal identity and personal details."
      icon={
        <UserRound className="h-5 w-5" />
      }
      color={color}
    >
      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
        <StaffFormField
          label="First name"
          required
        >
          <input
            required
            disabled={disabled}
            type="text"
            autoComplete="given-name"
            placeholder="Enter first name"
            value={values.first_name}
            onChange={(event) =>
              updateValue(
                "first_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Last name"
          required
        >
          <input
            required
            disabled={disabled}
            type="text"
            autoComplete="family-name"
            placeholder="Enter last name"
            value={values.last_name}
            onChange={(event) =>
              updateValue(
                "last_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Father name"
          required
        >
          <input
            required
            disabled={disabled}
            type="text"
            placeholder="Enter father name"
            value={values.father_name}
            onChange={(event) =>
              updateValue(
                "father_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Mother name"
          required
        >
          <input
            required
            disabled={disabled}
            type="text"
            placeholder="Enter mother name"
            value={values.mother_name}
            onChange={(event) =>
              updateValue(
                "mother_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Birth date"
          required
        >
          <DatePicker
            value={values.birth_date}
            onChange={(value) =>
              updateValue("birth_date", value)
            }
            placeholder="Select birth date"
            disabled={disabled}
          />
        </StaffFormField>

        <StaffFormField
          label="Birth place"
          required
        >
          <input
            required
            disabled={disabled}
            type="text"
            placeholder="Enter birth place"
            value={values.birth_place}
            onChange={(event) =>
              updateValue(
                "birth_place",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField label="Gender">
          <Select
            value={values.gender}
            disabled={disabled}
            onValueChange={(value) =>
              updateValue("gender", value as StaffGender)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </StaffFormField>

        <StaffFormField label="Nationality">
          <Select
            value={values.nationality ?? "syrian"}
            disabled={disabled}
            onValueChange={(value) =>
              updateValue("nationality", value as StaffNationality)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="syrian">Syrian</SelectItem>
              <SelectItem value="lebanese">Lebanese</SelectItem>
              <SelectItem value="palestinian">Palestinian</SelectItem>
              <SelectItem value="jordanian">Jordanian</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </StaffFormField>

                <StaffFormField
          label="Address"
          required
          className="md:col-span-2"
        >
          <textarea
            required
            disabled={disabled}
            autoComplete="street-address"
            placeholder="Enter the complete address"
            value={values.address}
            onChange={(event) =>
              updateValue(
                "address",
                event.target.value,
              )
            }
            className={[
              fieldClassName,
              "min-h-28 resize-y py-3",
            ].join(" ")}
          />
        </StaffFormField>
      </div>
    </StaffSection>
  );
}