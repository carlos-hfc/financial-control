import { cn } from "@/utils/cn"

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-md animate-pulse bg-zinc-200", className)}
      {...props}
    />
  )
}
