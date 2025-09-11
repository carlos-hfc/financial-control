import { Dialog } from "@/components/dialog"
import { Skeleton } from "@/components/skeleton"

export function CategoryDialogSkeleton() {
  return (
    <Dialog.Content aria-describedby={undefined}>
      <Dialog.Header>
        <Dialog.Title asChild>
          <Skeleton className="w-50 h-6" />
        </Dialog.Title>
      </Dialog.Header>

      <form className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-12 h-4" />

          <Skeleton className="w-full h-8" />
        </div>

        <Dialog.Footer>
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  )
}
