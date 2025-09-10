import {
  DialogContent,
  DialogContentProps,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog"

import { cn } from "@/utils/cn"

export function Dialog({ className, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogContent
        className={cn(
          "bg-white fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl sm:max-w-lg -translate-1/2 rounded-lg border border-zinc-200 shadow-lg",
          className,
        )}
        {...props}
      />
    </DialogPortal>
  )
}
