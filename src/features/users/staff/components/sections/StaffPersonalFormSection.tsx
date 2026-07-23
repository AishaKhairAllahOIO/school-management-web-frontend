import {
  UserRound,
} from "lucide-react";

import {
  StaffFormField,
} from "../fields/StaffFormField";

import {
  StaffSection,
} from "../layout/StaffSection";

import type {
  RegisterStaffValues,
  StaffGender,
  StaffNationality,
} from "../../types/staff.types";

const fieldClassName = [
  "h-12 w-full rounded-[16px]",
  "border border-border/70 bg-muted/25 px-4",
  "text-sm font-normal text-foreground",
  "outline-none transition duration-200",
  "placeholder:text-muted-foreground/70",
  "hover:border-primary/20 hover:bg-card",
  "focus:border-primary/35 focus:bg-card",
  "focus:ring-4 focus:ring-primary/[0.08]",
  "disabled:cursor-not-allowed",
  "disabled:opacity-60",
].join(" ");

type StaffPersonalFormSectionProps = {
  values: RegisterStaffValues;

  disabled?: boolean;

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
  updateValue,
}: StaffPersonalFormSectionProps) {
  return (
    <StaffSection
      eyebrow="Identity"
      title="Personal information"
      description="Enter the staff member's legal identity and personal details."
      icon={
        <UserRound className="h-5 w-5" />
      }
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
          <input
            required
            disabled={disabled}
            type="date"
            value={values.birth_date}
            onChange={(event) =>
              updateValue(
                "birth_date",
                event.target.value,
              )
            }
            className={fieldClassName}
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
          <select
            disabled={disabled}
            value={values.gender}
            onChange={(event) =>
              updateValue(
                "gender",
                event.target.value as StaffGender,
              )
            }
            className={fieldClassName}
          >
            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>
          </select>
        </StaffFormField>

        <StaffFormField label="Nationality">
          <select
            disabled={disabled}
            value={
              values.nationality ??
              "syrian"
            }
            onChange={(event) =>
              updateValue(
                "nationality",
                event.target
                  .value as StaffNationality,
              )
            }
            className={fieldClassName}
          >
            <option value="syrian">
              Syrian
            </option>

            <option value="lebanese">
              Lebanese
            </option>

            <option value="palestinian">
              Palestinian
            </option>

            <option value="jordanian">
              Jordanian
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </StaffFormField>
      </div>
    </StaffSection>
  );
}