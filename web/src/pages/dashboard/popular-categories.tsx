import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import colors from "tailwindcss/colors"

const data = [
  { category: "Alimentação", amount: 8 },
  { category: "Transporte", amount: 6 },
  { category: "Supermercado", amount: 5 },
  { category: "Investimento", amount: 4 },
  { category: "Saúde", amount: 4 },
]

const COLORS = [
  colors.sky[500],
  colors.emerald[500],
  colors.rose[500],
  colors.violet[500],
  colors.amber[500],
]

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  )
}

export function PopularCategories() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 space-y-8 xl:col-span-3">
      <h3 className="text-lg font-semibold text-zinc-800">
        Categorias Populares
      </h3>

      <div>
        <ResponsiveContainer height={240}>
          <PieChart className="text-xs">
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              outerRadius={86}
              innerRadius={64}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }) => {
                const RADIAN = Math.PI / 180
                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={x}
                    y={y}
                    fill={COLORS[index]}
                    className="text-xs"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {data[index].category.length > 12
                      ? data[index].category.substring(0, 12).concat("...")
                      : data[index].category}{" "}
                    ({value})
                  </text>
                )
              }}
            >
              {data.map((_, i) => (
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
