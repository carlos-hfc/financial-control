import { useQuery } from "@tanstack/react-query"

import { PageTitle } from "@/components/page-title"
import { Skeleton } from "@/components/skeleton"
import { getMonthAmountTransactions } from "@/http/get-month-amount-transactions"
import { getMonthExpense } from "@/http/get-month-expense"
import { getMonthIncome } from "@/http/get-month-income"

import { DashboardCard } from "./dashboard-card"
import { DashboardCardSkeleton } from "./dashboard-card-skeleton"
import { FinancialChart } from "./financial-chart"
import { MonthlyExpenseCategory } from "./monthly-expense-category"
import { PopularCategories } from "./popular-categories"

export function Dashboard() {
  const { data: monthAmountTransactions } = useQuery({
    queryKey: ["metrics", "month-amount-transactions"],
    queryFn: getMonthAmountTransactions,
  })

  const { data: monthIncome } = useQuery({
    queryKey: ["metrics", "month-income"],
    queryFn: getMonthIncome,
  })

  const { data: monthExpense } = useQuery({
    queryKey: ["metrics", "month-expense"],
    queryFn: getMonthExpense,
  })

  return (
    <div className="space-y-6">
      <PageTitle
        title="Dashboard"
        description="Visão geral e análise detalhada das suas fincanças"
      >
        {monthAmountTransactions ? (
          <div className="text-right">
            <p className="text-zinc-500 text-sm capitalize">
              {monthAmountTransactions?.monthWithYear}
            </p>
            <p className="text-lg font-semibold">
              {monthAmountTransactions?.amount} transação(ões)
            </p>
          </div>
        ) : (
          <div>
            <Skeleton className="w-28 h-3 mb-1 ml-auto" />
            <Skeleton className="w-40 h-4" />
          </div>
        )}
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monthIncome ? (
          <DashboardCard
            title="Receita total (mês)"
            amount={monthIncome.income}
            diffFromLastMonth={monthIncome.diffFromLastMonth}
            color="emerald"
          />
        ) : (
          <DashboardCardSkeleton />
        )}

        {monthExpense ? (
          <DashboardCard
            title="Despesa total (mês)"
            amount={monthExpense.expense}
            diffFromLastMonth={monthExpense.diffFromLastMonth}
            color="rose"
          />
        ) : (
          <DashboardCardSkeleton />
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <MonthlyExpenseCategory />
        <PopularCategories />
      </div>

      <FinancialChart />
    </div>
  )
}
