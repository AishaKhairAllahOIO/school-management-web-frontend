import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
      `
      h-12
      w-full
      min-w-0
      rounded-xl
      border
      border-input
      bg-background

      px-3
      py-2

      text-sm
      text-foreground

      shadow-sm

      transition-all
      duration-200

      placeholder:text-muted-foreground

      hover:border-primary/50

      focus-visible:outline-none
      focus-visible:border-primary
      focus-visible:ring-2
      focus-visible:ring-primary/50

      disabled:pointer-events-none
      disabled:cursor-not-allowed
      disabled:opacity-50

      dark:bg-input/30
      `,
    className
)}    
      {...props}
    />
  );
}

export { Input };   