import {
  ImagePlus,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

type SchoolLogoUploadProps = {
  currentLogoUrl: string | null;
  selectedFile: File | null;

  error?: string;
  disabled?: boolean;

  onFileChange: (file: File | null) => void;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const MAX_LOGO_SIZE =
  5 * 1024 * 1024;

export function SchoolLogoUpload({
  currentLogoUrl,
  selectedFile,
  error,
  disabled = false,
  onFileChange,
}: SchoolLogoUploadProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [localError, setLocalError] =
    useState<string | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(
      currentLogoUrl,
    );

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(currentLogoUrl);

      return;
    }

    const objectUrl =
      URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile, currentLogoUrl]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      setLocalError(
        "Choose a JPG, PNG, SVG or WebP image.",
      );

      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLocalError(
        "The logo must be smaller than 5 MB.",
      );

      return;
    }

    setLocalError(null);
    onFileChange(file);
  }

  function undoSelection() {
    setLocalError(null);
    onFileChange(null);
  }

  const displayedError =
    localError ?? error;

  return (
    <div
      className={[
        "rounded-[22px]",
        "bg-muted/[0.28]",
        "p-3.5",
        "transition duration-300",
        "hover:bg-muted/[0.38]",
      ].join(" ")}
    >
      <div className="px-1">
        <h3 className="text-sm font-semibold text-foreground">
          School Logo
        </h3>

        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
          Upload the visual identity used across
          the school system.
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          inputRef.current?.click()
        }
        className={[
          "group relative mt-3",
          "flex min-h-[210px] w-full",
          "items-center justify-center",
          "overflow-hidden rounded-[20px]",
          "border border-dashed",
          "bg-card",
          "transition duration-300",
          "hover:-translate-y-0.5",
          "hover:border-primary/30",
          "hover:shadow-[0_12px_30px_rgba(30,20,70,0.08)]",
          "disabled:cursor-not-allowed",
          "disabled:translate-y-0",
          "disabled:opacity-60",
          displayedError
            ? "border-destructive/45"
            : "border-border/65",
        ].join(" ")}
      >
        {previewUrl ? (
          <div className="relative flex h-[210px] w-full items-center justify-center">
            <img
              src={previewUrl}
              alt="School logo preview"
              className="h-full w-full object-contain p-7"
            />

            <div
              className={[
                "absolute inset-0",
                "flex items-end justify-center",
                "bg-gradient-to-t",
                "from-foreground/40",
                "via-transparent",
                "to-transparent",
                "p-3",
                "opacity-0",
                "transition duration-300",
                "group-hover:opacity-100",
              ].join(" ")}
            >
              <span className="rounded-full bg-card/95 px-4 py-2 text-[11px] font-semibold text-foreground shadow-lg backdrop-blur">
                Choose another logo
              </span>
            </div>
          </div>
        ) : (
          <div className="px-6 text-center">
            <span
              className={[
                "mx-auto flex h-14 w-14",
                "items-center justify-center",
                "rounded-[18px]",
                "bg-primary/[0.08]",
                "text-primary",
                "transition duration-300",
                "group-hover:scale-105",
                "group-hover:bg-primary/[0.12]",
              ].join(" ")}
            >
              <ImagePlus
                size={25}
                strokeWidth={1.75}
              />
            </span>

            <p className="mt-4 text-xs font-semibold text-foreground">
              Upload school logo
            </p>

            <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">
              JPG, PNG, SVG or WebP · Max 5 MB
            </p>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      {displayedError ? (
        <p className="mt-2 px-1 text-[11px] font-medium text-destructive">
          {displayedError}
        </p>
      ) : null}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            inputRef.current?.click()
          }
          className={[
            "flex h-10 flex-1",
            "items-center justify-center gap-2",
            "rounded-full bg-primary",
            "px-4",
            "text-xs font-semibold",
            "text-primary-foreground",
            "shadow-[0_8px_20px_rgba(98,74,180,0.16)]",
            "transition duration-200",
            "hover:-translate-y-0.5",
            "hover:bg-primary/90",
            "disabled:cursor-not-allowed",
            "disabled:translate-y-0",
            "disabled:opacity-60",
          ].join(" ")}
        >
          {disabled ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Upload size={15} />
          )}

          {previewUrl
            ? "Replace Logo"
            : "Choose Logo"}
        </button>

        {selectedFile ? (
          <button
            type="button"
            disabled={disabled}
            onClick={undoSelection}
            className={[
              "flex h-10 items-center",
              "justify-center gap-2",
              "rounded-full",
              "bg-card px-4",
              "text-xs font-semibold",
              "text-muted-foreground",
              "shadow-[0_5px_16px_rgba(30,20,70,0.05)]",
              "transition duration-200",
              "hover:bg-muted",
              "hover:text-foreground",
              "disabled:opacity-60",
            ].join(" ")}
          >
            <RotateCcw size={14} />
            Undo
          </button>
        ) : null}
      </div>

      {selectedFile ? (
        <div
          className={[
            "mt-3 rounded-[16px]",
            "bg-card px-3.5 py-2.5",
            "shadow-[0_5px_16px_rgba(30,20,70,0.035)]",
          ].join(" ")}
        >
          <p className="truncate text-[11px] font-semibold text-foreground">
            {selectedFile.name}
          </p>

          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {(
              selectedFile.size /
              1024 /
              1024
            ).toFixed(2)}{" "}
            MB
          </p>
        </div>
      ) : null}
    </div>
  );
}