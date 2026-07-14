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
    <div className="rounded-2xl border border-border/50 bg-muted/10 p-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">
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
          "group mt-4 flex min-h-[190px] w-full",
          "items-center justify-center overflow-hidden",
          "rounded-2xl border border-dashed bg-card",
          "transition hover:border-primary/50 hover:bg-primary/5",
          "disabled:cursor-not-allowed disabled:opacity-60",
          displayedError
            ? "border-destructive/60"
            : "border-border/80",
        ].join(" ")}
      >
        {previewUrl ? (
          <div className="relative flex h-[190px] w-full items-center justify-center">
            <img
              src={previewUrl}
              alt="School logo preview"
              className="h-full w-full object-contain p-5"
            />

            <span className="absolute inset-x-3 bottom-3 rounded-xl bg-foreground/80 px-3 py-2 text-center text-[11px] font-bold text-background opacity-0 backdrop-blur transition group-hover:opacity-100">
              Choose another logo
            </span>
          </div>
        ) : (
          <div className="px-6 text-center">
            <ImagePlus
              size={28}
              className="mx-auto text-primary"
            />

            <p className="mt-3 text-xs font-bold text-foreground">
              Upload school logo
            </p>

            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
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
        <p className="mt-2 text-[11px] font-semibold text-destructive">
          {displayedError}
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            inputRef.current?.click()
          }
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-bold text-muted-foreground transition hover:bg-muted disabled:opacity-60"
          >
            <RotateCcw size={14} />
            Undo
          </button>
        ) : null}
      </div>

      {selectedFile ? (
        <div className="mt-3 rounded-xl bg-primary/5 px-3 py-2">
          <p className="truncate text-[11px] font-bold text-foreground">
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