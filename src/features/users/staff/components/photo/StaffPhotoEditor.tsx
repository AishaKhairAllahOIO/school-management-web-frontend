import type { ChangeEvent } from "react";
import { UserPhotoCard } from "../../../shared/components/UserPhotoCard";
import type { StaffSectionColor } from "../../types/staff.types";
import { defaultStaffSectionColor } from "../theme/staff-theme";

type StaffPhotoEditorProps = {
  photoUrl: string | null;
  title?: string;
  description?: string;
  emptyLabel?: string;
  replaceLabel?: string;
  chooseLabel?: string;
  disabled?: boolean;
  color?: StaffSectionColor;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

export function StaffPhotoEditor({
  photoUrl,
  title = "Profile photo",
  description = "PNG, JPG or WEBP. Click the card to choose an image.",
  disabled = false,
  color = defaultStaffSectionColor,
  onChange,
}: StaffPhotoEditorProps) {
  return (
    <UserPhotoCard
      title={title}
      description={description}
      photoUrl={photoUrl}
      alt="Staff profile"
      authenticated={Boolean(photoUrl && !photoUrl.startsWith("blob:"))}
      editable
      disabled={disabled}
      accentClassName={[color.light, color.text].join(" ")}
      onChange={onChange}
    />
  );
}
