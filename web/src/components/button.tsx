import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/utils/cn"

interface ButtonProps extends React.ComponentProps<"button"> {
  size?: "default" | "sm"
  variant?: "primary" | "outline" | "link" | "ghost"
  asChild?: boolean
}

export function Button({
  className,
  size = "default",
  variant = "primary",
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button"

  return (
    <Component
      className={cn(
        "rounded-md select-none outline-none font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-colors",
        size === "default" && "px-4 h-9 has-[>svg]:px-3",
        size === "sm" && "px-3 h-8 has-[>svg]:px-2.5 gap-1.5",
        variant === "primary" && "bg-blue-600 hover:bg-blue-700 text-white",
        variant === "link" &&
          "underline-offset-4 hover:underline text-blue-600",
        variant === "outline" &&
          "border bg-white hover:bg-blue-100 border-blue-600 text-blue-600",
        variant === "ghost" && "bg-transparent hover:bg-zinc-100",
        className,
      )}
      {...props}
    />
  )
}
