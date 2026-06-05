import {
  Building2,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BrandingPreviewData = {
  schoolName?: string;
  shortName?: string;
  description?: string;

  phoneNumber?: string;
  emergencyPhoneNumber?: string;
  email?: string;
  website?: string;

  city?: string;
  country?: string;

  logoUrl?: string | null;

  academicYear?: string;
  openingTime?: string;
  closingTime?: string;
};

type Props = {
  data: BrandingPreviewData;
};

export function BrandingPreview({ data }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-card">
      <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-card" />

      <div className="-mt-16 px-5 pb-5">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-card bg-primary/10 shadow-soft">
          {data.logoUrl ? (
            <img
              src={data.logoUrl}
              alt={data.schoolName ?? "School logo"}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Building2 size={54} className="text-primary" />
          )}
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-2xl font-bold text-foreground">
            {data.schoolName || "School Name"}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {data.description || "School description will appear here."}
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
          <InfoRow icon={Phone} value={data.phoneNumber} />
          <InfoRow icon={Phone} value={data.emergencyPhoneNumber} />
          <InfoRow icon={Mail} value={data.email} />
          <InfoRow icon={Globe2} value={data.website} />
          <InfoRow
            icon={MapPin}
            value={[data.city, data.country].filter(Boolean).join(", ")}
            isLast
          />
        </div>

        <div className="mt-5 rounded-2xl bg-primary/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-muted-foreground">
              Academic Year
            </span>

            <span className="text-sm font-bold text-primary">
              {data.academicYear || "—"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-muted-foreground">
              Working Hours
            </span>

            <span className="text-sm font-bold text-foreground">
              {data.openingTime || "—"} - {data.closingTime || "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  value,
  isLast,
}: {
  icon: LucideIcon;
  value?: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3",
        !isLast ? "border-b border-border/70" : "",
      ].join(" ")}
    >
      <Icon size={15} className="text-primary" />

      <span className="truncate text-sm text-muted-foreground">
        {value || "—"}
      </span>
    </div>
  );
}