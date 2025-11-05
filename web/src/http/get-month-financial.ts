import { api } from "@/lib/axios"

interface Base {
  value: number
  diffFromLastMonth: number
}

export interface GetMonthFinancialRequest {
  income: Base
  expense: Base
}

export async function getMonthFinancial() {
  const response = await api.get<GetMonthFinancialRequest>(
    "/metrics/month-financial",
  )

  return response.data
}
