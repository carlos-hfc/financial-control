import { Skeleton } from "@/components/skeleton"

export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between hover:bg-zinc-50 px-6 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12" />

        <div>
          <Skeleton className="w-25 h-6" />
          <Skeleton className="w-40 h-4 mt-2" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="size-10" />
      </div>
    </div>
  )
}
