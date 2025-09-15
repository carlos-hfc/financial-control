import { api } from "@/lib/axios"

export type ListAccountsResponse = Array<{
  id: string
  name: string
  type: "corrente" | "poupanca" | "credito"
  currentBalance: number
}>

export async function listAccounts() {
  const response = await api.get<ListAccountsResponse>("/accounts")

  return response.data
}
