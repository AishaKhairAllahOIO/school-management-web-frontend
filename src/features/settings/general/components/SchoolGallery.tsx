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
      <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              School Gallery
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Upload school photos and add clear,
              descriptive names.
            </p>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-4 text-xs font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
            <p className="text-[11px] font-semibold text-destructive">
              {selectionError}
            </p>
          </div>
        ) : null}

        {pendingImages.length > 0 ? (
          <div className="mt-5 space-y-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="grid gap-4">
              {pendingImages.map(
                (image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="relative aspect-video bg-muted">
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
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-destructive shadow-soft transition hover:bg-destructive/10"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="p-3">
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-bold text-foreground/80">
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
                          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        />
                      </label>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={
                  clearPendingImages
                }
                className="h-10 rounded-xl border border-border px-4 text-xs font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                disabled={
                  !canUpload || isPending
                }
                onClick={handleUpload}
                className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center">
            <p className="text-xs font-bold text-destructive">
              Failed to load gallery images.
            </p>

            <button
              type="button"
              onClick={() => {
                void refetchImages();
              }}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground transition hover:bg-muted"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : null}

        {isLoadingImages ? (
          <div className="mt-5 flex h-40 items-center justify-center rounded-2xl border border-border bg-muted/20">
            <Loader2
              size={22}
              className="animate-spin text-primary"
            />
          </div>
        ) : null}

        {!isLoadingImages &&
        !isImagesError ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
            {galleryImages.map(
              (image) => (
                <article
                  key={image.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={image.url}
                      alt={image.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                      <button
                        type="button"
                        aria-label={`Edit ${image.name}`}
                        disabled={isPending}
                        onClick={() =>
                          setEditingImage(
                            image,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-primary shadow-soft transition hover:bg-primary/10"
                      >
                        <Pencil
                          size={14}
                        />
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
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-destructive shadow-soft transition hover:bg-destructive/10"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-bold text-foreground">
                      {image.name}
                    </p>
                  </div>
                </article>
              ),
            )}

            {galleryImages.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center sm:col-span-2 2xl:col-span-1">
                <ImagePlus
                  size={28}
                  className="mx-auto text-muted-foreground"
                />

                <p className="mt-3 text-sm font-bold text-foreground">
                  No gallery images
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
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
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border/60 p-6">
          <div>
            <h2
              id="edit-image-title"
              className="text-lg font-bold text-foreground"
            >
              Edit Gallery Image
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Update the image name, replace its
              file, or change both.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isPending}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </header>

        <div className="p-6">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-border bg-muted/30">
              <Loader2
                size={22}
                className="animate-spin text-primary"
              />
            </div>
          ) : (
            <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={previewUrl}
                alt={image.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-foreground">
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
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-foreground">
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
                className="block w-full rounded-xl border border-border bg-background p-3 text-xs disabled:opacity-60"
              />
            </label>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border/60 bg-muted/10 p-5">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-10 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
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
            className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
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
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle size={22} />
            </span>

            <div className="min-w-0">
              <h2
                id="delete-image-title"
                className="text-lg font-bold text-foreground"
              >
                Delete Gallery Image?
              </h2>

              <p
                id="delete-image-description"
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                The image{" "}
                <strong className="font-bold text-foreground">
                  {image.name}
                </strong>{" "}
                will be permanently removed from
                the school gallery.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={image.url}
              alt={image.name}
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border/60 bg-muted/10 p-5">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-10 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep Image
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="flex h-10 items-center gap-2 rounded-xl bg-destructive px-5 text-xs font-bold text-destructive-foreground transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
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