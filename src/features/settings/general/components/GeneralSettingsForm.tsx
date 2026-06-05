import {
  Building2,
  CalendarDays,
  Clock,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { BrandingPreview } from "./BrandingPreview";
import { SchoolGallery } from "./SchoolGallery";
import { SchoolLogoUpload } from "./SchoolLogoUpload";
import {
  useUpdateGeneralSettings,
} from "@/features/settings/general/hooks/useGeneralSettings";
import {
  generalSettingsSchema,
  type GeneralSettingsFormValues,
} from "@/features/settings/general/schemas/general-settings.schema";
import type { GeneralSettings } from "@/features/settings/general/types/general-settings.types";

type GeneralSettingsFormProps = {
  initialData: GeneralSettings;
};

function TextInput({
  label,
  required,
  icon: Icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  icon?: typeof Building2;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold text-foreground/80">
        {label} {required ? <span className="text-destructive">*</span> : null}
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
            "h-11 w-full rounded-xl border border-border/70 bg-card text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
            Icon ? "pl-10 pr-4" : "px-4",
          ].join(" ")}
        />
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function SelectInput({
  label,
  required,
  options,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  options: string[];
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold text-foreground/80">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </span>

      <select
        {...props}
        className="h-11 w-full rounded-xl border border-border/70 bg-card px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-destructive">
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
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={22} strokeWidth={1.9} />
      </span>

      <div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function DayButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 rounded-xl px-3 text-xs font-bold transition",
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function GeneralSettingsForm({ initialData }: GeneralSettingsFormProps) {
  const updateMutation = useUpdateGeneralSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      schoolName: initialData.schoolName,
      shortName: initialData.shortName,
      description: initialData.description,
      phoneNumber: initialData.phoneNumber,
      emergencyPhoneNumber: initialData.emergencyPhoneNumber,
      email: initialData.email,
      website: initialData.website ?? "",
      address: initialData.address,
      city: initialData.city,
      country: initialData.country,
      location: {
  latitude: String(initialData.location.latitude ?? ""),
  longitude: String(initialData.location.longitude ?? ""),
},
      defaultLanguage: initialData.defaultLanguage,
      timezone: initialData.timezone,
      dateFormat: initialData.dateFormat,
      currency: initialData.currency,
      workingDays: initialData.workingDays,
      openingTime: initialData.openingTime,
      closingTime: initialData.closingTime,
    },
  });

  useEffect(() => {
    reset({
      schoolName: initialData.schoolName,
      shortName: initialData.shortName,
      description: initialData.description,
      phoneNumber: initialData.phoneNumber,
      emergencyPhoneNumber: initialData.emergencyPhoneNumber,
      email: initialData.email,
      website: initialData.website ?? "",
      address: initialData.address,
      city: initialData.city,
      country: initialData.country,
      location: {
  latitude: String(initialData.location.latitude ?? ""),
  longitude: String(initialData.location.longitude ?? ""),
},
      defaultLanguage: initialData.defaultLanguage,
      timezone: initialData.timezone,
      dateFormat: initialData.dateFormat,
      currency: initialData.currency,
      workingDays: initialData.workingDays,
      openingTime: initialData.openingTime,
      closingTime: initialData.closingTime,
    });
  }, [initialData, reset]);

  const watchedValues = watch();
  const workingDays = watch("workingDays");

  function toggleWorkingDay(day: string) {
    const currentDays = workingDays ?? [];

    if (currentDays.includes(day)) {
      setValue(
        "workingDays",
        currentDays.filter((item) => item !== day),
        { shouldDirty: true, shouldValidate: true }
      );
      return;
    }

    setValue("workingDays", [...currentDays, day], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

 function onSubmit(values: GeneralSettingsFormValues) {
  updateMutation.mutate({
    ...values,
    location: {
      latitude: values.location.latitude
        ? Number(values.location.latitude)
        : null,
      longitude: values.location.longitude
        ? Number(values.location.longitude)
        : null,
    },
  });
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Building2 size={28} />
          </span>

          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">
              School Information
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your school&apos;s profile, contact details and preferences.
            </p>
          </div>
        </div>

        <p className="hidden text-xs font-semibold text-muted-foreground lg:block">
          Last updated: {new Date(initialData.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-border/70 bg-card p-5">
            <SectionHeader
              title="Basic Information"
              description="Update your school's basic profile information."
              icon={Building2}
            />

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <SchoolLogoUpload data={initialData} />

              <div className="grid gap-5 md:grid-cols-2">
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
                  <span className="mb-2 block text-[11px] font-bold text-foreground/80">
                    Description
                  </span>

                  <textarea
                    rows={5}
                    {...register("description")}
                    className="w-full resize-none rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                  />

                  {errors.description?.message ? (
                    <p className="mt-1 text-[11px] font-semibold text-destructive">
                      {errors.description.message}
                    </p>
                  ) : null}
                </label>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-3xl border border-border/70 bg-card p-5">
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

            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <SectionHeader
                title="Address & Location"
                description="Update your school's address and location."
                icon={MapPin}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <SelectInput
                  label="Country"
                  required
                  options={[
                    "United States",
                    "Norway",
                    "United Arab Emirates",
                  ]}
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
                  icon={MapPin}
                  error={errors.location?.latitude?.message}
                  {...register("location.latitude")}
                />

                <TextInput
                  label="Longitude"
                  icon={MapPin}
                  error={errors.location?.longitude?.message}
                  {...register("location.longitude")}
                />
              </div>
            </section>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <SectionHeader
                title="School Schedule"
                description="Set school working days and operating hours."
                icon={CalendarDays}
              />

              <div>
                <span className="mb-2 block text-[11px] font-bold text-foreground/80">
                  Working Days <span className="text-destructive">*</span>
                </span>

                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <DayButton
                        key={day}
                        label={day}
                        active={workingDays?.includes(day)}
                        onClick={() => toggleWorkingDay(day)}
                      />
                    )
                  )}
                </div>

                {errors.workingDays?.message ? (
                  <p className="mt-1 text-[11px] font-semibold text-destructive">
                    {errors.workingDays.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Opening Time"
                  icon={Clock}
                  error={errors.openingTime?.message}
                  {...register("openingTime")}
                />

                <TextInput
                  label="Closing Time"
                  icon={Clock}
                  error={errors.closingTime?.message}
                  {...register("closingTime")}
                />

               
              </div>
            </section>

            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <SectionHeader
                title="System Preferences"
                description="Configure general system preferences."
                icon={Settings}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <SelectInput
                  label="Default Language"
                  required
                  options={["English", "Arabic", "Norwegian"]}
                  error={errors.defaultLanguage?.message}
                  {...register("defaultLanguage")}
                />

                <SelectInput
                  label="Timezone"
                  required
                  options={[
                    "(UTC-05:00) Eastern Time",
                    "(UTC+01:00) Oslo",
                    "(UTC+04:00) Dubai",
                  ]}
                  error={errors.timezone?.message}
                  {...register("timezone")}
                />

                <SelectInput
                  label="Date Format"
                  required
                  options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                  error={errors.dateFormat?.message}
                  {...register("dateFormat")}
                />

                <SelectInput
                  label="Currency"
                  required
                  options={[
                    "USD - US Dollar",
                    "NOK - Norwegian Krone",
                    "AED - UAE Dirham",
                  ]}
                  error={errors.currency?.message}
                  {...register("currency")}
                />
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-5">
         <BrandingPreview
  data={{
    schoolName: watchedValues.schoolName,
    shortName: watchedValues.shortName,
    description: watchedValues.description,
    phoneNumber: watchedValues.phoneNumber,
    emergencyPhoneNumber: watchedValues.emergencyPhoneNumber,
    email: watchedValues.email,
    website: watchedValues.website,
    city: watchedValues.city,
    country: watchedValues.country,
    logoUrl: initialData.logoUrl,
    openingTime: watchedValues.openingTime,
    closingTime: watchedValues.closingTime,
  }}
/>
          <SchoolGallery images={initialData.images} />
        </aside>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty || updateMutation.isPending}
          className="h-11 rounded-2xl border border-border/70 bg-card px-8 text-sm font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={16} />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}