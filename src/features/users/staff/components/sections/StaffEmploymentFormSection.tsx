import {
  BriefcaseBusiness,
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
          <Select
            value={values.degree ?? "none"}
            disabled={disabled}
            onValueChange={(value) =>
              updateValue("degree", value as StaffDegree)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelor">Bachelor</SelectItem>
              <SelectItem value="master">Master</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
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
          <DatePicker
            value={values.hire_date}
            onChange={(value) =>
              updateValue("hire_date", value)
            }
            placeholder="Select hire date"
            disabled={disabled}
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
            <Select
              value={values.service_type ?? "none"}
              disabled={disabled}
              onValueChange={(value) =>
                updateValue(
                  "service_type",
                  value === "none" ? null : (value as StaffServiceType),
                )
              }
            >
              <SelectTrigger className="h-12 rounded-[15px]">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select service</SelectItem>
                <SelectItem value="cleaner">Cleaner</SelectItem>
                <SelectItem value="guard">Guard</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="kitchen_staff">Kitchen staff</SelectItem>
              </SelectContent>
            </Select>
          </StaffFormField>
        )}

      </div>
    </StaffSection>
  );
}