import {
  Building2,
  Check,
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
  onFileChange: (
    file: File | null,
  ) => void;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const MAX_LOGO_SIZE =
  5 * 1024 * 1024;

const FEATURED_MEDIA_SIZE = 208;

export function SchoolLogoUpload({
  currentLogoUrl,
  selectedFile,
  error,
  disabled = false,
  onFileChange,
}: SchoolLogoUploadProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

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
      URL.createObjectURL(
        selectedFile,
      );

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [
    selectedFile,
    currentLogoUrl,
  ]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ??
      null;

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

    if (
      file.size > MAX_LOGO_SIZE
    ) {
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

  const isComplete =
    Boolean(previewUrl);

  return (
    <section
      className={[
        "relative h-fit w-full",
        "self-start",
        "rounded-[22px]",
        "border border-border/45",
        "bg-card",
        "p-4",
        "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
      ].join(" ")}
    >
      {isComplete ? (
        <span
          className={[
            "absolute right-4 top-4 z-10",
            "flex h-7 w-7",
            "items-center justify-center",
            "rounded-full",
            "border border-emerald-500/20",
            "bg-emerald-500/10",
            "text-emerald-600",
          ].join(" ")}
          title="School logo completed"
          aria-label="School logo completed"
        >
          <Check
            size={15}
            strokeWidth={2.5}
          />
        </span>
      ) : null}

      <div
        className={[
          "flex min-h-[56px]",
          "items-start gap-3 pr-9",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-9 w-9 shrink-0",
            "items-center justify-center",
            "rounded-[13px]",
            "bg-primary/[0.08]",
            "text-primary",
          ].join(" ")}
        >
          <Building2
            size={17}
            strokeWidth={1.75}
          />
        </span>

        <div className="min-w-0 pt-0.5">
          <h2
            className={[
              "text-[15px]",
              "font-semibold",
              "text-foreground",
            ].join(" ")}
          >
            School Logo
          </h2>

          <p
            className={[
              "mt-1 text-[11px]",
              "leading-4",
              "text-muted-foreground",
            ].join(" ")}
          >
            School visual identity.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          disabled={disabled}
          onClick={openFilePicker}
          style={{
            width:
              FEATURED_MEDIA_SIZE,
            height:
              FEATURED_MEDIA_SIZE,
          }}
          className={[
            "group relative max-w-full",
            "overflow-hidden",
            "rounded-[14px]",
            "border border-dashed",
            "bg-muted/[0.16]",
            "outline-none",
            "transition duration-200",
            "hover:border-primary/40",
            "hover:bg-primary/[0.03]",
            "focus-visible:ring-4",
            "focus-visible:ring-primary/[0.10]",
            "disabled:cursor-not-allowed",
            "disabled:opacity-60",
            displayedError
              ? "border-destructive/45"
              : "border-border/80",
          ].join(" ")}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="School logo preview"
                className={[
                  "h-full w-full",
                  "object-contain p-4",
                ].join(" ")}
              />

              <div
                className={[
                  "absolute inset-0",
                  "flex items-end",
                  "justify-center",
                  "bg-gradient-to-t",
                  "from-foreground/35",
                  "via-transparent",
                  "to-transparent",
                  "p-3",
                  "opacity-0",
                  "transition duration-200",
                  "group-hover:opacity-100",
                  "group-focus-visible:opacity-100",
                ].join(" ")}
              >
                <span
                  className={[
                    "rounded-full",
                    "border border-border/60",
                    "bg-card/95",
                    "px-3 py-1.5",
                    "text-[10px]",
                    "font-medium",
                    "text-foreground",
                    "shadow-sm",
                    "backdrop-blur",
                  ].join(" ")}
                >
                  Replace logo
                </span>
              </div>
            </>
          ) : (
            <div
              className={[
                "flex h-full w-full",
                "flex-col",
                "items-center",
                "justify-center",
                "px-4 text-center",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-11 w-11",
                  "items-center",
                  "justify-center",
                  "rounded-[14px]",
                  "bg-primary/[0.08]",
                  "text-primary",
                  "transition duration-200",
                  "group-hover:scale-105",
                ].join(" ")}
              >
                {disabled ? (
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />
                ) : (
                  <ImagePlus
                    size={21}
                    strokeWidth={1.8}
                  />
                )}
              </span>

              <p
                className={[
                  "mt-2.5",
                  "text-[11px]",
                  "font-medium",
                  "text-foreground",
                ].join(" ")}
              >
                Add logo
              </p>

              <p
                className={[
                  "mt-1 text-[9px]",
                  "leading-4",
                  "text-muted-foreground",
                ].join(" ")}
              >
                JPG, PNG, SVG or WebP
              </p>
            </div>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      {displayedError ? (
        <div
          className={[
            "mt-3 rounded-[14px]",
            "bg-destructive/[0.045]",
            "px-3 py-2.5",
          ].join(" ")}
        >
          <p
            className={[
              "text-[10px]",
              "font-medium leading-4",
              "text-destructive",
            ].join(" ")}
          >
            {displayedError}
          </p>
        </div>
      ) : null}

      {selectedFile ? (
        <div
          className={[
            "mt-4 flex",
            "items-center",
            "justify-end gap-2",
            "border-t",
            "border-border/45",
            "pt-4",
          ].join(" ")}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={undoSelection}
            className={[
              "flex h-9 min-w-0",
              "items-center",
              "justify-center",
              "gap-1.5",
              "rounded-full",
              "border",
              "border-border/70",
              "bg-background",
              "px-3",
              "text-[11px]",
              "font-semibold",
              "text-foreground/70",
              "transition duration-200",
              "hover:bg-muted/55",
              "hover:text-foreground",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",
            ].join(" ")}
          >
            <RotateCcw
              size={13}
              className="shrink-0"
            />

            <span>Undo</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={openFilePicker}
            className={[
              "flex h-9 min-w-0",
              "items-center",
              "justify-center",
              "gap-1.5",
              "rounded-full",
              "bg-primary",
              "px-3",
              "text-[11px]",
              "font-semibold",
              "text-primary-foreground",
              "shadow-[0_8px_20px_rgba(98,74,180,0.16)]",
              "transition duration-200",
              "hover:-translate-y-0.5",
              "hover:bg-primary/90",
              "disabled:cursor-not-allowed",
              "disabled:translate-y-0",
              "disabled:opacity-50",
            ].join(" ")}
          >
            {disabled ? (
              <Loader2
                size={14}
                className={[
                  "shrink-0",
                  "animate-spin",
                ].join(" ")}
              />
            ) : (
              <Upload
                size={14}
                className="shrink-0"
              />
            )}

            <span>Replace</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}