import { AlertTriangle } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { useLocale } from "@/app/providers/locale";

export function ErrorPage() {
  const error = useRouteError();
  const { t } = useLocale();

  let title = t.errors.somethingWentWrong;
  let message = t.errors.unexpectedError;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message ?? message;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <section className="max-w-md rounded-[28px] border border-border/60 bg-card/60 p-8 backdrop-blur-xl">
        <AlertTriangle className="mx-auto h-14 w-14 text-primary/70" strokeWidth={1.5} />
        <h1 className="mt-5 text-2xl font-normal text-foreground">{title}</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </section>
    </main>
  );
}
