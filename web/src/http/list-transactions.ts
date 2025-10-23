import { api } from "@/lib/axios"

import { ListAccountsResponse } from "./list-accounts"
import { ListCategoriesResponse } from "./list-categories"

export interface ListTransactionRequest {
  pageIndex?: number | null
  type?: string | null
  category?: string | null
}

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

export async function listTransactions({
  category,
  pageIndex,
  type,
}: ListTransactionRequest) {
  const response = await api.get<ListTransactionsResponse>("/transactions", {
    params: {
      category: category === "all" ? null : category,
      type: type === "all" ? null : type,
      pageIndex: pageIndex ?? 0,
    },
  })

  return response.data
}
