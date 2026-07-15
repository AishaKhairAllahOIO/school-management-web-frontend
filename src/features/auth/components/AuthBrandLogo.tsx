import { GraduationCap } from "lucide-react";

type AuthBrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: {
    container: "h-14 w-14",
    icon: "h-7 w-7",
  },
  md: {
    container: "h-16 w-16",
    icon: "h-8 w-8",
  },
  lg: {
    container: "h-20 w-20",
    icon: "h-10 w-10",
  },
};

export function AuthBrandLogo({
  size = "lg",
  className = "",
}: AuthBrandLogoProps) {
  return (
    <div
      className={[
        "mx-auto flex items-center justify-center rounded-3xl",
        "bg-primary/8",
        "border border-primary/10",
        sizes[size].container,
        className,
      ].join(" ")}
    >
      <GraduationCap
        strokeWidth={2.2}
        className={[
          "text-primary",
          sizes[size].icon,
        ].join(" ")}
      />
    </div>
  );
}