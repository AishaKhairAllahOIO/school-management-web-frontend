import {
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/locale";

export function OfflinePage() {
  const { t } = useLocale();
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function retryConnection() {
    if (navigator.onLine) {
      window.location.reload();
      return;
    }

    setIsOnline(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-center sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 opacity-70">
        <div className="absolute -start-20 top-20 h-56 w-56 rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="absolute -end-16 bottom-10 h-64 w-64 rounded-full bg-warning/[0.09] blur-3xl" />
      </div>

      <section className="relative w-full max-w-[620px] rounded-[28px] border border-border/60 bg-card/80 px-5 py-8 shadow-[0_24px_70px_rgb(45_35_100_/_0.10)] backdrop-blur-xl sm:px-10 sm:py-11">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-destructive/[0.09] text-destructive">
          <WifiOff aria-hidden="true" size={23} strokeWidth={1.9} />
        </div>

        <div
          aria-hidden="true"
          className="mx-auto mt-7 w-[230px] max-w-full select-none"
        >
          <div className="relative h-[128px]">
            <div className="absolute bottom-0 start-[62px] h-[74px] w-[105px] rounded-[48%_52%_42%_45%] bg-foreground/[0.82]" />
            <div className="absolute bottom-[55px] start-[130px] h-[54px] w-[72px] rounded-[50%_48%_42%_45%] bg-foreground/[0.82]" />
            <div className="absolute bottom-[93px] start-[176px] h-[17px] w-[30px] rounded-e-[9px] bg-foreground/[0.82]" />
            <div className="absolute bottom-[86px] start-[165px] h-[6px] w-[6px] rounded-full bg-background" />
            <div className="absolute bottom-[18px] start-[47px] h-[13px] w-[34px] -rotate-[22deg] rounded-full bg-foreground/[0.82]" />
            <div className="absolute bottom-[-4px] start-[82px] h-[44px] w-[15px] rounded-b-[9px] bg-foreground/[0.82]" />
            <div className="absolute bottom-[-4px] start-[132px] h-[42px] w-[15px] rounded-b-[9px] bg-foreground/[0.82]" />
            <div className="absolute bottom-[17px] start-[146px] h-[13px] w-[38px] rotate-[18deg] rounded-full bg-foreground/[0.82]" />
          </div>
          <div className="h-px w-full border-t-2 border-dashed border-muted-foreground/25" />
        </div>

        <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
          {t.errors.offlineCode}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
          {t.errors.offlineTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-[470px] text-sm leading-7 text-muted-foreground sm:text-[15px]">
          {isOnline
            ? t.errors.connectionRestored
            : t.errors.offlineDescription}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retryConnection}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgb(99_102_241_/_0.20)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          >
            <RefreshCw aria-hidden="true" size={16} strokeWidth={2} />
            {t.errors.retryConnection}
          </button>

          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-[14px] border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
          >
            {t.common.backToHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
