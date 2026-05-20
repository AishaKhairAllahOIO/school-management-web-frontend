import type { UserRole } from "@/config/roles.config";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
  permissions: string[];
}
