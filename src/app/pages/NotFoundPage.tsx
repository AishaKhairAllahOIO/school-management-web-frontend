import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useLocale } from "@/app/providers/locale";

export function NotFoundPage() {
  const { t } = useLocale();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <section className="max-w-md rounded-[28px] border border-border/60 bg-card/60 p-8 backdrop-blur-xl">
        <Compass className="mx-auto h-14 w-14 text-primary/70" strokeWidth={1.5} />
        <h1 className="mt-5 text-6xl font-normal text-foreground">404</h1>
        <p className="mt-4 text-base text-muted-foreground">
          {t.errors.pageNotFound}
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-xl border border-primary bg-primary px-5 py-2 text-primary-foreground"
        >
          {t.common.backToHome}
        </Link>
      </section>
    </main>
  );
}
