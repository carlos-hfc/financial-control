import { PiggyBankIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/button"
import { formatCurrency } from "@/utils/formatters"

export function Transaction() {
  return (
    <div className="flex items-center justify-between group hover:bg-zinc-50 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl flex items-center justify-center bg-emerald-100">
          <PiggyBankIcon className="size-6 text-emerald-500" />
        </div>

        <div>
          <h4 className="font-medium text-zinc-800">Transacao</h4>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Categoria</span>
            <span>&bull;</span>
            <span>Conta</span>
            <span>&bull;</span>
            <span>12/12/2025</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-lg text-right font-semibold">
          + {formatCurrency(800)}
        </p>

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity size-10 hover:bg-rose-500/10"
        >
          <Trash2Icon className="size-5 text-rose-500" />
        </Button>
      </div>
    </div>
  )
}
