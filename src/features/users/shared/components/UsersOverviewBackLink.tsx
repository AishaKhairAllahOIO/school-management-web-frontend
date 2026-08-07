import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/locale";

type UsersOverviewBackLinkProps = {
  label?: string;
};

export function UsersOverviewBackLink({
  label,
}: UsersOverviewBackLinkProps) {
  const { t } = useLocale();

  const resolvedLabel =
    label ?? t.users.shared.backToOverview;

  return (
    <Link
      to="/users"
      className={[
        "group inline-flex w-fit",
        "items-center gap-2",
        "rounded-[12px]",
        "px-1 py-1.5",
        "text-sm font-medium",
        "text-muted-foreground",
        "outline-none transition duration-200",
        "hover:text-foreground",
        "focus-visible:ring-4",
        "focus-visible:ring-primary/10",
      ].join(" ")}
    >
      <ArrowLeft
        className={[
          "h-4 w-4 shrink-0",
          "transition-transform duration-200",
          "group-hover:-translate-x-0.5",
          "rtl:rotate-180",
          "rtl:group-hover:translate-x-0.5",
        ].join(" ")}
        strokeWidth={1.8}
      />

      <span>{resolvedLabel}</span>
    </Link>
  );
}
