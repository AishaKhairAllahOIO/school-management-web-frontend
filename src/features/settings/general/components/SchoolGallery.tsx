import {
  ImagePlus,
  Trash2,
} from "lucide-react";

import {
  useDeleteSchoolImage,
  useUploadSchoolImage,
} from "@/features/settings/general/hooks/useGeneralSettings";

import type { SchoolImage } from "@/features/settings/general/types/general-settings.types";

type Props = {
  images: SchoolImage[];
};

export function SchoolGallery({ images }: Props) {
  const uploadMutation = useUploadSchoolImage();
  const deleteMutation = useDeleteSchoolImage();

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    uploadMutation.mutate(file);
  }

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">
            School Gallery
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Images displayed around the system.
          </p>
        </div>

        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-2xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft">
          <ImagePlus size={14} />

          Upload

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-2xl border border-border/70"
          >
            <img
              src={image.url}
              alt={image.name}
              className="h-28 w-full object-cover"
            />

            <button
              type="button"
              onClick={() =>
                deleteMutation.mutate(image.id)
              }
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-destructive opacity-0 shadow-soft transition group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
          No images uploaded
        </div>
      )}
    </section>
  );
}