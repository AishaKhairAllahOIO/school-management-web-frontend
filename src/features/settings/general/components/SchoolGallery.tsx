import {
  AlertTriangle,
  Check,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import {
  useAddSchoolImages,
  useDeleteSchoolImage,
  useSchoolImages,
} from "@/features/settings/general/hooks/useGeneralSettings";
import type {
  SchoolImage,
  SchoolImageUploadItem,
} from "@/features/settings/general/types/general-settings.types";

type SchoolGalleryProps = {
  images: SchoolImage[];
};

type PendingImage =
  SchoolImageUploadItem & {
    previewUrl: string;
  };

type GalleryMediaItem =
  | {
      kind: "saved";
      id: string;
      url: string;
      name: string;
    }
  | {
      kind: "pending";
      id: string;
      url: string;
      name: string;
      index: number;
    };

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const FEATURED_MEDIA_SIZE = 208;
const SMALL_MEDIA_SIZE = 100;

export function SchoolGallery({
  images,
}: SchoolGalleryProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const pendingImagesRef =
    useRef<PendingImage[]>([]);

  const [pendingImages, setPendingImages] =
    useState<PendingImage[]>([]);

  const [selectionError, setSelectionError] =
    useState<string | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [deletingImage, setDeletingImage] =
    useState<SchoolImage | null>(null);

  pendingImagesRef.current =
    pendingImages;

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach(
        (image) => {
          URL.revokeObjectURL(
            image.previewUrl,
          );
        },
      );
    };
  }, []);

  const {
    data: galleryImages = images,
    isLoading: isLoadingImages,
    isError: isImagesError,
    refetch: refetchImages,
  } = useSchoolImages(images);

  const addImagesMutation =
    useAddSchoolImages();

  const deleteImageMutation =
    useDeleteSchoolImage();

  const isPending =
    addImagesMutation.isPending ||
    deleteImageMutation.isPending;

  const canUpload =
    pendingImages.length > 0;

  const mediaItems: GalleryMediaItem[] = [
    ...galleryImages.map(
      (image): GalleryMediaItem => ({
        kind: "saved",
        id: image.id,
        url: image.url,
        name: image.name,
      }),
    ),
    ...pendingImages.map(
      (image, index): GalleryMediaItem => ({
        kind: "pending",
        id: `${image.file.name}-${index}`,
        url: image.previewUrl,
        name: image.name,
        index,
      }),
    ),
  ];

  function validateImageFile(
    file: File,
  ): string | null {
    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      return `${file.name} is not a supported image type.`;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return `${file.name} is larger than 10 MB.`;
    }

    return null;
  }

  function addFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const invalidFile = files.find(
      (file) => validateImageFile(file) !== null,
    );

    if (invalidFile) {
      setSelectionError(validateImageFile(invalidFile));
      return;
    }

    setSelectionError(null);

    const nextImages = files.map(
      (file): PendingImage => ({
        file,
        name: file.name.replace(/\.[^/.]+$/, ""),
        previewUrl: URL.createObjectURL(file),
      }),
    );

    setPendingImages((current) => [...current, ...nextImages]);
  }

  function handleFilesChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    addFiles(files);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!isPending) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!isPending) {
      addFiles(Array.from(event.dataTransfer.files ?? []));
    }
  }

  function removePendingImage(
    index: number,
  ) {
    setPendingImages((current) => {
      const image = current[index];

      if (image) {
        URL.revokeObjectURL(
          image.previewUrl,
        );
      }

      return current.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      );
    });
  }

  function clearPendingImages() {
    pendingImages.forEach((image) => {
      URL.revokeObjectURL(
        image.previewUrl,
      );
    });

    setPendingImages([]);
    setSelectionError(null);
  }

  function handleUpload() {
    if (!canUpload) {
      return;
    }

    addImagesMutation.mutate(
      {
        images: pendingImages.map(
          ({ file, name }) => ({
            file,
            name,
          }),
        ),
      },
      {
        onSuccess:
          clearPendingImages,
      },
    );
  }

  function confirmDelete() {
    if (!deletingImage) {
      return;
    }

    deleteImageMutation.mutate(
      deletingImage.id,
      {
        onSuccess: () => {
          setDeletingImage(null);
        },
      },
    );
  }

  return (
    <>
      <section
        className={[
          "relative h-fit self-start",
          "rounded-[22px]",
          "border border-border/45",
          "bg-card",
          "p-4",
          "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
        ].join(" ")}
      >
        {galleryImages.length > 0 ? (
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
            title="School gallery completed"
            aria-label="School gallery completed"
          >
            <Check
              size={15}
              strokeWidth={2.5}
            />
          </span>
        ) : null}

        <div className="flex min-h-[56px] items-start gap-3 pr-9">
          <span
            className={[
              "flex h-9 w-9 shrink-0",
              "items-center justify-center",
              "rounded-[13px]",
              "bg-primary/[0.08]",
              "text-primary",
            ].join(" ")}
          >
            <ImagePlus
              size={17}
              strokeWidth={1.75}
            />
          </span>

          <div className="min-w-0 pt-0.5">
            <h2 className="text-[16px] font-semibold text-foreground">
              School Gallery
            </h2>

            <p className="mt-1 text-[12px] leading-4 text-muted-foreground">
              Upload school photos.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
            multiple
            className="hidden"
            onChange={handleFilesChange}
          />
        </div>
        <div
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "relative mt-4 grid content-start items-start",
            "grid-cols-[repeat(auto-fill,minmax(88px,100px))]",
            "auto-rows-[100px] gap-2 rounded-[16px]",
            "transition-colors duration-200",
            isDragging
              ? "bg-primary/[0.05] ring-2 ring-primary/20 ring-offset-4 ring-offset-card"
              : "",
          ].join(" ")}
        >
          {isDragging ? (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[16px] bg-card/88 backdrop-blur-sm">
              <div className="rounded-[15px] border border-primary/20 bg-primary/[0.07] px-5 py-4 text-center">
                <Upload className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-[13px] font-semibold text-foreground">
                  Drop images to add them
                </p>
              </div>
            </div>
          ) : null}
          {mediaItems.map(
            (item, index) => {
              const isFeatured =
                index === 0;

              return (
                <article
                  key={`${item.kind}-${item.id}`}
                  style={{
                    width: isFeatured
                      ? FEATURED_MEDIA_SIZE
                      : SMALL_MEDIA_SIZE,
                    height: isFeatured
                      ? FEATURED_MEDIA_SIZE
                      : SMALL_MEDIA_SIZE,
                  }}
                  className={[
                    "group relative overflow-hidden",
                    "rounded-[13px]",
                    "border border-border/60",
                    "bg-muted/[0.22]",
                    isFeatured
                      ? "col-span-2 row-span-2"
                      : "",
                  ].join(" ")}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className={[
                      "h-full w-full",
                      item.kind === "saved"
                        ? "object-contain p-1.5"
                        : "object-cover",
                    ].join(" ")}
                  />

                  <button
                    type="button"
                    aria-label={
                      item.kind === "saved"
                        ? `Delete ${item.name}`
                        : "Remove selected image"
                    }
                    disabled={isPending}
                    onClick={() => {
                      if (
                        item.kind === "saved"
                      ) {
                        const image =
                          galleryImages.find(
                            (entry) =>
                              entry.id ===
                              item.id,
                          );

                        if (image) {
                          setDeletingImage(
                            image,
                          );
                        }

                        return;
                      }

                      removePendingImage(
                        item.index,
                      );
                    }}
                    className={[
                      "absolute right-1.5 top-1.5",
                      "flex h-6 w-6",
                      "items-center justify-center",
                      "rounded-full",
                      "border border-border/45",
                      "bg-card/95",
                      "text-destructive",
                      "shadow-md",
                      "backdrop-blur",
                      "transition duration-200",
                      "hover:scale-105",
                      "disabled:opacity-50",
                    ].join(" ")}
                  >
                    {item.kind === "saved" ? (
                      <Trash2 size={11} />
                    ) : (
                      <X size={11} />
                    )}
                  </button>

                  {item.kind === "pending" ? (
                    <span
                      className={[
                        "absolute bottom-1.5 left-1.5",
                        "rounded-full",
                        "bg-foreground/65",
                        "px-1.5 py-0.5",
                        "text-[9px] font-medium",
                        "text-background",
                        "backdrop-blur",
                      ].join(" ")}
                    >
                      Pending
                    </span>
                  ) : null}
                </article>
              );
            },
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              fileInputRef.current?.click()
            }
            style={{
              width:
                mediaItems.length === 0
                  ? FEATURED_MEDIA_SIZE
                  : SMALL_MEDIA_SIZE,
              height:
                mediaItems.length === 0
                  ? FEATURED_MEDIA_SIZE
                  : SMALL_MEDIA_SIZE,
            }}
            className={[
              "group flex items-center justify-center",
              "rounded-[13px]",
              "border border-dashed",
              "border-border/80",
              "bg-muted/[0.16]",
              "outline-none",
              "transition duration-200",
              "hover:border-primary/40",
              "hover:bg-primary/[0.03]",
              "focus-visible:ring-4",
              "focus-visible:ring-primary/[0.10]",
              "disabled:opacity-60",
              mediaItems.length === 0
                ? "col-span-2 row-span-2"
                : "",
            ].join(" ")}
          >
            <span
              className={[
                "flex items-center justify-center",
                "bg-primary/[0.08]",
                "text-primary",
                "transition duration-200",
                "group-hover:scale-105",
                mediaItems.length === 0
                  ? "h-11 w-11 rounded-[14px]"
                  : "h-9 w-9 rounded-[12px]",
              ].join(" ")}
            >
              <ImagePlus
                size={
                  mediaItems.length === 0
                    ? 21
                    : 17
                }
                strokeWidth={1.8}
              />
            </span>
          </button>
        </div>

        {selectionError ? (
          <div className="mt-3 rounded-[14px] bg-destructive/[0.045] px-4 py-3">
            <p className="text-[12px] font-medium text-destructive">
              {selectionError}
            </p>
          </div>
        ) : null}

        {pendingImages.length > 0 ? (
          <div
            className={[
              "mt-4 flex flex-wrap",
              "items-center justify-end gap-2",
              "border-t border-border/45",
              "pt-4",
            ].join(" ")}
          >
            <button
              type="button"
              disabled={isPending}
              onClick={clearPendingImages}
              className={[
                "h-9 rounded-full",
                "border border-border/70",
                "bg-background",
                "px-4",
                "text-[12px] font-semibold",
                "text-foreground/70",
                "transition duration-200",
                "hover:bg-muted/55",
                "hover:text-foreground",
                "disabled:opacity-50",
              ].join(" ")}
            >
              Clear
            </button>

            <button
              type="button"
              disabled={!canUpload || isPending}
              onClick={handleUpload}
              className={[
                "flex h-9 items-center",
                "justify-center gap-2",
                "rounded-full bg-primary",
                "px-4",
                "text-[12px] font-semibold",
                "text-primary-foreground",
                "shadow-[0_8px_20px_rgba(98,74,180,0.16)]",
                "transition duration-200",
                "hover:-translate-y-0.5",
                "hover:bg-primary/90",
                "disabled:translate-y-0",
                "disabled:opacity-50",
              ].join(" ")}
            >
              {addImagesMutation.isPending ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Upload size={14} />
              )}

              {addImagesMutation.isPending
                ? "Uploading..."
                : `Upload ${pendingImages.length}`}
            </button>
          </div>
        ) : null}

        {isImagesError ? (
          <div className="mt-4 rounded-[16px] bg-destructive/[0.035] p-5 text-center">
            <p className="text-[13px] font-semibold text-destructive">
              Failed to load gallery images.
            </p>

            <button
              type="button"
              onClick={() => {
                void refetchImages();
              }}
              className={[
                "mt-3 inline-flex h-9",
                "items-center gap-2",
                "rounded-full bg-card",
                "px-4",
                "text-[13px] font-semibold",
                "text-foreground",
                "shadow-sm",
                "transition hover:bg-muted",
              ].join(" ")}
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : null}

        {isLoadingImages ? (
          <div className="mt-4 flex h-36 items-center justify-center rounded-[16px] bg-muted/[0.28]">
            <Loader2
              size={22}
              className="animate-spin text-primary"
            />
          </div>
        ) : null}
      </section>

      <DeleteSchoolImageDialog
        image={deletingImage}
        isPending={
          deleteImageMutation.isPending
        }
        onClose={() =>
          setDeletingImage(null)
        }
        onConfirm={confirmDelete}
      />
    </>
  );
}

function DeleteSchoolImageDialog({
  image,
  isPending,
  onClose,
  onConfirm,
}: {
  image: SchoolImage | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!image) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !isPending
      ) {
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
  }, [image, isPending, onClose]);

  if (!image) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-image-title"
      aria-describedby="delete-image-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isPending
        ) {
          onClose();
        }
      }}
    >
      <div
        className={[
          "w-full max-w-md",
          "overflow-hidden",
          "rounded-[26px]",
          "border border-border/45",
          "bg-card",
          "shadow-[0_28px_80px_rgba(20,15,45,0.2)]",
        ].join(" ")}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span
              className={[
                "flex h-12 w-12 shrink-0",
                "items-center justify-center",
                "rounded-[18px]",
                "bg-destructive/[0.08]",
                "text-destructive",
              ].join(" ")}
            >
              <AlertTriangle
                size={22}
                strokeWidth={1.75}
              />
            </span>

            <div className="min-w-0 pt-0.5">
              <h2
                id="delete-image-title"
                className="text-lg font-semibold text-foreground"
              >
                Delete Gallery Image?
              </h2>

              <p
                id="delete-image-description"
                className="mt-1.5 text-[15px] leading-6 text-muted-foreground"
              >
                The image will be permanently removed.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[18px] bg-muted">
            <img
              src={image.url}
              alt={image.name}
              className="aspect-video w-full object-contain"
            />
          </div>
        </div>

        <footer
          className={[
            "flex flex-col-reverse gap-3",
            "bg-muted/[0.2]",
            "px-6 py-5",
            "sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className={[
              "h-10 rounded-full",
              "bg-card px-5",
              "text-[13px] font-semibold",
              "text-foreground/75",
              "shadow-sm",
              "transition hover:bg-muted",
              "disabled:opacity-50",
            ].join(" ")}
          >
            Keep Image
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={[
              "flex h-10 items-center",
              "justify-center gap-2",
              "rounded-full",
              "bg-destructive px-5",
              "text-[13px] font-semibold",
              "text-destructive-foreground",
              "shadow-[0_8px_20px_rgba(180,35,35,0.15)]",
              "transition",
              "hover:-translate-y-0.5",
              "hover:bg-destructive/90",
              "disabled:translate-y-0",
              "disabled:opacity-60",
            ].join(" ")}
          >
            {isPending ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}

            {isPending
              ? "Deleting..."
              : "Delete Image"}
          </button>
        </footer>
      </div>
    </div>
  );
}