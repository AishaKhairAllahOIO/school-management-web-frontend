import {
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

import {
  useLocale,
} from "@/app/providers/locale";

export function ErrorPage() {
  const error = useRouteError();
  const { t } = useLocale();

  let title =
    t.errors.somethingWentWrong;

  let message =
    t.errors.unexpectedError;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.data?.message ??
      message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
