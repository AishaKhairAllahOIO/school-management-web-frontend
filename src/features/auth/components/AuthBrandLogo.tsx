import schoolLogo from "@/assets/images/school-logo.svg";

type AuthBrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<
  NonNullable<AuthBrandLogoProps["size"]>,
  string
> = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-[4.5rem] w-[4.5rem]",
};

export function AuthBrandLogo({
  size = "md",
  className = "",
}: AuthBrandLogoProps) {
  return (
    <img
      src={schoolLogo}
      alt="School logo"
      draggable={false}
      className={[
        "block shrink-0 object-contain",
        sizeClasses[size],
        className,
      ].join(" ")}
    />
  );
}
