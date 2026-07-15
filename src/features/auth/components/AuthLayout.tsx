import type { ReactNode } from "react";

import authSchoolCampus from "@/assets/images/auth-school-campus.png";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-dvh bg-background p-3 sm:p-4 lg:h-dvh lg:overflow-hidden lg:p-5">
      <div className="mx-auto grid min-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-soft)] sm:min-h-[calc(100dvh-2rem)] lg:h-full lg:min-h-0 lg:max-w-[1820px] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden min-h-0 overflow-hidden lg:block">
          <img
            src={authSchoolCampus}
            alt="Modern school campus"
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

          <div className="relative z-10 flex h-full flex-col px-10 py-12 xl:px-12 xl:py-14 2xl:px-14">
            <div className="auth-hero-copy max-w-[590px] pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sidebar-active xl:text-sm">
                School Management System
              </p>

              <h1 className="mt-5 text-[2.35rem] font-semibold leading-[1.12] tracking-[-0.045em] text-sidebar-foreground xl:text-[2.95rem] 2xl:text-[3.2rem]">
                Empowering schools.
                <br />

                <span>Inspiring </span>

                <span className="text-sidebar-active">
                  futures.
                </span>
              </h1>

              <p className="mt-6 max-w-[470px] text-sm leading-7 text-sidebar-muted xl:text-base">
                Manage academics, staff, finance, and daily school operations
                from one secure and organized platform.
              </p>
            </div>

            <div className="mt-auto flex items-center gap-3 text-xs font-medium text-sidebar-muted">
              <span className="h-2 w-2 rounded-full bg-success" />

              Secure access for authorized staff
            </div>
          </div>
        </aside>

        <section className="relative flex min-h-0 items-center justify-center overflow-y-auto bg-background px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full bg-primary/5 blur-3xl"
          />

          <div className="relative z-10 w-full max-w-[470px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}