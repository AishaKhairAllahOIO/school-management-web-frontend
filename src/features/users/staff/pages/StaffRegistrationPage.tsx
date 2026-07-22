import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Camera,
  Save,
  UserPlus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useRegisterStaff,
} from "../hooks/useStaff";

import type {
  RegisterStaffValues,
  StaffDegree,
  StaffGender,
  StaffNationality,
  StaffRole,
  StaffServiceType,
} from "../types/staff.types";

type StaffRegistrationPageProps = {
  role: StaffRole;
};

const fieldClassName =
  "h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

const initialValues: RegisterStaffValues = {
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
  photo_url: null,

  degree: "none",
  specialization: "",
  university: "",
  graduation_year: null,

  hire_date: "",
  experience_years: null,

  password: "",
  service_type: null,
};

export function StaffRegistrationPage({
  role,
}: StaffRegistrationPageProps) {
  const navigate = useNavigate();

  const config =
    staffSectionConfigs[role];

  const registerMutation =
    useRegisterStaff(role);

  const [values, setValues] =
    useState<RegisterStaffValues>(
      initialValues,
    );

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function updateValue<
    K extends keyof RegisterStaffValues,
  >(
    key: K,
    value: RegisterStaffValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    updateValue("photo_url", file);

    setPhotoPreview(
      file
        ? URL.createObjectURL(file)
        : null,
    );
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setFormError(null);

    try {
      const createdStaff =
        await registerMutation.mutateAsync(
          values,
        );

      navigate(
        `${config.listPath}/${createdStaff.id}`,
      );
    } catch {
      setFormError(
        `The ${config.singularLabel.toLowerCase()} could not be created. Check the entered information and try again.`,
      );
    }
  }

  const requiresPassword =
    role === "adviser" ||
    role === "secretary";

  const isServiceStaff =
    role === "service_staff";

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(config.listPath)
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {config.pluralLabel}
          </button>

          <h1 className="text-2xl font-black text-foreground">
            Add {config.singularLabel}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The system will automatically register
            this user with the{" "}
            <strong>{config.singularLabel}</strong>{" "}
            role.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserPlus className="h-6 w-6" />
        </div>
      </header>

      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <FormSection
          title="Profile photo"
          description="Upload an optional profile photo."
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-secondary">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Staff preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-border bg-card px-5 text-sm font-bold transition hover:bg-secondary">
              Choose photo

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </FormSection>

        <FormSection
          title="Personal information"
          description="Basic identity and contact details."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="First name">
              <input
                required
                value={values.first_name}
                onChange={(event) =>
                  updateValue(
                    "first_name",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Last name">
              <input
                required
                value={values.last_name}
                onChange={(event) =>
                  updateValue(
                    "last_name",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Father name">
              <input
                required
                value={values.father_name}
                onChange={(event) =>
                  updateValue(
                    "father_name",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Mother name">
              <input
                required
                value={values.mother_name}
                onChange={(event) =>
                  updateValue(
                    "mother_name",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Birth date">
              <input
                required
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
            </FormField>

            <FormField label="Birth place">
              <input
                required
                value={values.birth_place}
                onChange={(event) =>
                  updateValue(
                    "birth_place",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Gender">
              <select
                value={values.gender}
                onChange={(event) =>
                  updateValue(
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
            </FormField>

            <FormField label="Nationality">
              <select
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
            </FormField>

            <FormField label="Phone number">
              <input
                required
                dir="ltr"
                value={values.phone_number}
                onChange={(event) =>
                  updateValue(
                    "phone_number",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                dir="ltr"
                value={values.email ?? ""}
                onChange={(event) =>
                  updateValue(
                    "email",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField
              label="Address"
              className="md:col-span-2"
            >
              <textarea
                required
                value={values.address}
                onChange={(event) =>
                  updateValue(
                    "address",
                    event.target.value,
                  )
                }
                className={`${fieldClassName} min-h-28 resize-y py-3`}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Employment information"
          description="Professional and employment details."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Degree">
              <select
                value={values.degree ?? "none"}
                onChange={(event) =>
                  updateValue(
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
            </FormField>

            <FormField label="Specialization">
              <input
                value={
                  values.specialization ??
                  ""
                }
                onChange={(event) =>
                  updateValue(
                    "specialization",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="University">
              <input
                value={values.university ?? ""}
                onChange={(event) =>
                  updateValue(
                    "university",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Graduation year">
              <input
                type="number"
                min="1950"
                max="2100"
                value={
                  values.graduation_year ??
                  ""
                }
                onChange={(event) =>
                  updateValue(
                    "graduation_year",
                    event.target.value
                      ? Number(
                          event.target.value,
                        )
                      : null,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Hire date">
              <input
                required
                type="date"
                value={values.hire_date}
                onChange={(event) =>
                  updateValue(
                    "hire_date",
                    event.target.value,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            <FormField label="Experience years">
              <input
                type="number"
                min="0"
                value={
                  values.experience_years ??
                  ""
                }
                onChange={(event) =>
                  updateValue(
                    "experience_years",
                    event.target.value
                      ? Number(
                          event.target.value,
                        )
                      : null,
                  )
                }
                className={fieldClassName}
              />
            </FormField>

            {isServiceStaff ? (
              <FormField label="Service type">
                <select
                  required
                  value={
                    values.service_type ??
                    ""
                  }
                  onChange={(event) =>
                    updateValue(
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
              </FormField>
            ) : null}

            {requiresPassword ? (
              <FormField label="Password">
                <input
                  required
                  type="password"
                  minLength={8}
                  value={values.password ?? ""}
                  onChange={(event) =>
                    updateValue(
                      "password",
                      event.target.value,
                    )
                  }
                  className={fieldClassName}
                />
              </FormField>
            ) : null}
          </div>
        </FormSection>

        {formError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm font-semibold text-destructive">
            {formError}
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(config.listPath)
            }
            className="h-12 rounded-2xl border border-border bg-card px-6 text-sm font-bold transition hover:bg-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              registerMutation.isPending
            }
            className="primary-gradient inline-flex h-12 items-center gap-2 rounded-2xl px-6 text-sm font-bold text-primary-foreground shadow-[var(--shadow-auth-button)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {registerMutation.isPending
              ? "Creating..."
              : `Create ${config.singularLabel}`}
          </button>
        </div>
      </form>
    </section>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-black text-foreground">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function FormField({
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
      <span className="text-sm font-bold text-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}