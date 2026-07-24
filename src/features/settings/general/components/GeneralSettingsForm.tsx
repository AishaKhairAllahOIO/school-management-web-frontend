import {
  Building2,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useState,
  type InputHTMLAttributes,
} from "react";
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
  InputHTMLAttributes<HTMLInputElement> & {
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
    <label
      className={[
        "block min-w-0",
        className ?? "",
      ].join(" ")}
    >
      <span className="mb-2 block text-xs font-semibold text-foreground/80">
        {label}

        {required ? (
          <span className="text-destructive">
            {" "}
            *
          </span>
        ) : null}
      </span>

      <div className="relative">
        {Icon ? (
          <Icon
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/75"
          />
        ) : null}

        <input
          {...props}
          className={[
            "h-12 w-full rounded-[16px]",
            "border border-transparent",
            "bg-muted/[0.38]",
            "text-sm font-medium text-foreground",
            "outline-none transition duration-200",
            "placeholder:font-normal",
            "placeholder:text-muted-foreground/65",
            "hover:bg-muted/55",
            "focus:border-primary/20",
            "focus:bg-background",
            "focus:ring-4 focus:ring-primary/[0.07]",
            "disabled:cursor-not-allowed",
            "disabled:opacity-60",
            Icon
              ? "pl-11 pr-4"
              : "px-4",
            error
              ? [
                  "border-destructive/35",
                  "bg-destructive/[0.025]",
                  "focus:border-destructive/40",
                  "focus:ring-destructive/[0.07]",
                ].join(" ")
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
    <div className="mb-6 flex items-start gap-3.5">
      <span
        className={[
          "flex h-10 w-10 shrink-0",
          "items-center justify-center",
          "rounded-[15px]",
          "bg-primary/[0.08]",
          "text-primary",
        ].join(" ")}
      >
        <Icon
          size={18}
          strokeWidth={1.75}
        />
      </span>

      <div className="min-w-0 pt-0.5">
        <h2 className="text-[15px] font-semibold text-foreground">
          {title}
        </h2>

        <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingsCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[26px]",
        "border border-border/45",
        "bg-card",
        "p-5 sm:p-6",
        "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
        "transition duration-300",
        "hover:border-border/65",
        "hover:shadow-[0_14px_42px_rgba(30,20,70,0.055)]",
        className ?? "",
      ].join(" ")}
    >
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
        validationErrors[
          mapping.apiField
        ]?.[0];

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

          reset(
            getDefaultValues(settings),
          );
        },
        onError:
          applyServerValidationErrors,
      },
    );
  }

  function handleCancel() {
    reset(
      getDefaultValues(initialData),
    );

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
        <div
          className={[
            "mb-5 rounded-[22px]",
            "border border-primary/10",
            "bg-primary/[0.035]",
            "px-5 py-4 sm:px-6",
          ].join(" ")}
        >
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
              <Building2
                size={18}
                strokeWidth={1.75}
              />
            </span>

            <div className="pt-0.5">
              <p className="text-sm font-semibold text-foreground">
                Complete the school profile
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Fill in the required information
                and save the form to initialize
                the school settings.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-5">
        <SettingsCard>
          <SectionHeader
            title="School Identity"
            description="Manage the school's name, description and visual identity."
            icon={Building2}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(230px,290px)_minmax(0,1fr)]">
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

            <div className="grid content-start gap-5 md:grid-cols-2">
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
                <span className="mb-2 block text-xs font-semibold text-foreground/80">
                  Description

                  <span className="text-destructive">
                    {" "}
                    *
                  </span>
                </span>

                <textarea
                  rows={7}
                  {...register("description")}
                  className={[
                    "w-full resize-none",
                    "rounded-[18px]",
                    "border border-transparent",
                    "bg-muted/[0.38]",
                    "px-4 py-3.5",
                    "text-sm font-medium leading-6",
                    "text-foreground",
                    "outline-none transition duration-200",
                    "hover:bg-muted/55",
                    "focus:border-primary/20",
                    "focus:bg-background",
                    "focus:ring-4 focus:ring-primary/[0.07]",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-60",
                    errors.description?.message
                      ? [
                          "border-destructive/35",
                          "bg-destructive/[0.025]",
                          "focus:border-destructive/40",
                          "focus:ring-destructive/[0.07]",
                        ].join(" ")
                      : "",
                  ].join(" ")}
                />

                {errors.description
                  ?.message ? (
                  <p className="mt-1.5 px-1 text-[11px] font-medium text-destructive">
                    {
                      errors.description
                        .message
                    }
                  </p>
                ) : null}
              </label>
            </div>
          </div>
        </SettingsCard>

        <div className="grid gap-5 xl:grid-cols-2">
          <SettingsCard>
            <SectionHeader
              title="Contact Information"
              description="Manage the primary contact channels used by the school."
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
                  errors
                    .emergencyPhoneNumber
                    ?.message
                }
                {...register(
                  "emergencyPhoneNumber",
                )}
              />

              <TextInput
                label="Email Address"
                required
                type="email"
                icon={Mail}
                error={
                  errors.email?.message
                }
                {...register("email")}
              />

              <TextInput
                label="Website"
                type="url"
                icon={Globe2}
                error={
                  errors.website?.message
                }
                {...register("website")}
              />
            </div>
          </SettingsCard>

          <SettingsCard>
            <SectionHeader
              title="Address & Location"
              description="Update the school's physical address and geographic coordinates."
              icon={MapPin}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="Country"
                required
                error={
                  errors.country?.message
                }
                {...register("country")}
              />

              <TextInput
                label="City"
                required
                error={
                  errors.city?.message
                }
                {...register("city")}
              />

              <TextInput
                label="Full Address"
                required
                icon={MapPin}
                className="md:col-span-2"
                error={
                  errors.address?.message
                }
                {...register("address")}
              />

              <TextInput
                label="Latitude"
                required
                inputMode="decimal"
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
                inputMode="decimal"
                error={
                  errors.location?.longitude
                    ?.message
                }
                {...register(
                  "location.longitude",
                )}
              />
            </div>
          </SettingsCard>
        </div>

        <SchoolGallery
          images={initialData.images}
        />

        {isInitialized ? (
          <GeneralSettingsDangerZone
            schoolName={
              initialData.schoolName
            }
            shortName={
              initialData.shortName
            }
          />
        ) : null}
      </div>

      <div
        className={[
          "sticky bottom-0 z-10",
          "mt-6 flex flex-col-reverse gap-3",
          "rounded-t-[22px]",
          "border-t border-border/45",
          "bg-background/85",
          "px-5 py-4 sm:px-6",
          "backdrop-blur-xl",
          "sm:flex-row sm:items-center",
          "sm:justify-end",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={handleCancel}
          disabled={
            !hasUnsavedChanges ||
            updateMutation.isPending
          }
          className={[
            "h-11 rounded-full",
            "bg-muted/55 px-6",
            "text-sm font-semibold",
            "text-foreground/75",
            "transition duration-200",
            "hover:bg-muted",
            "hover:text-foreground",
            "disabled:cursor-not-allowed",
            "disabled:opacity-45",
          ].join(" ")}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            !hasUnsavedChanges ||
            updateMutation.isPending
          }
          className={[
            "flex h-11 items-center",
            "justify-center gap-2",
            "rounded-full bg-primary",
            "px-6",
            "text-sm font-semibold",
            "text-primary-foreground",
            "shadow-[0_10px_24px_rgba(98,74,180,0.2)]",
            "transition duration-200",
            "hover:-translate-y-0.5",
            "hover:bg-primary/90",
            "hover:shadow-[0_14px_30px_rgba(98,74,180,0.25)]",
            "disabled:cursor-not-allowed",
            "disabled:translate-y-0",
            "disabled:opacity-55",
          ].join(" ")}
        >
          {updateMutation.isPending ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Save size={16} />
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