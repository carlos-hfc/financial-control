import { api } from "@/lib/axios"

export interface GetMonthIncomeResponse {
  income: number
  diffFromLastMonth: number
}

export async function getMonthIncome() {
  const response = await api.get<GetMonthIncomeResponse>(
    "/metrics/month-income",
  )

  return response.data
}
