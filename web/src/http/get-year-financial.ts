import { api } from "@/lib/axios"

interface Base {
  value: number
  diffFromLastYear: number
}

export interface GetYearFinancialRequest {
  income: Base
  expense: Base
}

export async function getYearFinancial() {
  const response = await api.get<GetYearFinancialRequest>(
    "/metrics/year-financial",
  )

  return response.data
}
