"use client";

import * as React from "react";

import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { CheckIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer
        relative
        flex
        size-5
        shrink-0
        items-center
        justify-center

        rounded-md
        border
        border-input

        bg-background

        transition-all
        duration-200

        hover:border-primary/50

        focus-visible:outline-none
        focus-visible:border-primary
        focus-visible:ring-4
        focus-visible:ring-primary/20

        data-[state=checked]:bg-primary
        data-[state=checked]:border-primary
        data-[state=checked]:text-primary-foreground

        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="
          flex
          items-center
          justify-center
        "
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };