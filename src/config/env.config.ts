type AppEnvironment = "development" | "staging" | "production";
type AppLanguage = "en" | "ar";
type AppTheme = "light" | "dark" | "system";

function getRequiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function removeTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function parseAppEnvironment(value: string): AppEnvironment {
  if (
    value === "development" ||
    value === "staging" ||
    value === "production"
  ) {
    return value;
  }

  throw new Error(
    `Invalid VITE_APP_ENV value: "${value}". Expected development, staging, or production.`,
  );
}

function parseDefaultLanguage(value: string): AppLanguage {
  if (value === "en" || value === "ar") {
    return value;
  }

  throw new Error(
    `Invalid VITE_DEFAULT_LANGUAGE value: "${value}". Expected en or ar.`,
  );
}

function parseDefaultTheme(value: string): AppTheme {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  throw new Error(
    `Invalid VITE_DEFAULT_THEME value: "${value}". Expected light, dark, or system.`,
  );
}

const apiBaseUrl = removeTrailingSlash(getRequiredEnv("VITE_API_URL"));

export const env = {
  apiBaseUrl,

  appEnv: parseAppEnvironment(getRequiredEnv("VITE_APP_ENV")),
  appName: getRequiredEnv("VITE_APP_NAME"),
  defaultLanguage: parseDefaultLanguage(
    getRequiredEnv("VITE_DEFAULT_LANGUAGE"),
  ),
  defaultTheme: parseDefaultTheme(getRequiredEnv("VITE_DEFAULT_THEME")),

  firebase: {
    apiKey: getRequiredEnv("VITE_FIREBASE_API_KEY"),
    authDomain: getRequiredEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getRequiredEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getRequiredEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getRequiredEnv(
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
    ),
    appId: getRequiredEnv("VITE_FIREBASE_APP_ID"),
    vapidKey: getRequiredEnv("VITE_FIREBASE_VAPID_KEY"),
  },
} as const;