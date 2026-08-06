import type {
  StaffSectionColor,
} from "../../types/staff.types";

export const defaultStaffSectionColor: StaffSectionColor = {
  background: "bg-primary",
  light: "bg-primary/[0.08]",
  text: "text-primary",
  border: "border-primary/20",
  hover:
    "hover:border-primary/30 hover:bg-primary/[0.07] hover:text-primary",
  ring: "focus-visible:ring-primary/15",
  button:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  footer:
    "bg-primary/[0.035] hover:bg-primary/[0.07]",
  fieldHover:
    "hover:border-primary/25 hover:bg-card",
  fieldFocus:
    "focus:border-primary/40 focus:bg-card",
  fieldRing:
    "focus:ring-primary/[0.10]",
  itemHover:
    "hover:border-primary/20 hover:bg-primary/[0.035]",
};

export function getStaffFieldClassName(
  color: StaffSectionColor,
): string {
  return [
    "h-12 w-full rounded-[16px]",
    "border border-border/70 bg-muted/25 px-4",
    "text-sm font-normal text-foreground",
    "outline-none transition duration-200",
    "placeholder:text-muted-foreground/70",
    color.fieldHover,
    color.fieldFocus,
    "focus:ring-4",
    color.fieldRing,
    "disabled:cursor-not-allowed",
    "disabled:opacity-60",
  ].join(" ");
}
