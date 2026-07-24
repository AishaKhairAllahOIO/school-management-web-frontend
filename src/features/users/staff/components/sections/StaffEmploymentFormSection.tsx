import {
  BriefcaseBusiness,
} from "lucide-react";

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
  StaffDegree,
  StaffServiceType,
} from "../../types/staff.types";


type Props = {
  values: RegisterStaffValues;

  disabled?: boolean;

  color?: StaffSectionColor;

  isServiceStaff: boolean;

  updateValue: <
    K extends keyof RegisterStaffValues,
  >(
    key: K,
    value: RegisterStaffValues[K],
  ) => void;
};

export function StaffEmploymentFormSection({
  values,
  disabled = false,
  color = defaultStaffSectionColor,
  isServiceStaff,
  updateValue,
}: Props) {
  const fieldClassName = getStaffFieldClassName(color);

  return (
    <StaffSection
      eyebrow="Professional record"
      title="Employment information"
      description="Add education, experience and school employment details."
      icon={
        <BriefcaseBusiness className="h-5 w-5" />
      }
      color={color}
    >
      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">

        <StaffFormField label="Degree">
          <select
            disabled={disabled}
            value={values.degree ?? "none"}
            onChange={(e) =>
              updateValue(
                "degree",
                e.target.value as StaffDegree,
              )
            }
            className={fieldClassName}
          >
            <option value="none">
              None
            </option>

            <option value="student">
              Student
            </option>

            <option value="diploma">
              Diploma
            </option>

            <option value="bachelor">
              Bachelor
            </option>

            <option value="master">
              Master
            </option>

            <option value="phd">
              PhD
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </StaffFormField>

        <StaffFormField
          label="Specialization"
        >
          <input
            disabled={disabled}
            placeholder="Enter specialization"
            value={
              values.specialization ??
              ""
            }
            onChange={(e) =>
              updateValue(
                "specialization",
                e.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="University"
        >
          <input
            disabled={disabled}
            placeholder="Enter university"
            value={
              values.university ?? ""
            }
            onChange={(e) =>
              updateValue(
                "university",
                e.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Graduation year"
        >
          <input
            disabled={disabled}
            type="number"
            min={1950}
            max={2100}
            placeholder="e.g. 2022"
            value={
              values.graduation_year ??
              ""
            }
            onChange={(e) =>
              updateValue(
                "graduation_year",
                e.target.value
                  ? Number(
                      e.target.value,
                    )
                  : null,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Hire date"
          required
        >
          <input
            required
            disabled={disabled}
            type="date"
            value={values.hire_date}
            onChange={(e) =>
              updateValue(
                "hire_date",
                e.target.value,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        <StaffFormField
          label="Experience years"
        >
          <input
            disabled={disabled}
            type="number"
            min={0}
            placeholder="0"
            value={
              values.experience_years ??
              ""
            }
            onChange={(e) =>
              updateValue(
                "experience_years",
                e.target.value
                  ? Number(
                      e.target.value,
                    )
                  : null,
              )
            }
            className={fieldClassName}
          />
        </StaffFormField>

        {isServiceStaff && (
          <StaffFormField
            label="Service type"
            required
          >
            <select
              required
              disabled={disabled}
              value={
                values.service_type ??
                ""
              }
              onChange={(e) =>
                updateValue(
                  "service_type",
                  e.target
                    .value as StaffServiceType,
                )
              }
              className={fieldClassName}
            >
              <option value="">
                Select service
              </option>

              <option value="cleaner">
                Cleaner
              </option>

              <option value="guard">
                Guard
              </option>

              <option value="driver">
                Driver
              </option>

              <option value="maintenance">
                Maintenance
              </option>

              <option value="kitchen_staff">
                Kitchen staff
              </option>
            </select>
          </StaffFormField>
        )}

      </div>
    </StaffSection>
  );
}