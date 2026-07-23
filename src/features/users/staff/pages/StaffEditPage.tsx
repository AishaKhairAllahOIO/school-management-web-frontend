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
  Save,
  Sparkles,
  Trash2,
  UserRound,
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

type EditablePersonalValues =
  UpdateStaffPersonalValues & {
    photo_url?: File | null;
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

const emptyPersonal: EditablePersonalValues = {
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
    useState<EditablePersonalValues>(
      emptyPersonal,
    );

  const [employment, setEmployment] =
    useState<UpdateStaffEmploymentValues>(
      emptyEmployment,
    );

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [currentPhotoUrl, setCurrentPhotoUrl] =
    useState<string | null>(null);

  const [removeCurrentPhoto, setRemoveCurrentPhoto] =
    useState(false);

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
      photo_url: null,
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

    setCurrentPhotoUrl(
      staff.photoUrl ?? null,
    );

    setRemoveCurrentPhoto(false);
  }, [staffQuery.data]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function updatePersonal<
    K extends keyof EditablePersonalValues,
  >(
    key: K,
    value: EditablePersonalValues[K],
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

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    updatePersonal("photo_url", file);
    setPhotoPreview(
      URL.createObjectURL(file),
    );
    setRemoveCurrentPhoto(false);

    event.target.value = "";
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview(null);
    setCurrentPhotoUrl(null);
    setRemoveCurrentPhoto(true);
    updatePersonal("photo_url", null);
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!staffId) {
      return;
    }

    setFormError(null);

    const personalValues: EditablePersonalValues = {
      ...personal,
    };

    if (
      !personal.photo_url &&
      !removeCurrentPhoto
    ) {
      delete personalValues.photo_url;
    }

    try {
      await Promise.all([
        personalMutation.mutateAsync({
          staffId,
          values: personalValues,
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
    return <EditPageSkeleton />;
  }

  if (
    !staffId ||
    staffQuery.isError ||
    !staffQuery.data
  ) {
    return (
      <div className="rounded-[26px] border border-destructive/20 bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <h1 className="text-xl font-semibold text-foreground">
          Staff information unavailable
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The requested staff profile could not be loaded.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(config.listPath)
          }
          className="primary-gradient mt-5 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-primary-foreground"
        >
          Back to {config.pluralLabel}
        </button>
      </div>
    );
  }

  const staff = staffQuery.data;

  const isSaving =
    personalMutation.isPending ||
    employmentMutation.isPending;

  const visiblePhoto =
    photoPreview ??
    (!removeCurrentPhoto
      ? currentPhotoUrl
      : null);

  return (
    <form
      onSubmit={submit}
      className="space-y-5 pb-28"
    >
      <EditHero
        singularLabel={config.singularLabel}
        fullName={staff.fullName}
        photoUrl={visiblePhoto}
        onBack={() =>
          navigate(
            `${config.listPath}/${staffId}`,
          )
        }
      />

      <FormSection
        eyebrow="Profile"
        title="Profile photo"
        description="Replace the current photo or remove it from the profile."
        icon={
          <Camera className="h-5 w-5" />
        }
      >
        <PhotoEditor
          photoUrl={visiblePhoto}
          onChange={handlePhotoChange}
          onRemove={removePhoto}
        />
      </FormSection>

      <FormSection
        eyebrow="Identity"
        title="Personal information"
        description="Update legal identity and contact information."
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
              value={personal.first_name ?? ""}
              onChange={(event) =>
                updatePersonal(
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
              value={personal.last_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "last_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </FormField>

          <FormField label="Father name">
            <input
              placeholder="Enter father name"
              value={personal.father_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "father_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </FormField>

          <FormField label="Mother name">
            <input
              placeholder="Enter mother name"
              value={personal.mother_name ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "mother_name",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </FormField>

          <FormField label="Birth date">
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
          </FormField>

          <FormField label="Birth place">
            <input
              placeholder="Enter birth place"
              value={personal.birth_place ?? ""}
              onChange={(event) =>
                updatePersonal(
                  "birth_place",
                  event.target.value,
                )
              }
              className={fieldClassName}
            />
          </FormField>

          <FormField label="Gender">
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
          </FormField>

          <FormField label="Nationality">
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
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="name@example.com"
              value={personal.email ?? ""}
              onChange={(event) =>
                updatePersonal(
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
              autoComplete="street-address"
              placeholder="Enter the complete address"
              value={personal.address ?? ""}
              onChange={(event) =>
                updatePersonal(
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
        description="Update education, experience and employment details."
        icon={
          <BriefcaseBusiness className="h-5 w-5" />
        }
      >
        <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
          <FormField label="Degree">
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
          </FormField>

          <FormField label="Specialization">
            <input
              placeholder="Enter specialization"
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
          </FormField>

          <FormField label="University">
            <input
              placeholder="Enter university"
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
          </FormField>

          <FormField label="Graduation year">
            <input
              type="number"
              min="1950"
              max="2100"
              placeholder="e.g. 2022"
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
          </FormField>

          <FormField label="Hire date">
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
          </FormField>

          <FormField label="Experience years">
            <input
              type="number"
              min="0"
              placeholder="0"
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
          </FormField>

          {role === "service_staff" ? (
            <FormField label="Service type">
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
            </FormField>
          ) : null}
        </div>
      </FormSection>

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
            Save to apply the updated staff information.
          </p>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `${config.listPath}/${staffId}`,
                )
              }
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="primary-gradient inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {isSaving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </div>
      </footer>
    </form>
  );
}

function EditHero({
  singularLabel,
  fullName,
  photoUrl,
  onBack,
}: {
  singularLabel: string;
  fullName: string;
  photoUrl: string | null;
  onBack: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[var(--shadow-floating)]">
      <div className="soft-purple-gradient absolute inset-0 opacity-80" />

      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </button>

          <div className="mt-5 flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[20px] border border-card/80 bg-card shadow-[var(--shadow-card)]">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/[0.07] text-primary">
                  <UserRound className="h-7 w-7" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                <Sparkles className="h-3 w-3" />
                Edit profile
              </span>

              <h1 className="mt-3 truncate text-3xl font-semibold tracking-[-0.045em] text-foreground">
                {fullName}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Update {singularLabel.toLowerCase()} information and profile photo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoEditor({
  photoUrl,
  onChange,
  onRemove,
}: {
  photoUrl: string | null;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-[26px] border border-border/70 bg-muted/30 shadow-[var(--shadow-card)] lg:mx-0">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Staff profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/[0.07] text-primary">
              <Camera className="h-6 w-6" />
            </span>

            <span className="text-xs font-medium">
              No profile photo
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
              Change profile photo
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Select a new PNG, JPG or WEBP image. It will be saved with the rest of the personal information.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-[var(--shadow-card)] transition hover:border-primary/20 hover:bg-primary/[0.025]">
            <Camera className="h-4 w-4" />
            {photoUrl
              ? "Replace photo"
              : "Choose photo"}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onChange}
              className="hidden"
            />
          </label>

          {photoUrl ? (
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
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
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
    </label>
  );
}

function EditPageSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-52 animate-pulse rounded-[28px] border border-border bg-muted/40" />

      <div className="h-64 animate-pulse rounded-[26px] border border-border bg-muted/30" />

      <div className="h-[34rem] animate-pulse rounded-[26px] border border-border bg-muted/30" />
    </div>
  );
}
