import { api } from "@/lib/axios"

export interface GetMonthExpenseResponse {
  expense: number
  diffFromLastMonth: number
}

export async function getMonthExpense() {
  const response = await api.get<GetMonthExpenseResponse>(
    "/metrics/month-expense",
  )

  return response.data
}
