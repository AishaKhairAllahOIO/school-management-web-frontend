import {
  AlertTriangle,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
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
} from "react";

import {
  useAddSchoolImages,
  useDeleteSchoolImage,
  useSchoolImage,
  useSchoolImages,
  useUpdateSchoolImage,
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

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

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

  const [editingImage, setEditingImage] =
    useState<SchoolImage | null>(null);

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

  const {
    data: editingImageDetails,
    isLoading:
      isLoadingImageDetails,
  } = useSchoolImage(
    editingImage?.id ?? null,
  );

  const addImagesMutation =
    useAddSchoolImages();

  const updateImageMutation =
    useUpdateSchoolImage();

  const deleteImageMutation =
    useDeleteSchoolImage();

  const isPending =
    addImagesMutation.isPending ||
    updateImageMutation.isPending ||
    deleteImageMutation.isPending;

  const canUpload =
    pendingImages.length > 0 &&
    pendingImages.every(
      (image) =>
        image.name.trim().length > 0,
    );

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

  function handleFilesChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files ?? [],
    );

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const invalidFile = files.find(
      (file) =>
        validateImageFile(file) !== null,
    );

    if (invalidFile) {
      setSelectionError(
        validateImageFile(invalidFile),
      );

      return;
    }

    setSelectionError(null);

    const nextImages = files.map(
      (file): PendingImage => ({
        file,
        name: file.name.replace(
          /\.[^/.]+$/,
          "",
        ),
        previewUrl:
          URL.createObjectURL(file),
      }),
    );

    setPendingImages((current) => [
      ...current,
      ...nextImages,
    ]);
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

  function updatePendingName(
    index: number,
    name: string,
  ) {
    setPendingImages((current) =>
      current.map(
        (image, itemIndex) =>
          itemIndex === index
            ? {
                ...image,
                name,
              }
            : image,
      ),
    );
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
            name: name.trim(),
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

  const resolvedEditingImage =
    editingImageDetails ??
    editingImage;

  return (
    <>
      <section
        className={[
          "rounded-[26px]",
          "border border-border/45",
          "bg-card",
          "p-5 sm:p-6",
          "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">
              <ImagePlus
                size={18}
                strokeWidth={1.75}
              />
            </span>

            <div className="pt-0.5">
              <h2 className="text-[15px] font-semibold text-foreground">
                School Gallery
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Upload school photos and add clear,
                descriptive names.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className={[
              "flex h-10 shrink-0",
              "items-center justify-center gap-2",
              "rounded-full",
              "bg-muted/55 px-4",
              "text-xs font-semibold",
              "text-foreground/80",
              "transition duration-200",
              "hover:bg-muted",
              "hover:text-foreground",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",
            ].join(" ")}
          >
            <Plus size={15} />
            Select Images
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
            multiple
            className="hidden"
            onChange={handleFilesChange}
          />
        </div>

        {selectionError ? (
          <div className="mt-5 rounded-[16px] bg-destructive/[0.045] px-4 py-3">
            <p className="text-[11px] font-medium text-destructive">
              {selectionError}
            </p>
          </div>
        ) : null}

        {pendingImages.length > 0 ? (
          <div
            className={[
              "mt-5 rounded-[22px]",
              "bg-primary/[0.035]",
              "p-4",
            ].join(" ")}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingImages.map(
                (image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className={[
                      "overflow-hidden",
                      "rounded-[20px]",
                      "bg-card",
                      "shadow-[0_8px_24px_rgba(30,20,70,0.06)]",
                    ].join(" ")}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={
                          image.previewUrl
                        }
                        alt={image.name}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        aria-label="Remove selected image"
                        disabled={isPending}
                        onClick={() =>
                          removePendingImage(
                            index,
                          )
                        }
                        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-destructive shadow-lg backdrop-blur transition hover:scale-105 hover:bg-card"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="p-3.5">
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-semibold text-foreground/75">
                          Image Name
                        </span>

                        <input
                          value={image.name}
                          disabled={isPending}
                          onChange={(event) =>
                            updatePendingName(
                              index,
                              event.target
                                .value,
                            )
                          }
                          className={[
                            "h-10 w-full",
                            "rounded-[14px]",
                            "border border-transparent",
                            "bg-muted/[0.42]",
                            "px-3",
                            "text-sm font-medium",
                            "text-foreground",
                            "outline-none transition",
                            "hover:bg-muted/60",
                            "focus:border-primary/20",
                            "focus:bg-background",
                            "focus:ring-4 focus:ring-primary/[0.07]",
                          ].join(" ")}
                        />
                      </label>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={
                  clearPendingImages
                }
                className="h-10 rounded-full bg-card px-5 text-xs font-semibold text-foreground/75 shadow-sm transition hover:bg-muted disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                disabled={
                  !canUpload || isPending
                }
                onClick={handleUpload}
                className={[
                  "flex h-10 items-center",
                  "justify-center gap-2",
                  "rounded-full bg-primary",
                  "px-5",
                  "text-xs font-semibold",
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
                {addImagesMutation.isPending ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Upload size={15} />
                )}

                Upload Images
              </button>
            </div>
          </div>
        ) : null}

        {isImagesError ? (
          <div className="mt-5 rounded-[20px] bg-destructive/[0.035] p-6 text-center">
            <p className="text-xs font-semibold text-destructive">
              Failed to load gallery images.
            </p>

            <button
              type="button"
              onClick={() => {
                void refetchImages();
              }}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-card px-4 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : null}

        {isLoadingImages ? (
          <div className="mt-5 flex h-44 items-center justify-center rounded-[22px] bg-muted/[0.28]">
            <Loader2
              size={22}
              className="animate-spin text-primary"
            />
          </div>
        ) : null}

        {!isLoadingImages &&
        !isImagesError ? (
          <div className="mt-5 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {galleryImages.map(
              (image) => (
                <article
                  key={image.id}
                  className={[
                    "group relative mb-4",
                    "break-inside-avoid",
                    "overflow-hidden",
                    "rounded-[22px]",
                    "bg-muted/25",
                    "transition duration-300",
                    "hover:-translate-y-1",
                    "hover:shadow-[0_16px_36px_rgba(30,20,70,0.12)]",
                  ].join(" ")}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      loading="lazy"
                      className={[
                        "h-auto min-h-[170px]",
                        "w-full object-cover",
                        "transition duration-500",
                        "group-hover:scale-[1.035]",
                      ].join(" ")}
                    />

                    <div
                      className={[
                        "absolute inset-0",
                        "bg-gradient-to-t",
                        "from-foreground/45",
                        "via-transparent",
                        "to-transparent",
                        "opacity-0",
                        "transition duration-300",
                        "group-hover:opacity-100",
                        "group-focus-within:opacity-100",
                      ].join(" ")}
                    />

                    <div
                      className={[
                        "absolute right-3 top-3",
                        "flex gap-2",
                        "translate-y-1",
                        "opacity-0",
                        "transition duration-200",
                        "group-hover:translate-y-0",
                        "group-hover:opacity-100",
                        "group-focus-within:translate-y-0",
                        "group-focus-within:opacity-100",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        aria-label={`Edit ${image.name}`}
                        disabled={isPending}
                        onClick={() =>
                          setEditingImage(
                            image,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-primary shadow-lg backdrop-blur transition hover:scale-105 hover:bg-card"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${image.name}`}
                        disabled={isPending}
                        onClick={() =>
                          setDeletingImage(
                            image,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-destructive shadow-lg backdrop-blur transition hover:scale-105 hover:bg-card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {image.name}
                    </p>
                  </div>
                </article>
              ),
            )}

            {galleryImages.length ===
            0 ? (
              <div className="break-inside-avoid rounded-[22px] bg-muted/[0.25] p-9 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-card text-muted-foreground shadow-sm">
                  <ImagePlus
                    size={25}
                    strokeWidth={1.7}
                  />
                </span>

                <p className="mt-4 text-sm font-semibold text-foreground">
                  No gallery images
                </p>

                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground">
                  Select image files to build the
                  school gallery.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {resolvedEditingImage ? (
        <EditSchoolImageDialog
          key={[
            resolvedEditingImage.id,
            resolvedEditingImage.url,
            resolvedEditingImage.name,
          ].join("-")}
          image={
            resolvedEditingImage
          }
          isLoading={
            isLoadingImageDetails
          }
          isPending={
            updateImageMutation.isPending
          }
          onClose={() =>
            setEditingImage(null)
          }
          onSave={(payload) =>
            updateImageMutation.mutate(
              payload,
              {
                onSuccess: () => {
                  setEditingImage(null);
                },
              },
            )
          }
        />
      ) : null}

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

function EditSchoolImageDialog({
  image,
  isLoading,
  isPending,
  onClose,
  onSave,
}: {
  image: SchoolImage;
  isLoading: boolean;
  isPending: boolean;

  onClose: () => void;

  onSave: (payload: {
    imageId: string;
    name?: string;
    file?: File;
  }) => void;
}) {
  const [name, setName] =
    useState(image.name);

  const [file, setFile] =
    useState<File | undefined>();

  const [previewUrl, setPreviewUrl] =
    useState(image.url);

  const objectUrlRef =
    useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current,
        );
      }
    };
  }, []);

  useEffect(() => {
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
  }, [isPending, onClose]);

  function handleReplacementFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const nextFile =
      event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(
        objectUrlRef.current,
      );
    }

    const nextPreviewUrl =
      URL.createObjectURL(nextFile);

    objectUrlRef.current =
      nextPreviewUrl;

    setFile(nextFile);
    setPreviewUrl(nextPreviewUrl);
  }

  const normalizedName = name.trim();

  const hasChanges =
    normalizedName !== image.name ||
    Boolean(file);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-image-title"
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
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-border/45 bg-card shadow-[0_28px_80px_rgba(20,15,45,0.2)]">
        <header className="flex items-start justify-between px-6 pb-5 pt-6">
          <div>
            <h2
              id="edit-image-title"
              className="text-lg font-semibold text-foreground"
            >
              Edit Gallery Image
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Update the image name or replace its
              file.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isPending}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/55 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </header>

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex h-52 items-center justify-center rounded-[22px] bg-muted/[0.3]">
              <Loader2
                size={22}
                className="animate-spin text-primary"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-[22px] bg-muted">
              <img
                src={previewUrl}
                alt={image.name}
                className="aspect-video h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-foreground/80">
                Image Name
              </span>

              <input
                value={name}
                disabled={
                  isPending || isLoading
                }
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-[16px] border border-transparent bg-muted/[0.4] px-4 text-sm font-medium text-foreground outline-none transition hover:bg-muted/55 focus:border-primary/20 focus:bg-background focus:ring-4 focus:ring-primary/[0.07] disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-foreground/80">
                Replace Image
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
                disabled={
                  isPending || isLoading
                }
                onChange={
                  handleReplacementFile
                }
                className="block w-full rounded-[16px] bg-muted/[0.4] p-3 text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-card file:px-4 file:py-2 file:text-xs file:font-semibold file:text-foreground disabled:opacity-60"
              />
            </label>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 bg-muted/[0.2] px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-10 rounded-full bg-card px-5 text-xs font-semibold text-foreground/75 shadow-sm transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              !hasChanges ||
              !normalizedName ||
              isPending ||
              isLoading
            }
            onClick={() =>
              onSave({
                imageId: image.id,
                name:
                  normalizedName !==
                  image.name
                    ? normalizedName
                    : undefined,
                file,
              })
            }
            className="flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Pencil size={15} />
            )}

            {isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </footer>
      </div>
    </div>
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
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-border/45 bg-card shadow-[0_28px_80px_rgba(20,15,45,0.2)]">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
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
                className="mt-1.5 text-sm leading-6 text-muted-foreground"
              >
                The image{" "}
                <strong className="font-semibold text-foreground">
                  {image.name}
                </strong>{" "}
                will be permanently removed.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] bg-muted">
            <img
              src={image.url}
              alt={image.name}
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 bg-muted/[0.2] px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-10 rounded-full bg-card px-5 text-xs font-semibold text-foreground/75 shadow-sm transition hover:bg-muted disabled:opacity-50"
          >
            Keep Image
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="flex h-10 items-center justify-center gap-2 rounded-full bg-destructive px-5 text-xs font-semibold text-destructive-foreground shadow-[0_8px_20px_rgba(180,35,35,0.15)] transition hover:-translate-y-0.5 hover:bg-destructive/90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
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