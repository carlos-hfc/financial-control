import { api } from "@/lib/axios"

export interface DeleteTransactionRequest {
  transactionId: string
}

export async function deleteTransaction({
  transactionId,
}: DeleteTransactionRequest) {
  await api.delete(`/transactions/${transactionId}`)
}
