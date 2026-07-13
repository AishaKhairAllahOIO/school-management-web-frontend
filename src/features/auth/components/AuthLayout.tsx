import type { ReactNode } from "react";

import authSchoolCampus from "@/assets/images/auth-school-campus.png";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="h-dvh overflow-hidden bg-background p-3 sm:p-4 lg:p-5">
      <div className="mx-auto grid h-full max-w-[1920px] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-0 overflow-hidden lg:block">
          <img
            src={authSchoolCampus}
            alt="Modern school campus"
            className="absolute inset-0 h-full w-full object-cover object-center"
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-foreground/10" />

          <div className="relative z-10 flex h-full flex-col px-10 py-10 xl:px-14 xl:py-12 2xl:px-16">
            <div className="max-w-[590px] rounded-[1.75rem] bg-background/72 px-8 py-7 shadow-sm backdrop-blur-md xl:px-9 xl:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary xl:text-sm">
                School Management System
              </p>

              <h1 className="mt-4 text-[2.65rem] font-bold leading-[1.08] tracking-[-0.045em] text-foreground xl:text-5xl 2xl:text-[3.35rem]">
                Empowering schools.
                <br />

                <span className="text-primary">
                  Inspiring futures.
                </span>
              </h1>

              <p className="mt-5 max-w-[500px] text-base leading-7 text-muted-foreground">
                A complete platform for managing academics, finance,
                staff, and daily school operations with clarity and ease.
              </p>
            </div>

            <div className="mt-auto w-fit rounded-2xl border border-border/70 bg-background/88 px-5 py-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Secure · Reliable · Simple
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your school, your data, your future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-0 items-center justify-center overflow-y-auto bg-background px-5 py-6 sm:px-8 lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10 w-full max-w-[520px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}