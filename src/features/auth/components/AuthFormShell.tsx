import type { ReactNode } from "react";

import { AuthBrandLogo } from "./AuthBrandLogo";

type AuthFormShellProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  showLogo?: boolean;
};

export function AuthFormShell({
  title,
  description,
  children,
  showLogo = true,
}: AuthFormShellProps) {
  return (
    <div className="mx-auto w-full">
      <header className="mb-8 text-center">
        {showLogo && (
          <AuthBrandLogo
            size="md"
            className="mx-auto"
          />
        )}

        <h1 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-[2rem]">
          {title}
        </h1>

        <div className="mx-auto mt-3 max-w-[450px] text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </div>
      </header>

      {children}
    </div>
  );
}