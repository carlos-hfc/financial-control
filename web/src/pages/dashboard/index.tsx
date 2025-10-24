import { useQuery } from "@tanstack/react-query"

import { PageTitle } from "@/components/page-title"
import { Skeleton } from "@/components/skeleton"
import { getMonthAmountTransactions } from "@/http/get-month-amount-transactions"

import { DashboardCard } from "./dashboard-card"
import { FinancialChart } from "./financial-chart"
import { PopularCategories } from "./popular-categories"

export function Dashboard() {
  const { data: result, isLoading: isLoadingAmountTransactions } = useQuery({
    queryKey: ["metrics", "month-amount-transactions"],
    queryFn: getMonthAmountTransactions,
  })

  return (
    <div className="space-y-6">
      <PageTitle
        title="Dashboard"
        description="Visão geral e análise detalhada das suas fincanças"
      >
        {isLoadingAmountTransactions ? (
          <div>
            <Skeleton className="w-28 h-3 mb-1 ml-auto" />
            <Skeleton className="w-40 h-4" />
          </div>
        ) : (
          <div className="text-right">
            <p className="text-zinc-500 text-sm capitalize">
              {result?.monthWithYear}
            </p>
            <p className="text-lg font-semibold">
              {result?.amount} transação(ões)
            </p>
          </div>
        )}
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
