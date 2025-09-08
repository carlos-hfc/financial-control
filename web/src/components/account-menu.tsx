import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react"

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex select-none items-center gap-1 lg:gap-2 px-2 text-zinc-800 data-[state=open]:[&>svg]:rotate-180">
          <span className="text-sm font-semibold">Carlos Faustino</span>

          <ChevronDownIcon className="size-4 transition-transform" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          sideOffset={8}
          align="end"
          className="w-56 *:leading-none z-50 max-h-(--radix-dropdown-menu-content-available-height) overflow-x-hidden overflow-y-auto rounded-md border border-zinc-200 p-1 shadow-md bg-white"
        >
          <DropdownMenuLabel className="flex flex-col px-2 py-1.5">
            <span className="font-bold text-sm text-zinc-700">
              Carlos Faustino
            </span>
            <span className="text-xs text-zinc-600">carlos@email.com</span>
          </DropdownMenuLabel>

          <div className="bg-zinc-200 -mx-1 my-1 h-px" />

          <DropdownMenuItem className="flex items-center gap-2 rounded-sm px-2 py-1.5 select-none outline-hidden text-sm text-zinc-700 hover:bg-zinc-100">
            <UserIcon className="size-4 shrink-0" />
            <span>Perfil</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 select-none outline-hidden text-sm w-full text-rose-500 hover:bg-zinc-100"
            asChild
          >
            <button>
              <LogOutIcon className="size-4 shrink-0" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
