import { TrendingUpIcon } from "lucide-react"

import { formatCurrency } from "@/utils/formatters"

export function DashboardCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="size-12 flex items-center justify-center rounded-xl bg-emerald-50">
          <TrendingUpIcon className="size-6 text-emerald-600" />
        </div>

        <p className="text-sm font-medium text-emerald-600">8%</p>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-zinc-600">Title</h3>
        <p className="text-2xl font-bold text-emerald-600">
          {formatCurrency(800)}
        </p>
      </div>
    </div>
  )
}
