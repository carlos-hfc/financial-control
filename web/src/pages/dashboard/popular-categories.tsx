import { useQuery } from "@tanstack/react-query"
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
  const { data: popularProducts } = useQuery({
    queryKey: ["metrics", "popular-products"],
    queryFn: getPopularCategories,
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-3">
      <h3 className="text-lg font-semibold text-zinc-800">
        Categorias Populares
      </h3>

      <div>
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
      </div>
    </div>
  )
}
