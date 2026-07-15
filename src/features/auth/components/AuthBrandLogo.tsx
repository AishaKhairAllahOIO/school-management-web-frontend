import { GraduationCap } from "lucide-react";

type AuthBrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<
  NonNullable<AuthBrandLogoProps["size"]>,
  string
> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function AuthBrandLogo({
  size = "lg",
  className = "",
}: AuthBrandLogoProps) {
  return (
    <GraduationCap
      aria-hidden="true"
      strokeWidth={1.8}
      className={[
        "block shrink-0 text-primary",
        sizeClasses[size],
        className,
      ].join(" ")}
    />
  );
}