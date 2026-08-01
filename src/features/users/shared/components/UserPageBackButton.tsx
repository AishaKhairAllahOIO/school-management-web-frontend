import { ArrowLeft } from "lucide-react";

type UserPageBackButtonProps = {
  label: string;
  onClick: () => void;
};

export function UserPageBackButton({
  label,
  onClick,
}: UserPageBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex w-fit items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        strokeWidth={1.8}
      />
      {label}
    </button>
  );
}
