import { api } from "@/lib/axios"

export interface GetDailyFinancialRequest {
  from?: Date
  to?: Date
}

export type GetDailyFinancialResponse = Array<{
  date: string
  income: number
  expense: number
}>

export async function getDailyFinancial({
  from,
  to,
}: GetDailyFinancialRequest) {
  const response = await api.get<GetDailyFinancialResponse>(
    "/metrics/daily-financial-in-period",
    {
      params: {
        from,
        to,
      },
    },
  )

  return response.data
}
