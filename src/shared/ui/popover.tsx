import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/shared/lib/utils";

function Popover(
  props: React.ComponentProps<
    typeof PopoverPrimitive.Root
  >,
) {
  return (
    <PopoverPrimitive.Root
      {...props}
    />
  );
}

function PopoverTrigger(
  props: React.ComponentProps<
    typeof PopoverPrimitive.Trigger
  >,
) {
  return (
    <PopoverPrimitive.Trigger
      {...props}
    />
  );
}

function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  collisionPadding = 16,
  avoidCollisions = true,
  ...props
}: React.ComponentProps<
  typeof PopoverPrimitive.Content
>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={
          collisionPadding
        }
        avoidCollisions={
          avoidCollisions
        }
        className={cn(
          "z-[150] rounded-[16px] border border-border/60 bg-popover p-3 text-popover-foreground shadow-[0_18px_55px_rgba(24,16,55,0.18)] outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export {
  Popover,
  PopoverContent,
  PopoverTrigger,
};
