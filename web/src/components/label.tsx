import { cn } from "@/utils/cn"

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "flex items-center select-none text-sm font-medium text-gray-700",
        className,
      )}
      {...props}
    />
  )
}
