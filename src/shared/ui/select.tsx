import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";

function Select(
  props: React.ComponentProps<
    typeof SelectPrimitive.Root
  >,
) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectValue(
  props: React.ComponentProps<
    typeof SelectPrimitive.Value
  >,
) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Trigger
>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-[12px] border border-border/65 bg-background px-3.5",
        "text-[12px] font-normal text-foreground outline-none transition-all",
        "hover:border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/10",
        "data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className="shrink-0 text-muted-foreground"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Content
>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "relative z-[130] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[14px] border border-border/60 bg-popover text-popover-foreground",
          "shadow-[0_16px_45px_rgba(24,16,55,0.18)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1.5">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Item
>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-9 cursor-default select-none items-center rounded-[10px] py-2 pl-3 pr-9 text-[12px] outline-none",
        "data-[highlighted]:bg-primary/[0.08] data-[highlighted]:text-primary",
        "data-[state=checked]:font-medium data-[state=checked]:text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>

      <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={14} strokeWidth={2.2} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectScrollUpButton(
  props: React.ComponentProps<
    typeof SelectPrimitive.ScrollUpButton
  >,
) {
  return (
    <SelectPrimitive.ScrollUpButton
      className="flex h-7 cursor-default items-center justify-center bg-popover text-muted-foreground"
      {...props}
    >
      <ChevronUp size={14} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton(
  props: React.ComponentProps<
    typeof SelectPrimitive.ScrollDownButton
  >,
) {
  return (
    <SelectPrimitive.ScrollDownButton
      className="flex h-7 cursor-default items-center justify-center bg-popover text-muted-foreground"
      {...props}
    >
      <ChevronDown size={14} />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
