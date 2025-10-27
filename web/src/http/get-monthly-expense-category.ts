import { api } from "@/lib/axios"

export type GetMonthlyExpenseCategoryResponse = Array<{
  category: string
  total: number
  percentage: number
}>

export async function getMonthlyExpenseCategory() {
  const response = await api.get<GetMonthlyExpenseCategoryResponse>(
    "/metrics/month-expense-by-category",
  )

  return response.data
}
