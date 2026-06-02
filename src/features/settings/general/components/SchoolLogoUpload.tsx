import {
  Building2,
  Trash2,
  Upload,
} from "lucide-react";

import {
  useDeleteSchoolLogo,
  useUploadSchoolLogo,
} from "@/features/settings/general/hooks/useGeneralSettings";

import type { GeneralSettings } from "@/features/settings/general/types/general-settings.types";

type Props = {
  data: GeneralSettings;
};

export function SchoolLogoUpload({ data }: Props) {
  const uploadMutation = useUploadSchoolLogo();
  const deleteMutation = useDeleteSchoolLogo();

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    uploadMutation.mutate(file);
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-background/40 p-5">
      <p className="mb-4 text-sm font-bold text-foreground">
        School Logo
      </p>

      <div className="flex h-40 items-center justify-center rounded-3xl border border-border/70 bg-card">
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={data.schoolName}
            className="h-28 w-28 rounded-full object-cover"
          />
        ) : (
          <Building2
            size={60}
            className="text-primary"
          />
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <label className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary/10 text-xs font-bold text-primary transition hover:bg-primary/15">
          <Upload size={14} />

          {uploadMutation.isPending
            ? "Uploading..."
            : "Change Logo"}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          type="button"
          disabled={!data.logoUrl}
          onClick={() => deleteMutation.mutate()}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 text-muted-foreground transition hover:bg-muted disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        PNG, JPG, SVG • Max 2MB
      </p>
    </div>
  );
}