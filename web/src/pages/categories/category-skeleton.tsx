import { Skeleton } from "@/components/skeleton"

export function CategorySkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-xl" />
      <Skeleton className="w-52 h-6" />

      <div className="flex items-center justify-center gap-2 ml-auto">
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
      </div>
    </div>
  )
}
