import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/shared/lib/utils";

function Popover(
  props: React.ComponentProps<typeof PopoverPrimitive.Root>,
) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>,
) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverAnchor(
  props: React.ComponentProps<typeof PopoverPrimitive.Anchor>,
) {
  return <PopoverPrimitive.Anchor {...props} />;
}

function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  collisionPadding = 12,
  avoidCollisions = true,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        avoidCollisions={avoidCollisions}
        className={cn(
          "z-[150] max-h-[min(36rem,calc(100dvh-1.5rem))] max-w-[calc(100vw-1.5rem)] overflow-auto rounded-[18px] border border-border/65 bg-popover p-3 text-popover-foreground outline-none",
          "shadow-[0_20px_60px_rgba(24,16,55,0.16)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
};
