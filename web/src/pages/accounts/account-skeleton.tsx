import { Skeleton } from "@/components/skeleton"

export function AccountSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-emerald-500 p-6">
      <div className="space-y-4">
        <Skeleton className="size-12" />

        <div>
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-40 h-8 mt-2" />
        </div>
      </div>
    </div>
  )
}
