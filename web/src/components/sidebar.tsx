import {
  ArrowUpDownIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  TagsIcon,
  XIcon,
} from "lucide-react"
import { useLocation } from "react-router"

import { cn } from "@/utils/cn"

import { Button } from "./button"
import { NavLink } from "./nav-link"

const menuItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    to: "/transacoes",
    label: "Transações",
    icon: ArrowUpDownIcon,
  },
  {
    to: "/contas",
    label: "Contas",
    icon: CreditCardIcon,
  },
  {
    to: "/categorias",
    label: "Categorias",
    icon: TagsIcon,
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose(): void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed flex inset-0 z-40 bg-zinc-100/40"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 z-50 w-64 border-r border-zinc-200 bg-white p-4 space-y-4 transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-semibold text-zinc-900">Menu</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <XIcon className="size-5 text-zinc-600" />
          </Button>
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  onClick={() => (item.to !== pathname ? onClose() : undefined)}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
