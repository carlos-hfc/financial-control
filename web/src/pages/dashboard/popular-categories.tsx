import { useQuery } from "@tanstack/react-query"
import { BarChartIcon, Loader2Icon } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import colors from "tailwindcss/colors"

import { getPopularCategories } from "@/http/get-popular-categories"

const COLORS = [
  colors.sky[500],
  colors.emerald[500],
  colors.rose[500],
  colors.violet[500],
  colors.amber[500],
]

export function PopularCategories() {
  const { data: popularProducts, isLoading } = useQuery({
    queryKey: ["metrics", "popular-products"],
    queryFn: getPopularCategories,
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-800">
          Categorias Populares
        </h3>
        <BarChartIcon className="size-4 text-zinc-600" />
      </div>

      <div>
        {isLoading && (
          <div className="grid place-items-center h-60">
            <Loader2Icon className="size-8 animate-spin text-zinc-600" />
          </div>
        )}

        {popularProducts && popularProducts.length > 0 && (
          <ResponsiveContainer height={240}>
            <PieChart className="text-xs">
              <Pie
                data={popularProducts}
                dataKey="amount"
                nameKey="category"
                outerRadius={86}
                innerRadius={64}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} - (${value})`}
              >
                {popularProducts?.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                    className="stroke-white hover:opacity-80"
                  />
                ))}
              </Pie>
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
