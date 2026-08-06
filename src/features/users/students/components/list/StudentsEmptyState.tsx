import {
  SearchX,
  UserPlus,
} from "lucide-react";

type StudentsEmptyStateProps = {
  hasSearch: boolean;
  onAddStudent: () => void;
  onReset: () => void;
};

export function StudentsEmptyState({
  hasSearch,
  onAddStudent,
  onReset,
}: StudentsEmptyStateProps) {
  const title = hasSearch
    ? "No students found"
    : "No students have been added yet";

  const description = hasSearch
    ? "Try adjusting your search or filters, or reset them to browse all students."
    : "Create your first student profile and connect their guardian and academic enrollment.";

  return (
    <section
      className={[
        "rounded-[28px]",
        "border border-border/70",
        "bg-card",
        "px-6 py-14",
        "text-center",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <span
        className={[
          "mx-auto flex h-16 w-16",
          "items-center justify-center",
          "rounded-[22px]",
          "bg-primary/[0.07]",
          "text-primary",
        ].join(" ")}
      >
        {hasSearch ? (
          <SearchX className="h-7 w-7" />
        ) : (
          <UserPlus className="h-7 w-7" />
        )}
      </span>

      <h2
        className={[
          "mt-5",
          "text-xl font-semibold",
          "tracking-[-0.025em]",
          "text-foreground",
        ].join(" ")}
      >
        {title}
      </h2>

      <p
        className={[
          "mx-auto mt-2",
          "max-w-md",
          "text-sm leading-6",
          "text-muted-foreground",
        ].join(" ")}
      >
        {description}
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {hasSearch ? (
          <button
            type="button"
            onClick={onReset}
            className={[
              "inline-flex h-11",
              "items-center justify-center",
              "rounded-xl",
              "border border-border",
              "bg-card px-5",
              "text-sm font-semibold",
              "text-foreground",
              "transition-colors",
              "hover:border-primary/20",
              "hover:bg-primary/[0.05]",
            ].join(" ")}
          >
            Reset filters
          </button>
        ) : null}

        <button
          type="button"
          onClick={onAddStudent}
          className={[
            "primary-gradient",
            "inline-flex h-11",
            "items-center justify-center gap-2",
            "rounded-xl px-5",
            "text-sm font-semibold",
            "text-primary-foreground",
            "shadow-[var(--shadow-auth-button)]",
            "transition-transform",
            "hover:-translate-y-0.5",
          ].join(" ")}
        >
          <UserPlus className="h-4 w-4" />
          Add student
        </button>
      </div>
    </section>
  );
}