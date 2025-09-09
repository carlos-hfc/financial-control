import { DialogTitle } from "@radix-ui/react-dialog"

import { Dialog } from "@/components/dialog"
import { Skeleton } from "@/components/skeleton"

export function AccountDialogSkeleton() {
  return (
    <Dialog
      className="p-6 space-y-4 sm:max-w-sm"
      aria-describedby={undefined}
    >
      <div className="flex items-enter justify-between gap-6">
        <DialogTitle asChild>
          <Skeleton className="h-6 w-40" />
        </DialogTitle>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-12 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-12 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-12 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <div className="flex flex-col justify-end md:flex-row gap-2">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </form>
    </Dialog>
  )
}
