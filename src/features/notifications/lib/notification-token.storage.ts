const FCM_TOKEN_STORAGE_KEY = "fcm_token";

export const notificationTokenStorage = {
  set(token: string) {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
  },

  get(): string | null {
    return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  },

  clear() {
    localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
  },
};