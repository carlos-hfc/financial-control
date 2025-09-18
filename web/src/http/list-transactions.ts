import { api } from "@/lib/axios"

import { ListAccountsResponse } from "./list-accounts"
import { ListCategoriesResponse } from "./list-categories"

export type ListTransactionsResponse = {
  id: string
  userId: string
  categoryId: string
  accountId: string
  name: string
  type: "income" | "expense"
  value: number
  description: string
  date: string
  category: ListCategoriesResponse
  account: ListAccountsResponse
}

export async function listTransactions() {
  const response = await api.get<ListTransactionsResponse[]>("/transactions")

  return response.data
}
