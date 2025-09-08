import { MenuIcon, WalletIcon } from "lucide-react"

import { Button } from "./button"

interface HeaderProps {
  onOpenMenu(): void
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 p-4 lg:px-8">
      <div className="mx-auto w-full flex items-center gap-4">
        <Button
          variant="ghost"
          className="lg:hidden"
          onClick={onOpenMenu}
        >
          <MenuIcon />
        </Button>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-900 rounded-lg size-10">
            <WalletIcon className="size-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-zinc-900">Finance App</h1>
            <p className="text-sm text-zinc-500">Controle Financeiro</p>
          </div>
        </div>
      </div>
    </header>
  )
}
