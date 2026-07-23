import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Camera,
  ImagePlus,
  KeyRound,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  UserRound,
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

const fieldClassName = [
  "h-12 w-full rounded-[16px]",
  "border border-border/70 bg-muted/25 px-4",
  "text-sm font-normal text-foreground",
  "outline-none transition duration-200",
  "placeholder:text-muted-foreground/70",
  "hover:border-primary/20 hover:bg-card",
  "focus:border-primary/35 focus:bg-card",
  "focus:ring-4 focus:ring-primary/[0.08]",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

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

    event.target.value = "";
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    updateValue("photo_url", null);
    setPhotoPreview(null);
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

  const isSubmitting =
    registerMutation.isPending;

  return (
    <form
      onSubmit={submit}
      className="space-y-5 pb-28"
    >
      <RegistrationHero
        pluralLabel={config.pluralLabel}
        singularLabel={config.singularLabel}
        onBack={() =>
          navigate(config.listPath)
        }
      />

      <FormSection
        eyebrow="Profile"
        title="Profile photo"
        description="Add a clear photo to make the staff profile easier to recognize."
        icon={
          <Camera className="h-5 w-5" />
        }
      >
        <PhotoUploader
          photoPreview={photoPreview}
          onChange={handlePhotoChange}
          onRemove={removePhoto}
        />
      </FormSection>

      <FormSection
        eyebrow="Identity"
        title="Personal information"
        description="Enter the staff member's legal identity and primary contact details."
        icon={
          <UserRound className="h-5 w-5" />
        }
      >
        <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
          <FormField
            label="First name"
            required
          >
            <input
              required
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
          </FormField>

          <FormField
            label="Last name"
            required
          >
            <input
              required
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
          </FormField>

          <FormField
            label="Father name"
            required
          >
            <input
              required
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
          </FormField>

          <FormField
            label="Mother name"
            required
          >
            <input
              required
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
          </FormField>

          <FormField
            label="Birth date"
            required
          >
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

          <FormField
            label="Birth place"
            required
          >
            <input
              required
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

          <FormField
            label="Phone number"
            required
          >
            <input
              required
              dir="ltr"
              type="tel"
              autoComplete="tel"
              placeholder="+963..."
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
              autoComplete="email"
              placeholder="name@example.com"
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
            required
            className="md:col-span-2"
          >
            <textarea
              required
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
          </FormField>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Professional record"
        title="Employment information"
        description="Add education, experience and school employment details."
        icon={
          <BriefcaseBusiness className="h-5 w-5" />
        }
      >
        <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
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
              placeholder="Enter specialization"
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
              placeholder="Enter university"
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
              placeholder="e.g. 2022"
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

          <FormField
            label="Hire date"
            required
          >
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
              placeholder="0"
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
            <FormField
              label="Service type"
              required
            >
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
        </div>
      </FormSection>

      {requiresPassword ? (
        <FormSection
          eyebrow="Security"
          title="Account access"
          description="Create the password this staff member will use to sign in."
          icon={
            <KeyRound className="h-5 w-5" />
          }
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
            <FormField
              label="Password"
              required
              helper="Use at least 8 characters."
            >
              <input
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter a secure password"
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

            <article className="flex items-start gap-3 rounded-[18px] border border-primary/10 bg-primary/[0.035] p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.08] text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Secure account
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  The password is required for roles that can access the management system.
                </p>
              </div>
            </article>
          </div>
        </FormSection>
      ) : null}

      {formError ? (
        <div
          role="alert"
          className="rounded-[18px] border border-destructive/20 bg-destructive/[0.05] px-5 py-4 text-sm font-medium text-destructive"
        >
          {formError}
        </div>
      ) : null}

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/90 px-4 py-3 backdrop-blur-xl lg:left-[var(--sidebar-width,0px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="hidden text-xs text-muted-foreground sm:block">
            Review the information before creating the profile.
          </p>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(config.listPath)
              }
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-gradient inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {isSubmitting
                ? "Creating..."
                : `Create ${config.singularLabel}`}
            </button>
          </div>
        </div>
      </footer>
    </form>
  );
}

function RegistrationHero({
  pluralLabel,
  singularLabel,
  onBack,
}: {
  pluralLabel: string;
  singularLabel: string;
  onBack: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[var(--shadow-floating)]">
      <div className="soft-purple-gradient absolute inset-0 opacity-80" />

      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-primary/[0.07] blur-3xl" />

      <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {pluralLabel}
          </button>

          <div className="mt-5 flex items-start gap-4">
            <span className="primary-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] text-primary-foreground shadow-[var(--shadow-auth-button)]">
              <UserPlus className="h-6 w-6" />
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="h-3 w-3" />
                  New profile
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground">
                Add {singularLabel}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Create a complete staff profile and add personal, professional and account information in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-card/80 bg-card/65 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm lg:w-72">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
            Assigned role
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/[0.08] text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                {singularLabel}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Assigned automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoUploader({
  photoPreview,
  onChange,
  onRemove,
}: {
  photoPreview: string | null;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-[26px] border border-border/70 bg-muted/30 shadow-[var(--shadow-card)] lg:mx-0">
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Staff profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/[0.07] text-primary">
              <Camera className="h-6 w-6" />
            </span>

            <span className="text-xs font-medium">
              No photo selected
            </span>
          </div>
        )}
      </div>

      <div className="flex min-h-40 flex-col justify-center rounded-[22px] border border-dashed border-border bg-muted/20 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.07] text-primary">
            <ImagePlus className="h-5 w-5" />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Upload profile photo
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              PNG, JPG or WEBP. Use a clear square image for the best result.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-[var(--shadow-card)] transition hover:border-primary/20 hover:bg-primary/[0.025]">
            <Camera className="h-4 w-4" />
            {photoPreview
              ? "Replace photo"
              : "Choose photo"}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onChange}
              className="hidden"
            />
          </label>

          {photoPreview ? (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-destructive/15 bg-destructive/[0.04] px-4 text-xs font-semibold text-destructive transition hover:bg-destructive/[0.08]"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FormSection({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <header className="flex items-start gap-3 border-b border-border/60 bg-muted/25 px-5 py-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">
          {icon}
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>

          <p className="mt-1 text-[13px] font-normal text-muted-foreground">
            {description}
          </p>
        </div>
      </header>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function FormField({
  label,
  required = false,
  helper,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={[
        "block space-y-2",
        className,
      ].join(" ")}
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {label}

        {required ? (
          <span className="text-destructive">
            *
          </span>
        ) : null}
      </span>

      {children}

      {helper ? (
        <span className="block text-[11px] leading-5 text-muted-foreground">
          {helper}
        </span>
      ) : null}
    </label>
  );
}
