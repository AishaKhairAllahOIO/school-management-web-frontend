import type { ReactNode } from "react";
import { hasPermission } from "../lib/auth.utils";
import { useAuthStore } from "../store/auth.store";

type PermissionGuardProps = {
  permissions?: string[];
  fallback?: ReactNode;
  children: ReactNode;
};

export function PermissionGuard({ permissions, fallback = null, children }: PermissionGuardProps) {
  const userPermissions = useAuthStore((state) => state.permissions);
  if (!hasPermission(userPermissions, permissions)) return fallback;
  return children;
}
