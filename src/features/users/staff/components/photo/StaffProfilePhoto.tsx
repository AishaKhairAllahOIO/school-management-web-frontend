import {
  Camera,
  UserRound,
} from "lucide-react";

type StaffProfilePhotoProps = {
  photoUrl?: string | null;

  fullName?: string | null;

  alt?: string;

  size?: "sm" | "md" | "lg";

  className?: string;
};

const sizeClassNames = {
  sm: {
    container:
      "h-16 w-16 rounded-[18px]",
    icon: "h-6 w-6",
    initials: "text-base",
  },

  md: {
    container:
      "h-24 w-24 rounded-[24px]",
    icon: "h-8 w-8",
    initials: "text-xl",
  },

  lg: {
    container:
      "h-32 w-32 rounded-[28px]",
    icon: "h-10 w-10",
    initials: "text-2xl",
  },
} as const;

export function StaffProfilePhoto({
  photoUrl,
  fullName,
  alt,
  size = "lg",
  className = "",
}: StaffProfilePhotoProps) {
  const dimensions =
    sizeClassNames[size];

  const initials =
    getInitials(fullName);

  return (
    <div
      className={[
        "relative shrink-0",
        dimensions.container,
        className,
      ].join(" ")}
    >
      <div
        className={[
          "h-full w-full overflow-hidden",
          dimensions.container,
          "border border-card/80",
          "bg-card",
          "shadow-[var(--shadow-floating)]",
        ].join(" ")}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={
              alt ??
              fullName ??
              "Staff profile"
            }
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <div
            className={[
              "primary-gradient",
              "flex h-full w-full",
              "items-center justify-center",
              "font-semibold",
              "text-primary-foreground",
              dimensions.initials,
            ].join(" ")}
          >
            {initials}
          </div>
        ) : (
          <div
            className={[
              "flex h-full w-full",
              "items-center justify-center",
              "bg-primary/[0.07]",
              "text-primary",
            ].join(" ")}
          >
            <UserRound
              className={
                dimensions.icon
              }
            />
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className={[
          "absolute bottom-1 right-1",
          "flex h-8 w-8",
          "items-center justify-center",
          "rounded-full",
          "border-2 border-card",
          "bg-card",
          "text-primary",
          "shadow-[var(--shadow-card)]",
        ].join(" ")}
      >
        <Camera className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

function getInitials(
  fullName?: string | null,
): string {
  if (!fullName) {
    return "";
  }

  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();
}