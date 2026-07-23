import type {
  ChangeEvent,
} from "react";

import {
  Camera,
} from "lucide-react";

import {
  StaffSection,
} from "../layout/StaffSection";

import {
  StaffPhotoEditor,
} from "../photo/StaffPhotoEditor";

type StaffPhotoFormSectionProps = {
  photoUrl: string | null;

  disabled?: boolean;

  mode?: "create" | "edit";

  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  onRemove: () => void;
};

export function StaffPhotoFormSection({
  photoUrl,
  disabled = false,
  mode = "create",
  onChange,
  onRemove,
}: StaffPhotoFormSectionProps) {
  const isEdit =
    mode === "edit";

  return (
    <StaffSection
      eyebrow="Profile"
      title="Profile photo"
      description={
        isEdit
          ? "Update the staff member's profile photo."
          : "Add a clear photo to make the staff profile easier to recognize."
      }
      icon={
        <Camera className="h-5 w-5" />
      }
    >
      <StaffPhotoEditor
        photoUrl={photoUrl}
        disabled={disabled}
        title={
          isEdit
            ? "Change profile photo"
            : "Upload profile photo"
        }
        description={
          isEdit
            ? "Select a new PNG, JPG or WEBP image. The change will be saved with the profile."
            : "PNG, JPG or WEBP. Use a clear square image for the best result."
        }
        emptyLabel={
          isEdit
            ? "No profile photo"
            : "No photo selected"
        }
        onChange={onChange}
        onRemove={onRemove}
      />
    </StaffSection>
  );
}