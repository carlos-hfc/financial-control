import { api } from "@/lib/axios"

export interface DeleteAccountRequest {
  accountId: string
}

export async function deleteAccount({ accountId }: DeleteAccountRequest) {
  await api.delete(`/accounts/${accountId}`)
}
