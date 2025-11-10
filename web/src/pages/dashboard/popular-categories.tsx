import { useQuery } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

import { Label } from "@/components/label"
import { Select } from "@/components/select"
import { getPopularCategories } from "@/http/get-popular-categories"
import { COLORS } from "@/utils/dashboard-colors"

export function PopularCategories() {
  const [period, setPeriod] = useState("general")

  const { data: popularProducts, isLoading } = useQuery({
    queryKey: ["metrics", "popular-products", period],
    queryFn: () => getPopularCategories({ period }),
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-800">
          Categorias Populares
        </h3>

        <div className="flex items-center gap-3">
          <Label>Período</Label>
          <Select
            defaultValue="general"
            value={period}
            onValueChange={setPeriod}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>

            <Select.Content>
              <Select.Item value="general">Total</Select.Item>
              <Select.Item value="current_month">Mês atual</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      <div>
        {isLoading && (
          <div className="grid place-items-center h-60">
            <Loader2Icon className="size-8 animate-spin text-zinc-600" />
          </div>
        )}

        {popularProducts && popularProducts.length > 0 && (
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <PieChart className="text-xs">
              <Pie
                data={popularProducts}
                dataKey="amount"
                nameKey="category"
                outerRadius={86}
                innerRadius={64}
                cx="50%"
                cy="50%"
              >
                {popularProducts?.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                    className="stroke-white hover:opacity-80"
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="top"
                content={({ payload }) => (
                  <div className="flex gap-x-2 md:gap-x-4 flex-wrap">
                    {payload?.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-2 items-center"
                      >
                        <span
                          className="size-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <p style={{ color: item.color }}>
                          {item?.value} - ({(item.payload as any)?.amount})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {!isLoading && (!popularProducts || popularProducts?.length <= 0) && (
          <div className="grid place-items-center h-60">
            <p className="text-zinc-800">
              Nenhuma despesa encontrada para as suas categorias
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
