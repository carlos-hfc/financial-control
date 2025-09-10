import { subDays } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { DateRangePicker } from "@/components/date-range-picker"
import { Label } from "@/components/label"
import { formatCurrency, formatDate } from "@/utils/formatters"

const data = [
  { date: "2025-09-01", income: 80, expense: 50 },
  { date: "2025-09-02", income: 50, expense: 100 },
  { date: "2025-09-03", income: 0, expense: 5 },
  { date: "2025-09-04", income: 8, expense: 0 },
  { date: "2025-09-05", income: 0, expense: 0 },
  { date: "2025-09-06", income: 0, expense: 10 },
  { date: "2025-09-07", income: 10, expense: 5 },
]

export function FinancialChart() {
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-zinc-800">
          Gastos por Categoria
        </h3>

        <div className="flex items-center gap-3">
          <Label htmlFor="date">Período</Label>
          <DateRangePicker
            date={date}
            onDateChange={setDate}
          />
        </div>
      </div>

      <div>
        <ResponsiveContainer height={240}>
          <BarChart
            className="text-xs"
            accessibilityLayer
            data={data}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={16}
              tickFormatter={formatDate}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              labelFormatter={formatDate}
              formatter={value => (
                <div className="flex items-center text-xs font-mono font-semibold">
                  {formatCurrency(Number(value))}
                </div>
              )}
            />
            <Bar
              dataKey="income"
              strokeWidth={2}
              className="fill-emerald-600"
            />
            <Bar
              dataKey="expense"
              strokeWidth={2}
              className="fill-rose-600"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
