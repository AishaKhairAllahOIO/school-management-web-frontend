import schoolLogo from "@/assets/images/school-logo.svg";

type AuthBrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<
  NonNullable<AuthBrandLogoProps["size"]>,
  string
> = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-24 w-24",
};

export function AuthBrandLogo({
  size = "md",
  className = "",
}: AuthBrandLogoProps) {
  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      <img
        src={schoolLogo}
        alt="School logo"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}