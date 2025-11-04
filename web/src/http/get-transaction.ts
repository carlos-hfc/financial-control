import { api } from "@/lib/axios"

export interface GetTransactionRequest {
  transactionId: string
}

export interface GetTransactionResponse {
  id: string
  date: string
  type: string
  value: number
  description: string
  accountId: string
  categoryId: string
}

export async function getTransaction({ transactionId }: GetTransactionRequest) {
  const response = await api.get<GetTransactionResponse>(
    `/transactions/${transactionId}`,
  )

  return response.data
}
