import { Skeleton } from "@/components/skeleton"

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="size-12" />

        <Skeleton className="w-12 h-4" />
      </div>

      <div className="space-y-1">
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-32 h-8" />
      </div>
    </div>
  )
}
