import { api } from "@/lib/axios"

import { ListAccountsResponse } from "./list-accounts"
import { ListCategoriesResponse } from "./list-categories"

export type ListTransactionsResponse = {
  meta: {
    totalCount: number
    perPage: number
    pageIndex: number
  }
  transactions: {
    id: string
    categoryId: string
    accountId: string
    type: string
    value: number
    description: string
    date: string
    category: ListCategoriesResponse
    account: ListAccountsResponse
  }[]
}

export async function listTransactions() {
  const response = await api.get<ListTransactionsResponse>("/transactions")

  return response.data
}
