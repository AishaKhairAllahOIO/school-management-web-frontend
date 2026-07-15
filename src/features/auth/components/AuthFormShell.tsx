import type { ReactNode } from "react";

import { AuthBrandLogo } from "./AuthBrandLogo";

type AuthFormShellProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
};

export function AuthFormShell({
  title,
  description,
  children,
}: AuthFormShellProps) {
  return (
    <div className="mx-auto w-full">
      <header className="mb-7 text-center sm:mb-8">
        <AuthBrandLogo
          size="lg"
          className="mx-auto"
        />

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-[2rem]">
          {title}
        </h1>

        <div className="mx-auto mt-2.5 max-w-[430px] text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
          {description}
        </div>
      </header>

      {children}
    </div>
  );
}