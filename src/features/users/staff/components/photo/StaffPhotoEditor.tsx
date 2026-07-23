import type {
  ChangeEvent,
} from "react";

import {
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react";

type StaffPhotoEditorProps = {
  photoUrl: string | null;

  title?: string;
  description?: string;

  emptyLabel?: string;
  replaceLabel?: string;
  chooseLabel?: string;

  disabled?: boolean;

  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  onRemove: () => void;
};

export function StaffPhotoEditor({
  photoUrl,
  title = "Profile photo",
  description = "Select a clear PNG, JPG or WEBP image.",
  emptyLabel = "No profile photo",
  replaceLabel = "Replace photo",
  chooseLabel = "Choose photo",
  disabled = false,
  onChange,
  onRemove,
}: StaffPhotoEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
      <div
        className={[
          "relative mx-auto",
          "h-40 w-40 overflow-hidden",
          "rounded-[26px]",
          "border border-border/70",
          "bg-muted/30",
          "shadow-[var(--shadow-card)]",
          "lg:mx-0",
        ].join(" ")}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Staff profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={[
              "flex h-full w-full",
              "flex-col items-center",
              "justify-center gap-3",
              "text-muted-foreground",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-14 w-14",
                "items-center justify-center",
                "rounded-[18px]",
                "bg-primary/[0.07]",
                "text-primary",
              ].join(" ")}
            >
              <Camera className="h-6 w-6" />
            </span>

            <span className="text-xs font-medium">
              {emptyLabel}
            </span>
          </div>
        )}
      </div>

      <div
        className={[
          "flex min-h-40 flex-col",
          "justify-center",
          "rounded-[22px]",
          "border border-dashed",
          "border-border",
          "bg-muted/20",
          "p-5",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              "flex h-11 w-11",
              "shrink-0 items-center",
              "justify-center",
              "rounded-[15px]",
              "bg-primary/[0.07]",
              "text-primary",
            ].join(" ")}
          >
            <ImagePlus className="h-5 w-5" />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <label
            className={[
              "inline-flex h-10",
              "items-center justify-center gap-2",
              "rounded-xl",
              "border border-border",
              "bg-card px-4",
              "text-xs font-semibold",
              "text-foreground",
              "shadow-[var(--shadow-card)]",
              "transition",
              "hover:border-primary/20",
              "hover:bg-primary/[0.025]",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer",
            ].join(" ")}
          >
            <Camera className="h-4 w-4" />

            {photoUrl
              ? replaceLabel
              : chooseLabel}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={disabled}
              onChange={onChange}
              className="hidden"
            />
          </label>

          {photoUrl ? (
            <button
              type="button"
              disabled={disabled}
              onClick={onRemove}
              className={[
                "inline-flex h-10",
                "items-center justify-center gap-2",
                "rounded-xl",
                "border border-destructive/15",
                "bg-destructive/[0.04]",
                "px-4",
                "text-xs font-semibold",
                "text-destructive",
                "transition",
                "hover:bg-destructive/[0.08]",
                "disabled:cursor-not-allowed",
                "disabled:opacity-50",
              ].join(" ")}
            >
              <Trash2 className="h-4 w-4" />

              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}