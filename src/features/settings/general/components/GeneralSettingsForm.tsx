import {
  Building2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  useForm,
  type Path,
} from "react-hook-form";

import { GeneralSettingsDangerZone } from "./GeneralSettingsDangerZone";
import { SchoolGallery } from "./SchoolGallery";
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

type TextInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
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
    <label className={["block", className ?? ""].join(" ")}>
      <span className="mb-2 block text-[11px] font-bold text-foreground/80">
        {label}
        {required ? (
          <span className="text-destructive"> *</span>
        ) : null}
      </span>

      <div className="relative">
        {Icon ? (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
          />
        ) : null}

        <input
          {...props}
          className={[
            "h-11 w-full rounded-xl border bg-card",
            "text-sm font-semibold text-foreground",
            "outline-none transition",
            "placeholder:font-normal placeholder:text-muted-foreground",
            "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-60",
            Icon ? "pl-10 pr-4" : "px-4",
            error
              ? "border-destructive/60"
              : "border-border/70",
          ].join(" ")}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-[11px] font-semibold text-destructive">
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
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={20} strokeWidth={1.9} />
      </span>

      <div className="pt-0.5">
        <h2 className="text-base font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
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
    emergencyPhoneNumber:
      data.emergencyPhoneNumber ?? "",
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
  const updateMutation =
    useUpdateGeneralSettings();

  const [selectedLogo, setSelectedLogo] =
    useState<File | null>(null);

  const [logoError, setLogoError] =
    useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(
      generalSettingsSchema,
    ),
    defaultValues:
      getDefaultValues(initialData),
  });

  const isInitialized =
    initialData.id.trim().length > 0;

  const hasUnsavedChanges =
    isDirty || selectedLogo !== null;

  function applyServerValidationErrors(
    error: unknown,
  ) {
    const validationErrors =
      getAxiosValidationErrors(error);

    setLogoError(
      validationErrors.logo?.[0],
    );

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
      const message =
        validationErrors[mapping.apiField]?.[0];

      if (!message) {
        continue;
      }

      setError(mapping.formField, {
        type: "server",
        message,
      });
    }
  }

  function onSubmit(
    values: GeneralSettingsFormValues,
  ) {
    clearErrors();
    setLogoError(undefined);

    updateMutation.mutate(
      {
        schoolName:
          values.schoolName.trim(),
        shortName:
          values.shortName.trim(),
        description:
          values.description.trim(),
        phoneNumber:
          values.phoneNumber.trim(),
        emergencyPhoneNumber:
          values.emergencyPhoneNumber.trim(),
        email:
          values.email.trim(),
        website:
          values.website?.trim() ?? "",
        address:
          values.address.trim(),
        city:
          values.city.trim(),
        country:
          values.country.trim(),
        location: {
          latitude: Number(
            values.location.latitude,
          ),
          longitude: Number(
            values.location.longitude,
          ),
        },
        logo:
          selectedLogo ?? undefined,
      },
      {
        onSuccess: (settings) => {
          setSelectedLogo(null);
          setLogoError(undefined);
          reset(getDefaultValues(settings));
        },
        onError:
          applyServerValidationErrors,
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
      className="mx-auto w-full max-w-[1500px] rounded-3xl border border-border/70 bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="mb-7 flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-[28px]">
            School Information
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Manage your school&apos;s profile,
            contact details and visual identity.
          </p>
        </div>

        <span className="w-fit rounded-full bg-muted px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
          {initialData.updatedAt
            ? `Last updated: ${new Date(
                initialData.updatedAt,
              ).toLocaleString()}`
            : "School settings have not been initialized yet."}
        </span>
      </div>

      {!isInitialized ? (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm font-bold text-foreground">
            Complete the school profile
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            These settings have not been initialized.
            Complete the required fields and save to
            create the school profile.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
            <SectionHeader
              title="Basic Information"
              description="Update the school's identity and profile information."
              icon={Building2}
            />

            <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
              <SchoolLogoUpload
                currentLogoUrl={
                  initialData.logoUrl
                }
                selectedFile={
                  selectedLogo
                }
                error={logoError}
                disabled={
                  updateMutation.isPending
                }
                onFileChange={(file) => {
                  setLogoError(undefined);
                  setSelectedLogo(file);
                }}
              />

              <div className="rounded-2xl border border-border/40 bg-muted/10 p-4 sm:p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput
                    label="School Name"
                    required
                    error={
                      errors.schoolName?.message
                    }
                    {...register("schoolName")}
                  />

                  <TextInput
                    label="Short Name"
                    required
                    error={
                      errors.shortName?.message
                    }
                    {...register("shortName")}
                  />

                  <label className="md:col-span-2">
                    <span className="mb-2 block text-[11px] font-bold text-foreground/80">
                      Description
                      <span className="text-destructive">
                        {" "}
                        *
                      </span>
                    </span>

                    <textarea
                      rows={6}
                      {...register("description")}
                      className={[
                        "w-full resize-none rounded-xl border bg-card",
                        "px-4 py-3 text-sm font-medium text-foreground",
                        "outline-none transition",
                        "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                        errors.description?.message
                          ? "border-destructive/60"
                          : "border-border/70",
                      ].join(" ")}
                    />

                    {errors.description?.message ? (
                      <p className="mt-1.5 text-[11px] font-semibold text-destructive">
                        {
                          errors.description
                            .message
                        }
                      </p>
                    ) : null}
                  </label>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border border-border/60 bg-muted/10 p-5">
              <SectionHeader
                title="Contact Information"
                description="Manage how people can reach your school."
                icon={Phone}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="Phone Number"
                  required
                  icon={Phone}
                  error={
                    errors.phoneNumber?.message
                  }
                  {...register("phoneNumber")}
                />

                <TextInput
                  label="Emergency Phone"
                  required
                  icon={Phone}
                  error={
                    errors.emergencyPhoneNumber
                      ?.message
                  }
                  {...register(
                    "emergencyPhoneNumber",
                  )}
                />

                <TextInput
                  label="Email Address"
                  required
                  icon={Mail}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <TextInput
                  label="Website"
                  icon={Globe2}
                  error={errors.website?.message}
                  {...register("website")}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-border/60 bg-muted/10 p-5">
              <SectionHeader
                title="Address & Location"
                description="Update the school's address and geographic location."
                icon={MapPin}
              />

              <div className="grid gap-5 md:grid-cols-2">
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
                  icon={MapPin}
                  error={
                    errors.location?.latitude
                      ?.message
                  }
                  {...register(
                    "location.latitude",
                  )}
                />

                <TextInput
                  label="Longitude"
                  required
                  icon={MapPin}
                  error={
                    errors.location?.longitude
                      ?.message
                  }
                  {...register(
                    "location.longitude",
                  )}
                />
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-5">
          <SchoolGallery
            images={initialData.images}
          />
        </aside>
      </div>

      <div className="mt-7">
        <GeneralSettingsDangerZone
          schoolName={
            initialData.schoolName
          }
          shortName={
            initialData.shortName
          }
          isInitialized={
            isInitialized
          }
        />
      </div>

      <div className="mt-7 flex justify-end gap-3 border-t border-border/60 pt-5">
        <button
          type="button"
          onClick={handleCancel}
          disabled={
            !hasUnsavedChanges ||
            updateMutation.isPending
          }
          className="h-11 rounded-xl border border-border/70 bg-card px-7 text-sm font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            !hasUnsavedChanges ||
            updateMutation.isPending
          }
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={16} />
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
