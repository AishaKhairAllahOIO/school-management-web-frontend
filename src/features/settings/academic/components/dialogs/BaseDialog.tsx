import {
  Save,
  X,
} from "lucide-react";
import {
  useEffect,
  type ReactNode,
} from "react";

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  description?: string;
};

export function BaseDialog({
  title,
  children,
  onClose,
  description,
}: Props) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-[100]",
        "flex items-start justify-center sm:items-center",
        "overflow-y-auto overscroll-contain",
        "bg-slate-950/30",
        "p-2.5 sm:p-6",
        "backdrop-blur-[5px]",
      ].join(" ")}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        className={[
          "my-2 w-full max-w-[460px] sm:my-auto",
          "overflow-visible",
          "rounded-[24px]",
          "border border-border/55",
          "bg-card",
          "shadow-[0_28px_90px_rgba(15,10,40,0.22)]",
        ].join(" ")}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header
          className={[
            "flex items-start",
            "justify-between gap-4",
            "rounded-t-[24px]",
            "border-b border-border/45",
            "bg-card",
            "px-5 py-4",
          ].join(" ")}
        >
          <div className="min-w-0">
            <h2
              id="settings-dialog-title"
              className="text-[17px] font-semibold tracking-[-0.015em] text-foreground"
            >
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className={[
              "flex h-8 w-8 shrink-0",
              "items-center justify-center",
              "rounded-[11px]",
              "border border-border/60",
              "bg-background",
              "text-muted-foreground",
              "transition-colors",
              "hover:bg-muted/45",
              "hover:text-foreground",
            ].join(" ")}
          >
            <X
              size={15}
              strokeWidth={1.8}
            />
          </button>
        </header>

        <div
          className={[
            "max-h-[calc(100dvh-9rem)] sm:max-h-[min(70vh,620px)]",
            "overflow-y-auto overscroll-contain",
            "px-5 py-5",
            "[scrollbar-width:thin]",
            "[scrollbar-color:color-mix(in_oklab,var(--border)_75%,transparent)_transparent]",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 min-w-0 last:mb-0">
      <span className="mb-1.5 block text-[12px] font-medium text-foreground/85">
        {label}
      </span>

      {children}
    </div>
  );
}

export const dialogInputClass = [
  "h-11 w-full rounded-[13px]",
  "border border-border/70",
  "bg-background px-3.5",
  "text-[15px] font-normal text-foreground",
  "outline-none transition-all",
  "placeholder:text-muted-foreground/80",
  "hover:border-border",
  "focus:border-primary/45",
  "focus:ring-4 focus:ring-primary/10",
].join(" ");

export function DialogCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (
    checked: boolean,
  ) => void;
  label: string;
}) {
  return (
    <label
      className={[
        "flex cursor-pointer",
        "items-center justify-between",
        "gap-4 rounded-[13px]",
        "border border-border/55",
        "bg-muted/[0.12]",
        "px-3.5 py-3",
        "transition",
        "hover:bg-muted/[0.2]",
      ].join(" ")}
    >
      <span className="text-[13px] font-medium text-foreground/85">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}

export function DialogActions({
  onClose,
  onSave,
  disabled,
}: {
  onClose: () => void;
  onSave: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={[
        "mt-5 flex justify-end",
        "gap-2.5",
        "border-t border-border/45",
        "pt-4",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClose}
        className={[
          "h-9 rounded-full",
          "border border-border/65",
          "bg-background px-4",
          "text-[13px] font-medium",
          "text-foreground/75",
          "transition-colors",
          "hover:bg-muted/45",
          "hover:text-foreground",
        ].join(" ")}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className={[
          "inline-flex h-9",
          "items-center gap-2",
          "rounded-full",
          "bg-primary px-4",
          "text-[13px] font-medium",
          "text-primary-foreground",
          "shadow-[0_8px_20px_rgba(98,74,180,0.16)]",
          "transition",
          "hover:-translate-y-0.5",
          "hover:bg-primary/90",
          "disabled:cursor-not-allowed",
          "disabled:translate-y-0",
          "disabled:opacity-50",
        ].join(" ")}
      >
        <Save
          size={14}
          strokeWidth={1.8}
        />

        Save
      </button>
    </div>
  );
}
