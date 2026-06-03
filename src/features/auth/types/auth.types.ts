import type { UserRole } from "@/config/roles.config";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type LoginResponse = null;
 
export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active?: boolean;
  name?: string;
}