import { NavLink as Nav, NavLinkProps } from "react-router"

import { cn } from "@/utils/cn"

export function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <Nav
      className={cn(
        "flex items-center gap-3 rounded-xl font-semibold group/nav text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 aria-[current=page]:text-blue-600 aria-[current=page]:hover:text-blue-800 aria-[current=page]:bg-blue-50 aria-[current=page]:shadow-sm px-4 py-3 [&>svg]:text-zinc-400 hover:[&>svg]:text-zinc-600 aria-[current=page]:[&>svg]:text-blue-600",
        className,
      )}
      {...props}
    />
  )
}
