import { useQuery } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import colors from "tailwindcss/colors"

import { getMonthlyExpenseCategory } from "@/http/get-monthly-expense-category"
import { formatCurrency } from "@/utils/formatters"

const COLORS = [
  colors.sky[500],
  colors.emerald[500],
  colors.rose[500],
  colors.violet[500],
  colors.amber[500],
]

export function MonthlyExpenseCategory() {
  const { data: monthlyExpense, isLoading } = useQuery({
    queryKey: ["metrics", "monthly-expense-category"],
    queryFn: getMonthlyExpenseCategory,
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-zinc-800">
          Gastos por categoria
        </h3>
      </div>

      {isLoading && (
        <div className="grid place-items-center h-60">
          <Loader2Icon className="size-8 animate-spin text-zinc-600" />
        </div>
      )}

      {monthlyExpense && monthlyExpense.length > 0 && (
        <div className="space-y-4">
          {monthlyExpense.map((item, i) => (
            <div
              key={item.category}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-800">
                  {item.category}
                </span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-zinc-900">
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-xs font-semibold text-zinc-600 ml-2">
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all bg-rose-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[i],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!monthlyExpense || monthlyExpense?.length <= 0) && (
        <div className="grid place-items-center h-60">
          <p className="text-zinc-800">Nenhuma despesa encontrada esse mês</p>
        </div>
      )}
    </div>
  )
}
