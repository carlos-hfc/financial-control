import { PageTitle } from "@/components/page-title"

import { DashboardCard } from "./dashboard-card"
import { FinancialChart } from "./financial-chart"
import { PopularCategories } from "./popular-categories"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Dashboard"
        description="Visão geral e análise detalhada das suas fincanças"
      >
        <div className="text-right">
          <p className="text-zinc-500 text-sm">Janeiro 2025</p>
          <p className="text-lg font-semibold">0 transações</p>
        </div>
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardCard key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-9 gap-4">
        <FinancialChart />
        <PopularCategories />
      </div>
    </div>
  )
}
