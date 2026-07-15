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
      <header className="mb-7 text-center">
        <AuthBrandLogo
          size="md"
          className="mx-auto w-fit"
        />

        <h1 className="mt-6 text-[1.85rem] font-semibold tracking-[-0.035em] text-foreground sm:text-[2rem]">
          {title}
        </h1>

        <div className="mx-auto mt-2 max-w-[410px] text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
          {description}
        </div>
      </header>

      {children}
    </div>
  );
}