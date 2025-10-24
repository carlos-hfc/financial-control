import { api } from "@/lib/axios"

export interface GetMonthAmountTransactionsResponse {
  amount: number
  monthWithYear: string
}

export async function getMonthAmountTransactions() {
  const response = await api.get<GetMonthAmountTransactionsResponse>(
    "/metrics/month-amount-transactions",
  )

  return response.data
}
