import type { ReactNode } from "react";

import authSchoolCampus from "@/assets/images/auth-school-campus.png";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="h-dvh overflow-hidden bg-background p-3 sm:p-4 lg:p-5">
      <div className="mx-auto grid h-full max-w-[1920px] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm lg:grid-cols-[1.08fr_0.92fr]">
        <aside className="relative hidden min-h-0 overflow-hidden lg:block">
          <img
            src={authSchoolCampus}
            alt="Modern school campus"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-foreground/10" />

          <div className="relative z-10 flex h-full flex-col px-15 py-15 xl:px-12 xl:py-11 2xl:px-14">
            <div className="max-w-[1900px] pt-4">
  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary xl:text-sm">
    School Management System
  </p>

  <h1 className="mt-4 text-[2rem]  leading-[1.06] tracking-[-0.05em] text-foreground drop-shadow-sm xl:text-[3.15rem] 2xl:text-[3.45rem]">
    Empowering schools
    <br />
    <span>Inspiring </span>

    <span className="text-primary">
      Futures.
    </span>
  </h1>

  <p className="mt-5 max-w-[500px] text-sm leading-6 text-foreground/70 xl:text-base xl:leading-7">
    A complete platform for managing academics, finance, staff,
    and daily school operations with clarity and ease.
  </p>
</div>

            
          </div>
        </aside>

        <section className="relative flex min-h-0 items-center justify-center overflow-y-auto bg-background px-5 py-6 sm:px-8 lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative z-10 w-full max-w-[500px]">{children}</div>
        </section>
      </div>
    </main>
  );
}
