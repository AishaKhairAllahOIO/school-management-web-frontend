import {
  Building2,
  Check,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type InputHTMLAttributes } from "react";
import { useForm, useWatch, type Path } from "react-hook-form";

import { GeneralSettingsDangerZone } from "./GeneralSettingsDangerZone";
import { SchoolGallery } from "./SchoolGallery";
import { SchoolLocationMap } from "./SchoolLocationMap";
import { SchoolLogoUpload } from "./SchoolLogoUpload";

import { useUpdateGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";
import {
  generalSettingsSchema,
  type GeneralSettingsFormValues,
} from "@/features/settings/general/schemas/general-settings.schema";
import type { GeneralSettings } from "@/features/settings/general/types/general-settings.types";
import { getAxiosValidationErrors } from "@/services/axios/axiosError";

type GeneralSettingsFormProps = {
  initialData: GeneralSettings;
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  icon?: typeof Building2;
  error?: string;
};

function TextInput({
  label,
  required,
  icon: Icon,
  error,
  className,
  ...props
}: TextInputProps) {
  return (
    <label className={["block min-w-0", className ?? ""].join(" ")}>
      <span className="mb-1.5 block text-[12px] font-semibold text-foreground/80">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>

      <div className="relative">
        {Icon ? (
          <Icon
            size={15}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75"
          />
        ) : null}

        <input
          {...props}
          className={[
            "h-10 w-full rounded-[12px] border border-border/80 bg-background",
            "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
            "text-[14px] font-normal text-foreground outline-none transition duration-200",
            "placeholder:font-normal placeholder:text-muted-foreground/80",
            "hover:border-border focus:border-primary/55 focus:ring-4 focus:ring-primary/[0.10]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            Icon ? "pl-10 pr-3.5" : "px-3.5",
            error
              ? "border-destructive/35 bg-destructive/[0.025] focus:border-destructive/40 focus:ring-destructive/[0.07]"
              : "",
          ].join(" ")}
        />
      </div>

      {error ? (
        <p className="mt-1.5 px-1 text-[11px] font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Building2;
}) {
  return (
    <div className="mb-4 flex items-start gap-2.5 pr-10">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-primary/[0.08] text-primary">
        <Icon size={16} strokeWidth={1.75} />
      </span>

      <div className="min-w-0 pt-0.5">
        <h2 className="text-[15px] font-semibold text-foreground">
          {title}
        </h2>

        <p className="mt-0.5 max-w-xl text-[12px] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingsCard({
  children,
  className,
  completed = false,
  completedLabel = "Section completed",
}: {
  children: React.ReactNode;
  className?: string;
  completed?: boolean;
  completedLabel?: string;
}) {
  return (
    <section
      className={[
        "relative h-full min-h-[360px] rounded-[20px] border border-border/45 bg-card p-4",
        "shadow-[0_8px_28px_rgba(30,20,70,0.035)] transition duration-300",
        "hover:border-border/65 hover:shadow-[0_12px_34px_rgba(30,20,70,0.055)]",
        className ?? "",
      ].join(" ")}
    >
      {completed ? (
        <span
          className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 sm:right-5 sm:top-5"
          title={completedLabel}
          aria-label={completedLabel}
        >
          <Check size={15} strokeWidth={2.5} />
        </span>
      ) : null}

      {children}
    </section>
  );
}

function getDefaultValues(
  data: GeneralSettings,
): GeneralSettingsFormValues {
  return {
    schoolName: data.schoolName ?? "",
    shortName: data.shortName ?? "",
    description: data.description ?? "",
    phoneNumber: data.phoneNumber ?? "",
    emergencyPhoneNumber: data.emergencyPhoneNumber ?? "",
    email: data.email ?? "",
    website: data.website ?? "",
    address: data.address ?? "",
    city: data.city ?? "",
    country: data.country ?? "",
    location: {
      latitude:
        data.location.latitude === null
          ? ""
          : String(data.location.latitude),
      longitude:
        data.location.longitude === null
          ? ""
          : String(data.location.longitude),
    },
  };
}

function isNonEmpty(value: string | undefined) {
  return Boolean(value?.trim());
}

function isValidLatitude(value: string) {
  const number = Number(value);

  return (
    value.trim() !== "" &&
    Number.isFinite(number) &&
    number >= -90 &&
    number <= 90
  );
}

function isValidLongitude(value: string) {
  const number = Number(value);

  return (
    value.trim() !== "" &&
    Number.isFinite(number) &&
    number >= -180 &&
    number <= 180
  );
}

export function GeneralSettingsForm({
  initialData,
}: GeneralSettingsFormProps) {
  const formVersion = [
    initialData.id || "uninitialized",
    initialData.updatedAt ?? "",
    initialData.logoUrl ?? "",
  ].join("-");

  return (
    <GeneralSettingsFormContent
      key={formVersion}
      initialData={initialData}
    />
  );
}

function GeneralSettingsFormContent({
  initialData,
}: GeneralSettingsFormProps) {
  const updateMutation = useUpdateGeneralSettings();

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | undefined>();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const values = useWatch({ control });

  const schoolName = values.schoolName ?? "";
  const shortName = values.shortName ?? "";
  const description = values.description ?? "";
  const phoneNumber = values.phoneNumber ?? "";
  const emergencyPhoneNumber = values.emergencyPhoneNumber ?? "";
  const email = values.email ?? "";
  const country = values.country ?? "";
  const city = values.city ?? "";
  const address = values.address ?? "";
  const latitude = values.location?.latitude ?? "";
  const longitude = values.location?.longitude ?? "";

  const identityComplete =
    isNonEmpty(schoolName) &&
    isNonEmpty(shortName) &&
    isNonEmpty(description);

  const contactComplete =
    isNonEmpty(phoneNumber) &&
    isNonEmpty(emergencyPhoneNumber) &&
    isNonEmpty(email);

  const addressComplete =
    isNonEmpty(country) &&
    isNonEmpty(city) &&
    isNonEmpty(address) &&
    isValidLatitude(latitude) &&
    isValidLongitude(longitude);

  const isInitialized = initialData.id.trim().length > 0;
  const hasUnsavedChanges = isDirty || selectedLogo !== null;

  function applyServerValidationErrors(error: unknown) {
    const validationErrors = getAxiosValidationErrors(error);

    setLogoError(validationErrors.logo?.[0]);

    const fieldMappings: Array<{
      apiField: string;
      formField: Path<GeneralSettingsFormValues>;
    }> = [
      {
        apiField: "schoolName",
        formField: "schoolName",
      },
      {
        apiField: "shortName",
        formField: "shortName",
      },
      {
        apiField: "description",
        formField: "description",
      },
      {
        apiField: "phoneNumber",
        formField: "phoneNumber",
      },
      {
        apiField: "emergencyPhoneNumber",
        formField: "emergencyPhoneNumber",
      },
      {
        apiField: "email",
        formField: "email",
      },
      {
        apiField: "website",
        formField: "website",
      },
      {
        apiField: "address",
        formField: "address",
      },
      {
        apiField: "city",
        formField: "city",
      },
      {
        apiField: "country",
        formField: "country",
      },
      {
        apiField: "location.latitude",
        formField: "location.latitude",
      },
      {
        apiField: "location.longitude",
        formField: "location.longitude",
      },
    ];

    for (const mapping of fieldMappings) {
      const message = validationErrors[mapping.apiField]?.[0];

      if (message) {
        setError(mapping.formField, {
          type: "server",
          message,
        });
      }
    }
  }

  function onSubmit(formValues: GeneralSettingsFormValues) {
    clearErrors();
    setLogoError(undefined);

    updateMutation.mutate(
      {
        schoolName: formValues.schoolName.trim(),
        shortName: formValues.shortName.trim(),
        description: formValues.description.trim(),
        phoneNumber: formValues.phoneNumber.trim(),
        emergencyPhoneNumber: formValues.emergencyPhoneNumber.trim(),
        email: formValues.email.trim(),
        website: formValues.website?.trim() ?? "",
        address: formValues.address.trim(),
        city: formValues.city.trim(),
        country: formValues.country.trim(),
        location: {
          latitude: Number(formValues.location.latitude),
          longitude: Number(formValues.location.longitude),
        },
        logo: selectedLogo ?? undefined,
      },
      {
        onSuccess: (settings) => {
          setSelectedLogo(null);
          setLogoError(undefined);
          reset(getDefaultValues(settings));
        },
        onError: applyServerValidationErrors,
      },
    );
  }

  function handleCancel() {
    reset(getDefaultValues(initialData));
    clearErrors();
    setSelectedLogo(null);
    setLogoError(undefined);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-[1500px]"
    >
      {!isInitialized ? (
        <div className="mb-4 rounded-[19px] border border-primary/10 bg-primary/[0.035] px-4 py-3.5 sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-primary/[0.09] text-primary">
              <Building2 size={17} strokeWidth={1.75} />
            </span>

            <div className="pt-0.5">
              <p className="text-[14px] font-semibold text-foreground">
                Complete the school profile
              </p>

              <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
                Fill in the required information and save the form to
                initialize the school settings.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {/* School Identity + Contact */}
        <div className="grid items-stretch gap-3 xl:grid-cols-2">
          <SettingsCard
            completed={identityComplete}
            completedLabel="School identity completed"
          >
            <SectionHeader
              title="School Identity"
              description="Manage the school's name, short name and description."
              icon={Building2}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="School Name"
                required
                error={errors.schoolName?.message}
                {...register("schoolName")}
              />

              <TextInput
                label="Short Name"
                required
                error={errors.shortName?.message}
                {...register("shortName")}
              />

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-[12px] font-semibold text-foreground/80">
                  Description{" "}
                  <span className="text-destructive">*</span>
                </span>

                <textarea
                  rows={6}
                  {...register("description")}
                  className={[
                    "min-h-[120px] max-h-[340px] w-full resize-y rounded-[12px]",
                    "border border-border/80 bg-background px-3.5 py-3",
                    "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                    "text-[14px] font-normal leading-5 text-foreground outline-none transition duration-200",
                    "placeholder:font-normal placeholder:text-muted-foreground/80",
                    "hover:border-border focus:border-primary/55 focus:ring-4 focus:ring-primary/[0.10]",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    errors.description?.message
                      ? "border-destructive/35 bg-destructive/[0.025] focus:border-destructive/40 focus:ring-destructive/[0.07]"
                      : "",
                  ].join(" ")}
                />

                {errors.description?.message ? (
                  <p className="mt-1.5 px-1 text-[11px] font-medium text-destructive">
                    {errors.description.message}
                  </p>
                ) : null}
              </label>
            </div>
          </SettingsCard>

          <SettingsCard
            completed={contactComplete}
            completedLabel="Contact information completed"
          >
            <SectionHeader
              title="Contact Information"
              description="Manage the primary contact channels used by the school."
              icon={Phone}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Phone Number"
                required
                icon={Phone}
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />

              <TextInput
                label="Emergency Phone"
                required
                icon={Phone}
                error={errors.emergencyPhoneNumber?.message}
                {...register("emergencyPhoneNumber")}
              />

              <TextInput
                label="Email Address"
                required
                type="email"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
              />

              <TextInput
                label="Website"
                type="url"
                icon={Globe2}
                error={errors.website?.message}
                {...register("website")}
              />
            </div>
          </SettingsCard>
        </div>

        {/* Address + Map */}
        <div className="grid items-stretch gap-3 xl:grid-cols-2">
          <SettingsCard
            completed={addressComplete}
            completedLabel="Address and location completed"
          >
            <SectionHeader
              title="Address & Location"
              description="Update the school's physical address and geographic coordinates."
              icon={MapPin}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Country"
                required
                error={errors.country?.message}
                {...register("country")}
              />

              <TextInput
                label="City"
                required
                error={errors.city?.message}
                {...register("city")}
              />

              <TextInput
                label="Full Address"
                required
                icon={MapPin}
                className="md:col-span-2"
                error={errors.address?.message}
                {...register("address")}
              />

              <TextInput
                label="Latitude"
                required
                inputMode="decimal"
                error={errors.location?.latitude?.message}
                {...register("location.latitude")}
              />

              <TextInput
                label="Longitude"
                required
                inputMode="decimal"
                error={errors.location?.longitude?.message}
                {...register("location.longitude")}
              />
            </div>
          </SettingsCard>

          <SchoolLocationMap
            schoolName={schoolName}
            latitude={latitude}
            longitude={longitude}
          />
        </div>

        {/* Logo + Gallery */}
        <div
          className={[
            "grid items-start gap-3",
            "xl:grid-cols-[240px_minmax(0,1fr)]",
          ].join(" ")}
        >
          <SchoolLogoUpload
            currentLogoUrl={initialData.logoUrl}
            selectedFile={selectedLogo}
            error={logoError}
            disabled={updateMutation.isPending}
            onFileChange={(file) => {
              setLogoError(undefined);
              setSelectedLogo(file);
            }}
          />

          <SchoolGallery images={initialData.images} />
        </div>

        {isInitialized ? (
          <GeneralSettingsDangerZone
            schoolName={initialData.schoolName}
            shortName={initialData.shortName}
          />
        ) : null}
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 mt-5 flex flex-col-reverse gap-2.5 rounded-t-[20px] border-t border-border/45 bg-background/85 px-4 py-3.5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-end sm:px-5">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!hasUnsavedChanges || updateMutation.isPending}
          className="h-10 rounded-full bg-muted/55 px-5 text-[14px] font-semibold text-foreground/75 transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!hasUnsavedChanges || updateMutation.isPending}
          className="flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_12px_26px_rgba(98,74,180,0.25)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55"
        >
          {updateMutation.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}

          {updateMutation.isPending
            ? "Saving..."
            : isInitialized
              ? "Save Changes"
              : "Initialize Settings"}
        </button>
      </div>
    </form>
  );
}