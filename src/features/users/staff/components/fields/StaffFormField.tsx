import type {
  ReactNode,
} from "react";

type StaffFormFieldProps = {
  label: string;

  children: ReactNode;

  required?: boolean;

  helper?: string;

  className?: string;
};

export function StaffFormField({
  label,
  children,
  required = false,
  helper,
  className = "",
}: StaffFormFieldProps) {
  return (
    <label
      className={[
        "block space-y-2",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center gap-1.5",

          "text-xs",
          "font-semibold",

          "text-foreground",
        ].join(" ")}
      >
        {label}

        {required ? (
          <span className="text-destructive">
            *
          </span>
        ) : null}
      </span>

      {children}

      {helper ? (
        <span
          className={[
            "block",

            "text-[11px]",
            "leading-5",

            "text-muted-foreground",
          ].join(" ")}
        >
          {helper}
        </span>
      ) : null}
    </label>
  );
}