export const USER_NATIONALITIES = [
  { value: "syrian", label: "Syrian" },
  { value: "lebanese", label: "Lebanese" },
  { value: "palestinian", label: "Palestinian" },
  { value: "jordanian", label: "Jordanian" },
  { value: "other", label: "Other" },
] as const;

export type UserNationalityValue =
  (typeof USER_NATIONALITIES)[number]["value"];

export function formatUserNationality(
  value?: string | null,
): string {
  return (
    USER_NATIONALITIES.find(
      (item) => item.value === value,
    )?.label ?? "Not specified"
  );
}
