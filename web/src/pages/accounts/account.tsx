import { PiggyBankIcon } from "lucide-react"

import { formatCurrency } from "@/utils/formatters"

export function Account() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-emerald-500 p-6">
      <div className="space-y-4">
        <div className="size-12 rounded-xl flex items-center justify-center bg-emerald-100">
          <PiggyBankIcon className="size-6 text-emerald-500" />
        </div>

        <div>
          <h3 className="font-semibold text-zinc-800">Conta</h3>
          <p className="text-2xl font-bold">{formatCurrency(200)}</p>
        </div>
      </div>
    </div>
  )
}
