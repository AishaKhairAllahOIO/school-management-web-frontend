export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || "School Management System",
  defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || "en",
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME || "system",
  defaultRoute: "/",
  loginRoute: "/auth/login",
} as const;
