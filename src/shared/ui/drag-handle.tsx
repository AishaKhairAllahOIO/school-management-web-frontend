import {
  GripVertical,
  type LucideProps,
} from "lucide-react";
import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { cn } from "@/shared/lib/utils";

type DragHandleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconProps?: LucideProps;
};

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  function DragHandle({ className, iconProps, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Drag to reorder"
        className={cn(
          "inline-flex h-9 w-9 touch-none cursor-grab items-center justify-center rounded-[10px] text-muted-foreground outline-none transition-colors",
          "hover:bg-muted hover:text-foreground active:cursor-grabbing",
          "focus-visible:ring-2 focus-visible:ring-primary/25",
          className,
        )}
        {...props}
      >
        <GripVertical aria-hidden="true" size={17} strokeWidth={1.8} {...iconProps} />
      </button>
    );
  },
);
