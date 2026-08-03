import type {
  ChangeEvent,
} from "react";

import type {
  StaffSectionColor,
} from "../../types/staff.types";

import {
  defaultStaffSectionColor,
} from "../theme/staff-theme";


import {
  StaffPhotoEditor,
} from "../photo/StaffPhotoEditor";

type StaffPhotoFormSectionProps = {
  photoUrl: string | null;

  disabled?: boolean;

  color?: StaffSectionColor;

  mode?: "create" | "edit";

  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  onRemove: () => void;
};

export function StaffPhotoFormSection({
  photoUrl,
  disabled = false,
  color = defaultStaffSectionColor,
  mode = "create",
  onChange,
  onRemove,
}: StaffPhotoFormSectionProps) {
  const isEdit =
    mode === "edit";

  return (
      <StaffPhotoEditor
        photoUrl={photoUrl}
        disabled={disabled}
        color={color}
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
  );
}