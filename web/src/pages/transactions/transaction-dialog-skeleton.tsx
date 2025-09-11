import { DialogTitle } from "@radix-ui/react-dialog"

import { Dialog } from "@/components/dialog"
import { Skeleton } from "@/components/skeleton"

export function TransactionDialogSkeleton() {
  return (
    <Dialog.Content aria-describedby={undefined}>
      <Dialog.Header>
        <DialogTitle asChild>
          <Skeleton className="w-40 h-6" />
        </DialogTitle>
      </Dialog.Header>

      <form className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="space-y-2 w-full">
            <Skeleton className="w-20 h-4" />

            <Skeleton className="w-full h-8" />
          </div>

          <div className="space-y-2 w-full">
            <Skeleton className="w-20 h-4" />

            <Skeleton className="w-full h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <Dialog.Footer>
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
