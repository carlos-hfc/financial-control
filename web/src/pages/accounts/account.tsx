import { PiggyBankIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/button"
import { formatCurrency } from "@/utils/formatters"

export function Account() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-emerald-500 p-6 space-y-4 relative group">
      <Button
        variant="ghost"
        size="sm"
        className="invisible group-hover:visible absolute right-6 size-10 hover:bg-rose-500/10"
      >
        <Trash2Icon className="size-5 text-rose-500" />
      </Button>

      <div className="size-12 rounded-xl flex items-center justify-center bg-emerald-100">
        <PiggyBankIcon className="size-6 text-emerald-500" />
      </div>

      <div>
        <h3 className="font-semibold text-zinc-800">Conta</h3>
        <p className="text-2xl font-bold">{formatCurrency(200)}</p>
      </div>
    </div>
  )
}
