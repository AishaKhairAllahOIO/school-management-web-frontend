import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";
import type { AuthStorageData, AuthUser } from "../types/auth.types";

function getStorage(rememberMe: boolean): Storage 
{
  return rememberMe ? localStorage : sessionStorage;
}

function clearStorage(storage: Storage)
{
  storage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  storage.removeItem(AUTH_STORAGE_KEYS.USER);
  storage.removeItem(AUTH_STORAGE_KEYS.PERMISSIONS);
  storage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
}

export const authStorage =
{
  set(data: AuthStorageData) 
  {
    const storage = getStorage(data.rememberMe);
    const oppositeStorage = getStorage(!data.rememberMe);

    clearStorage(oppositeStorage);

    storage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.token);
    storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));
    storage.setItem(AUTH_STORAGE_KEYS.PERMISSIONS, JSON.stringify(data.permissions));
    storage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, String(data.rememberMe));
  },

  getToken(): string | null 
  {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  getUser(): AuthUser | null 
  {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USER) || sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!raw) return null;

    try 
    {
      return JSON.parse(raw) as AuthUser;
    }
    catch
    {
      return null;
    }
  },

  getPermissions(): string[]
  {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.PERMISSIONS) || sessionStorage.getItem(AUTH_STORAGE_KEYS.PERMISSIONS);
    if (!raw) return [];

    try 
    {
      return JSON.parse(raw) as string[];
    } 
    catch 
    {
      return [];
    }
  },

  getRememberMe(): boolean 
  {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === "true";
  },

  getAuthData(): AuthStorageData | null 
  {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) return null;

    return { token, user, permissions: this.getPermissions(), rememberMe: this.getRememberMe() };
  },

  clear() 
  {
    clearStorage(localStorage);
    clearStorage(sessionStorage);
  },
};