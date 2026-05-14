export const envConfig =
{
  appName: import.meta.env.VITE_APP_NAME,

  apiUrl: import.meta.env.VITE_API_URL,

  environment: import.meta.env.VITE_APP_ENV,

  isDevelopment: import.meta.env.DEV,

  isProduction: import.meta.env.PROD,

  enableLogs:
    import.meta.env.VITE_ENABLE_LOGS === "true",

  enableDevtools:
    import.meta.env.VITE_ENABLE_DEVTOOLS === "true",
};