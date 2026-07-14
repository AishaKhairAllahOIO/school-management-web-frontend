import * as React from "react"
<<<<<<< HEAD
import * as LabelPrimitive from "@radix-ui/react-label"

=======
import * as LabelPrimitive from "@radix-ui/react-label";
>>>>>>> 782e7f79faba457344f587b8dd3c36e639d39e80
import { cn } from "@/shared/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }