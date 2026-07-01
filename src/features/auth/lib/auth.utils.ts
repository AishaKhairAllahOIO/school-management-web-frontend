import { WEB_ALLOWED_ROLES } from "@/shared/constants/roles.config";
import type { AuthUser } from "../types/auth.types";

export function isAllowedWebUser(user: AuthUser): boolean 
{
  return user.role.some((role) => WEB_ALLOWED_ROLES.includes(role as never));
}

export function hasPermission(userPermissions: string[], requiredPermissions?: string[]): boolean
{
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
}