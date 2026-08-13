import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  type ReactNode,
  useState,
} from "react";

import authSchoolCampus from "@/assets/images/auth-school-campus.png";

type AuthLayoutProps = {
  children: ReactNode;
  dir?: "ltr" | "rtl";
};

const AUTH_PANEL_POSITION_KEY =
  "auth-panel-position";

function getInitialPanelPosition() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.sessionStorage.getItem(
      AUTH_PANEL_POSITION_KEY,
    ) === "swapped"
  );
}

export function AuthLayout({
  children,
  dir = "ltr",
}: AuthLayoutProps) {
  const [isSwapped, setIsSwapped] =
    useState(getInitialPanelPosition);

  const isRtl = dir === "rtl";

  function togglePanels() {
    setIsSwapped((current) => {
      const next = !current;

      window.sessionStorage.setItem(
        AUTH_PANEL_POSITION_KEY,
        next ? "swapped" : "default",
      );

      return next;
    });
  }

  return (
    <main
      dir={dir}
      className="min-h-dvh bg-background p-3 sm:p-4 lg:h-dvh lg:overflow-hidden lg:p-5"
    >
      <div
        className={[
          "relative mx-auto min-h-[calc(100dvh-1.5rem)]",
          "overflow-hidden rounded-[2rem]",
          "border border-border/70 bg-card",
          "shadow-[var(--shadow-soft)]",
          "sm:min-h-[calc(100dvh-2rem)]",
          "lg:h-full lg:min-h-0 lg:max-w-[1820px]",
        ].join(" ")}
      >
        <aside
          className={[
            "relative hidden min-h-0 overflow-hidden",
            "lg:absolute lg:inset-y-0 lg:block lg:w-[52.5%]",
            "lg:transition-[left,right] lg:duration-700",
            "lg:ease-[cubic-bezier(0.22,1,0.36,1)]",

            !isRtl
              ? isSwapped
                ? "lg:left-[47.5%]"
                : "lg:left-0"
              : isSwapped
                ? "lg:right-0"
                : "lg:right-[47.5%]",
          ].join(" ")}
        >
          <img
            src={authSchoolCampus}
            alt={
              isRtl
                ? "حرم مدرسي حديث"
                : "Modern school campus"
            }
            draggable={false}
            className="auth-hero-image absolute inset-0 h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="auth-hero-overlay absolute inset-0"
          />

          <div
            aria-hidden="true"
            className="auth-hero-pattern absolute inset-0"
          />

          <div
            className={[
              "relative z-10 flex h-full flex-col",
              "px-10 py-12 xl:px-12 xl:py-14 2xl:px-14",
            ].join(" ")}
          >
            <div
              className={[
                "auth-hero-copy max-w-[590px] pt-8",
                "text-start",
              ].join(" ")}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sidebar-active xl:text-sm">
                {isRtl
                  ? "نظام إدارة المدارس"
                  : "School Management System"}
              </p>

              <h1 className="mt-5 text-[2.35rem] font-semibold leading-[1.12] tracking-[-0.045em] text-sidebar-foreground xl:text-[2.95rem] 2xl:text-[3.2rem]">
                {isRtl ? (
                  <>
                    <span>نرتقي بالمدارس.</span>
                    <br />
                    <span>
                      ونصنع{" "}
                      <span className="text-sidebar-active">
                        المستقبل.
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    Empowering schools.
                    <br />
                    <span>
                      Inspiring{" "}
                      <span className="text-sidebar-active">
                        Futures.
                      </span>
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-[500px] text-sm leading-7 text-sidebar-muted xl:text-base">
                {isRtl
                  ? "اجمع الشؤون الأكاديمية والموظفين والمالية والعمليات اليومية للمدرسة في مساحة عمل واحدة آمنة ومنظمة."
                  : "Bring academics, people, finance, and everyday school operations together in one secure, thoughtfully organized workspace."}
              </p>
            </div>

            <div className="mt-auto flex items-center gap-3 text-xs font-medium text-sidebar-muted">
              <span className="h-2 w-2 rounded-full bg-success" />

              {isRtl
                ? "وصول آمن للموظفين المصرح لهم"
                : "Secure access for authorized staff"}
            </div>
          </div>
        </aside>

        <section
          className={[
            "relative flex min-h-[calc(100dvh-1.5rem)]",
            "items-center justify-center overflow-y-auto",
            "bg-background px-5 py-8",
            "sm:min-h-[calc(100dvh-2rem)] sm:px-8 sm:py-10",
            "lg:absolute lg:inset-y-0 lg:min-h-0 lg:w-[47.5%]",
            "lg:px-10 lg:transition-[left,right] lg:duration-700",
            "lg:ease-[cubic-bezier(0.22,1,0.36,1)]",
            "xl:px-14",
            !isRtl
              ? isSwapped
                ? "lg:left-0"
                : "lg:left-[52.5%]"
              : isSwapped
                ? "lg:right-[52.5%]"
                : "lg:right-0",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute end-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 start-0 h-52 w-52 rounded-full bg-primary/5 blur-3xl"
          />

          <div className="relative z-10 w-full max-w-[470px]">
            {children}
          </div>
        </section>

        <button
          type="button"
          onClick={togglePanels}
          aria-label={
            isSwapped
              ? isRtl
                ? "إعادة لوحة تسجيل الدخول إلى اليسار"
                : "Move the sign-in panel back to the right"
              : isRtl
                ? "نقل لوحة تسجيل الدخول إلى اليمين"
                : "Move the sign-in panel to the left"
          }
          title={
            isRtl
              ? "تبديل مواضع اللوحات"
              : "Switch panel sides"
          }
          className={[
            "group absolute top-1/2 z-30 hidden",
            "h-12 w-8 -translate-y-1/2",
            "-translate-x-1/2",
            "items-center justify-center rounded-full",
            "border border-border/70 bg-card/92",
            "text-muted-foreground",
            "shadow-[0_8px_24px_rgba(22,16,62,0.14)]",
            "backdrop-blur-xl",
            "transition-[left,right,transform,background-color,color,border-color,box-shadow]",
            "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:scale-[1.04] hover:border-primary/25",
            "hover:bg-background hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-4",
            "focus-visible:ring-primary/15",
            "lg:flex",
            !isRtl
              ? isSwapped
                ? "left-[47.5%]"
                : "left-[52.5%]"
              : isSwapped
                ? "right-[47.5%]"
                : "right-[52.5%]",
          ].join(" ")}
        >
          <span className="flex h-7 w-5 items-center justify-center rounded-full bg-muted/55 transition-colors duration-200 group-hover:bg-primary/10">
            {isRtl ? (
              isSwapped ? (
                <ChevronLeft
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2.1}
                />
              ) : (
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2.1}
                />
              )
            ) : isSwapped ? (
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.1}
              />
            ) : (
              <ChevronLeft
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.1}
              />
            )}
          </span>
        </button>
      </div>
    </main>
  );
}