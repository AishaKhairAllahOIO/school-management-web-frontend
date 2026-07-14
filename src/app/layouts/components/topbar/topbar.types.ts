import type { LucideIcon } from "lucide-react";

export type TopbarMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export type ProfileMenuItemProps = {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
};

export type UserRoleSource = {
  category?: string;
  role?: string;
};