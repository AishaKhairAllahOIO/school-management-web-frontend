import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useStaffDetails,
  useUpdateStaffEmployment,
  useUpdateStaffPersonal,
} from "../hooks/useStaff";

import type {
  StaffDegree,
  StaffGender,
  StaffNationality,
  StaffRole,
  StaffServiceType,
  UpdateStaffEmploymentValues,
  UpdateStaffPersonalValues,
} from "../types/staff.types";

type StaffEditPageProps = {
  role: StaffRole;
};

const fieldClassName =
  "h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

const emptyPersonal: UpdateStaffPersonalValues = {
  first_name: "",
  last_name: "",
  father_name: "",
  mother_name: "",

  phone_number: "",
  email: "",

  birth_date: "",
  birth_place: "",

  gender: "male",
  nationality: "syrian",

  address: "",
};

const emptyEmployment: UpdateStaffEmploymentValues = {
  degree: "none",
  specialization: "",
  university: "",

  graduation_year: null,
  hire_date: "",
  experience_years: null,

  service_type: null,
};

export function StaffEditPage({
  role,
}: StaffEditPageProps) {
  const navigate = useNavigate();

  const { staffId } = useParams<{
    staffId: string;
  }>();

  const config =
    staffSectionConfigs[role];

  const staffQuery =
    useStaffDetails(staffId);

  const personalMutation =
    useUpdateStaffPersonal(role);

  const employmentMutation =
    useUpdateStaffEmployment(role);

  const [personal, setPersonal] =
    useState<UpdateStaffPersonalValues>(
      emptyPersonal,
    );

  const [employment, setEmployment] =
    useState<UpdateStaffEmploymentValues>(
      emptyEmployment,
    );

  const [formError, setFormError] =
    useState<string | null>(null);

  useEffect(() => {
    const staff = staffQuery.data;

    if (!staff) {
      return;
    }

    setPersonal({
      first_name: staff.firstName,
      last_name: staff.lastName,

      father_name: staff.fatherName,
      mother_name: staff.motherName,

      phone_number: staff.phoneNumber,
      email: staff.email ?? "",

      birth_date: staff.birthDate ?? "",
      birth_place: staff.birthPlace ?? "",

      gender: staff.gender ?? "male",
      nationality:
        staff.nationality ?? "syrian",

      address: staff.address ?? "",
    });

    setEmployment({
      degree: staff.degree ?? "none",

      specialization:
        staff.specialization ?? "",

      university:
        staff.university ?? "",

      graduation_year:
        staff.graduationYear,

      hire_date:
        staff.hireDate ?? "",

      experience_years:
        staff.experienceYears,

      service_type:
        staff.serviceType,
    });
  }, [staffQuery.data]);

  function updatePersonal<
    K extends keyof UpdateStaffPersonalValues,
  >(
    key: K,
    value: UpdateStaffPersonalValues[K],
  ) {
    setPersonal((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateEmployment<
    K extends keyof UpdateStaffEmploymentValues,
  >(
    key: K,
    value: UpdateStaffEmploymentValues[K],
  ) {
    setEmployment((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!staffId) {
      return;
    }

    setFormError(null);

    try {
      await Promise.all([
        personalMutation.mutateAsync({
          staffId,
          values: personal,
        }),

        employmentMutation.mutateAsync({
          staffId,
          values: employment,
        }),
      ]);

      navigate(
        `${config.listPath}/${staffId}`,
      );
    } catch {
      setFormError(
        "The changes could not be saved. Check the entered information and try again.",
      );
    }
  }

  if (staffQuery.isPending) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
        Loading staff information...
      </div>
    );
  }

  if (
    !staffId ||
    staffQuery.isError ||
    !staffQuery.data
  ) {
    return (
      <div className="rounded-[2rem] border border-destructive/20 bg-card p-8 text-center">
        <h1 className="text-xl font-black">
          Staff information unavailable
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate(config.listPath)
          }
          className="primary-gradient mt-5 rounded-2xl px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          Back to {config.pluralLabel}
        </button>
      </div>
    );
  }

  const isSaving =
    personalMutation.isPending ||
    employmentMutation.isPending;

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      <header className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                `${config.listPath}/${staffId}`,
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </button>

          <h1 className="text-2xl font-black">
            Edit {config.singularLabel}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Update personal and employment
            information.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="primary-gradient inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {isSaving
            ? "Saving..."
            : "Save changes"}
        </button>
      </header>

      <EditSection title="Personal information">
        <div className="grid gap-5 md:grid-cols-2">
          <EditField label="First name">
            <input
              required
              value={personal.first_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "first_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Last name">
            <input
              required
              value={personal.last_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "last_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Father name">
            <input
              value={personal.father_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "father_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Mother name">
            <input
              value={personal.mother_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "mother_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Birth date">
            <input
              type="date"
              value={personal.birth_date ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "birth_date",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Birth place">
            <input
              value={personal.birth_place ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "birth_place",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Gender">
            <select
              value={personal.gender ?? "male"}
              onChange={(event) =>
                updatePersonal(
                  "gender",
                  event.target
                    .value as StaffGender,
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
          </EditField>

          <EditField label="Nationality">
            <select
              value={
                personal.nationality ??
                "syrian"
              }
              onChange={(event) =>
                updatePersonal(
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
          </EditField>

          <EditField label="Phone number">
            <input
              required
              dir="ltr"
              value={
                personal.phone_number ?? ""
              }
              onChange={(event) =>
                updatePersonal(
                  "phone_number",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Email">
            <input
              type="email"
              dir="ltr"
              value={personal.email ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "email",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField
            label="Address"
            className="md:col-span-2"
          >
            <textarea
              value={personal.address ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "address",
                  event.target.value,
                )
              }
              className={`${fieldClassName} min-h-28 resize-y py-3`}
            />
          </EditField>
        </div>
      </EditSection>

      <EditSection title="Employment information">
        <div className="grid gap-5 md:grid-cols-2">
          <EditField label="Degree">
            <select
              value={employment.degree ?? "none"}
              onChange={(event) =>
                updateEmployment(
                  "degree",
                  event.target
                    .value as StaffDegree,
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
          </EditField>

          <EditField label="Specialization">
            <input
              value={
                employment.specialization ??
                ""
              }
              onChange={(event) =>
                updateEmployment(
                  "specialization",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="University">
            <input
              value={
                employment.university ?? ""
              }
              onChange={(event) =>
                updateEmployment(
                  "university",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Graduation year">
            <input
              type="number"
              min="1950"
              max="2100"
              value={
                employment.graduation_year ??
                ""
              }
              onChange={(event) =>
                updateEmployment(
                  "graduation_year",
                  event.target.value
                    ? Number(event.target.value)
                    : null,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Hire date">
            <input
              type="date"
              value={
                employment.hire_date ?? ""
              }
              onChange={(event) =>
                updateEmployment(
                  "hire_date",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          <EditField label="Experience years">
            <input
              type="number"
              min="0"
              value={
                employment.experience_years ??
                ""
              }
              onChange={(event) =>
                updateEmployment(
                  "experience_years",
                  event.target.value
                    ? Number(event.target.value)
                    : null,
                )
              }
              className={fieldClassName}
            />
          </EditField>

          {role === "service_staff" ? (
            <EditField label="Service type">
              <select
                value={
                  employment.service_type ??
                  ""
                }
                onChange={(event) =>
                  updateEmployment(
                    "service_type",
                    event.target
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
            </EditField>
          ) : null}
        </div>
      </EditSection>

      {formError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm font-semibold text-destructive">
          {formError}
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(
              `${config.listPath}/${staffId}`,
            )
          }
          className="h-12 rounded-2xl border border-border bg-card px-6 text-sm font-bold hover:bg-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="primary-gradient inline-flex h-12 items-center gap-2 rounded-2xl px-6 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {isSaving
            ? "Saving..."
            : "Save all changes"}
        </button>
      </div>
    </form>
  );
}

function EditSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-black">
        {title}
      </h2>

      {children}
    </section>
  );
}

function EditField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`space-y-2 ${className ?? ""}`}
    >
      <span className="text-sm font-bold">
        {label}
      </span>

      {children}
    </label>
  );
}