import { api } from "@/lib/axios"

export interface AddTransactionRequest {
  description: string
  accountId: string
  categoryId: string
  date: string
  type: string
  value: number
}

export interface AddTransactionResponse {
  transactionId: string
}

export async function addTransaction({
  accountId,
  categoryId,
  date,
  description,
  value,
  type,
}: AddTransactionRequest) {
  const response = await api.post<AddTransactionResponse>("/transactions", {
    accountId,
    categoryId,
    date,
    description,
    value,
    type,
  })

  return response.data
}
