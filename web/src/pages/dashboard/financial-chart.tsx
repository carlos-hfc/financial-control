import { useQuery } from "@tanstack/react-query"
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
import { getDailyFinancial } from "@/http/get-daily-financial"
import { formatCurrency, formatDate } from "@/utils/formatters"

export function FinancialChart() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  })

  const { data: dailyFinancial } = useQuery({
    queryKey: ["metrics", "daily-financial", date],
    queryFn: () => getDailyFinancial(date),
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-zinc-800">
          Receitas e despesas no período
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
            data={dailyFinancial}
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
              content={({ payload }) => (
                <div className="bg-white p-1 min-w-20 rounded-md shadow-md space-y-2 text-xs">
                  <p>{formatDate(payload?.[0]?.payload.date)}</p>

                  {payload.map((item, i) => (
                    <div key={i}>
                      <p>{item?.name === "expense" ? "Despesa" : "Receita"}</p>
                      <p className="font-mono font-semibold">
                        {formatCurrency(Number(item?.value ?? 0))}
                      </p>
                    </div>
                  ))}
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
