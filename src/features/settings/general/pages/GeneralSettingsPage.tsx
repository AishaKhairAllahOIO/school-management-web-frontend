import {
  Building2,
  Globe2,
  Mail,
  Phone,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { schoolConfigMock } from "@/features/settings/school-config/mocks/school-config.mock";

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-semibold text-muted-foreground">
        {label}
      </span>

      <input
        defaultValue={value}
        className="h-11 w-full rounded-2xl border border-border/70 bg-card px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold text-muted-foreground">
        {label}
      </span>

      <select
        defaultValue={value}
        className="h-11 w-full rounded-2xl border border-border/70 bg-card px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

export function GeneralSettingsPage() {
  const schoolName = schoolConfigMock.schoolName ?? "SM Academy";

  return (
    <div className="soft-card rounded-3xl p-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-border/70 bg-card p-5">
            <div className="mb-6">
              <h1 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">
                School Profile
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Update your school&apos;s basic information
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[230px_1fr]">
              <div className="rounded-3xl border border-border/70 bg-background/40 p-4">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">
                  School Logo
                </p>

                <div className="flex h-32 items-center justify-center rounded-3xl border border-border/70 bg-card">
                  <Building2 size={54} className="text-primary" />
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary/10 text-xs font-bold text-primary">
                    <Upload size={14} />
                    Change Logo
                  </button>

                  <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 text-muted-foreground hover:bg-muted">
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground">
                  PNG, JPG or SVG. Max size 2MB.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="School Name" value={schoolName} />
                <Field label="Short Name" value="SMA" />
                <Field label="School Email" value="info@smacademy.edu" />
                <Field label="School Phone" value="+1 (555) 123-4567" />
                <Field
                  label="Website"
                  value="https://www.smacademy.edu"
                  className="md:col-span-2"
                />
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="text-lg font-bold tracking-[-0.03em] text-foreground">
                Address & Location
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Update your school&apos;s address details
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Country"
                  value="United States"
                  options={["United States", "Norway", "United Arab Emirates"]}
                />
                <Field label="City" value="New York" />
                <Field
                  label="Full Address"
                  value="123 Education Lane, Manhattan, New York, NY 10001"
                  className="md:col-span-2"
                />
                <Field
                  label="Postal Code"
                  value="10001"
                  className="md:col-span-2"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="text-lg font-bold tracking-[-0.03em] text-foreground">
                System Preferences
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Configure general system preferences
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Default Language"
                  value="English"
                  options={["English", "Arabic", "Norwegian"]}
                />
                <SelectField
                  label="Timezone"
                  value="(UTC-05:00) Eastern Time"
                  options={[
                    "(UTC-05:00) Eastern Time",
                    "(UTC+01:00) Oslo",
                    "(UTC+04:00) Dubai",
                  ]}
                />
                <SelectField
                  label="Date Format"
                  value="MM/DD/YYYY"
                  options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                />
                <SelectField
                  label="Currency"
                  value="USD - US Dollar"
                  options={["USD - US Dollar", "NOK - Norwegian Krone", "AED - UAE Dirham"]}
                />
              </div>
            </section>
          </div>
        </div>

        <aside className="rounded-3xl border border-border/70 bg-card p-5">
          <h2 className="text-lg font-bold tracking-[-0.03em] text-foreground">
            Branding Preview
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This is how your school will appear in the system
          </p>

          <div className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/10 via-card to-card">
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                <Building2 size={48} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-foreground">
                {schoolName}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Excellence in Education
              </p>
            </div>

            <div className="border-t border-border/70 p-6">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={16} />
                  <span>info@smacademy.edu</span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Globe2 size={16} />
                  <span>www.smacademy.edu</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/70 p-6">
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    Primary Color
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      #5B4FC7
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    Secondary Color
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-accent" />
                    <span className="text-sm font-semibold text-foreground">
                      #EDE9FE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-border/70 pt-5">
        <button className="h-11 rounded-2xl border border-border/70 bg-card px-8 text-sm font-bold text-foreground transition hover:bg-muted">
          Cancel
        </button>

        <button className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}