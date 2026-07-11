import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  useAddSchoolImages,
  useDeleteSchoolImage,
} from "@/features/settings/general/hooks/useGeneralSettings";
import type { SchoolImage } from "@/features/settings/general/types/general-settings.types";

type SchoolGalleryProps = {
  images: SchoolImage[];
};

export function SchoolGallery({
  images,
}: SchoolGalleryProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const addImagesMutation = useAddSchoolImages();
  const deleteImageMutation = useDeleteSchoolImage();

  const isPending =
    addImagesMutation.isPending ||
    deleteImageMutation.isPending;

  function handleAddImage() {
    const normalizedName = name.trim();
    const normalizedUrl = url.trim();

    if (!normalizedName || !normalizedUrl) {
      return;
    }

    addImagesMutation.mutate(
      {
        images: [
          {
            name: normalizedName,
            url: normalizedUrl,
          },
        ],
      },
      {
        onSuccess: () => {
          setName("");
          setUrl("");
        },
      },
    );
  }

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ImagePlus size={20} />
        </span>

        <div>
          <h2 className="text-sm font-bold text-foreground">
            School Gallery
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Add public image links displayed around the system.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <input
          type="text"
          value={name}
          disabled={isPending}
          placeholder="Image name"
          onChange={(event) => setName(event.target.value)}
          className="h-11 w-full rounded-xl border border-border/70 bg-card px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
        />

        <input
          type="url"
          value={url}
          disabled={isPending}
          placeholder="https://example.com/school-image.jpg"
          onChange={(event) => setUrl(event.target.value)}
          className="h-11 w-full rounded-xl border border-border/70 bg-card px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
        />

        <button
          type="button"
          disabled={
            isPending ||
            name.trim().length === 0 ||
            url.trim().length === 0
          }
          onClick={handleAddImage}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addImagesMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImagePlus size={16} />
          )}

          Add Image
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {images.map((image) => (
          <article
            key={image.id}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted"
          >
            <img
              src={image.url}
              alt={image.name}
              className="h-36 w-full object-cover"
            />

            <div className="p-3">
              <p className="truncate text-xs font-bold text-foreground">
                {image.name}
              </p>
            </div>

            <button
              type="button"
              aria-label={`Delete ${image.name}`}
              disabled={deleteImageMutation.isPending}
              onClick={() =>
                deleteImageMutation.mutate(image.id)
              }
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-destructive opacity-0 shadow-soft transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={15} />
            </button>
          </article>
        ))}

        {images.length === 0 ? (
          <div className="col-span-full flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-border text-xs font-semibold text-muted-foreground">
            No images added
          </div>
        ) : null}
      </div>
    </section>
  );
}