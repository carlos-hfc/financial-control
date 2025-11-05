import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/utils/cn"
import { formatCurrency, formatPercentage } from "@/utils/formatters"

interface DashboardCardProps {
  title: string
  amount: number
  difference: number
  color?: "emerald" | "rose"
}

export function DashboardCard({
  title,
  amount,
  difference,
  color = "emerald",
}: DashboardCardProps) {
  const IS_POSITIVE = difference >= 0
  const WHICH_COLOR = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-4">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "size-12 flex items-center justify-center rounded-xl",
            WHICH_COLOR[color].bg,
          )}
        >
          {color === "emerald" ? (
            <TrendingUpIcon className="size-6 text-emerald-600" />
          ) : (
            <TrendingDownIcon className="size-6 text-rose-600" />
          )}
        </div>

        <p
          className={cn(
            "text-sm font-medium",
            IS_POSITIVE ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {formatPercentage(difference)}
        </p>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-zinc-600">{title}</h3>
        <p className={cn("text-2xl font-bold", WHICH_COLOR[color].text)}>
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  )
}
