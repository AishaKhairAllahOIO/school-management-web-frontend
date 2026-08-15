"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<
  typeof CheckboxPrimitive.Root
>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-background outline-none transition-colors",

        "focus-visible:border-ring",
        "focus-visible:ring-3",
        "focus-visible:ring-ring/50",

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        "data-[state=checked]:border-primary",
        "data-[state=checked]:bg-primary",
        "data-[state=checked]:text-primary-foreground",

        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };