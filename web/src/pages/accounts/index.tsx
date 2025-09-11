import { PlusIcon } from "lucide-react"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"
import { PageTitle } from "@/components/page-title"
import { cn } from "@/utils/cn"
import { formatCurrency } from "@/utils/formatters"

import { Account } from "./account"
import { AccountDialog } from "./account-dialog"

export function Accounts() {
  return (
    <div className="space-y-6">
      <Dialog>
        <PageTitle
          title="Contas"
          description="Gerencie suas contas financeiras"
        >
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-zinc-500">Saldo total</p>
              <p className={cn("font-bold text-xl")}>{formatCurrency(1200)}</p>
            </div>
            <Dialog.Trigger asChild>
              <Button>
                <PlusIcon className="size-4" />
                Nova Conta
              </Button>
            </Dialog.Trigger>
          </div>
        </PageTitle>

        <AccountDialog />
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Account key={i} />
        ))}
      </div>
    </div>
  )
}
