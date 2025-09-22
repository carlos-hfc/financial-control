import { Dialog } from "@/components/dialog"
import { Skeleton } from "@/components/skeleton"

export function AccountDialogSkeleton() {
  return (
    <Dialog.Content
      className="sm:max-w-sm"
      aria-describedby={undefined}
    >
      <Dialog.Header>
        <Dialog.Title asChild>
          <Skeleton className="h-6 w-40" />
        </Dialog.Title>
      </Dialog.Header>

      <div className="space-y-4">
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

        <Dialog.Footer>
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </Dialog.Footer>
      </div>
    </Dialog.Content>
  )
}
