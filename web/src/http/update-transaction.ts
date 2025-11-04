import { api } from "@/lib/axios"

export interface UpdateTransactionRequest {
  transactionId: string
  type: string
  date: string
  description: string
  accountId: string
  categoryId: string
  value: number
}

export async function updateTransaction({
  transactionId,
  categoryId,
  type,
  date,
  description,
  value,
}: UpdateTransactionRequest) {
  const response = await api.put(`/transactions/${transactionId}`, {
    type,
    date,
    description,
    value,
    categoryId,
  })

  return response.data
}
