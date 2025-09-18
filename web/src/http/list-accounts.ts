import { api } from "@/lib/axios"

export type ListAccountsResponse = {
  id: string
  name: string
  type: string
  currentBalance: number
}

export async function listAccounts() {
  const response = await api.get<ListAccountsResponse[]>("/accounts")

  return response.data
}
