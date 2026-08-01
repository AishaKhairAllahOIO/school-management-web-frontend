import type { LucideIcon } from "lucide-react";

export type TopbarMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export type ProfileMenuItemProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  tone?: "default" | "primary";
};

export type UserRoleSource = {
  category?: string;
  role?: string;
};