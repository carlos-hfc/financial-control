import { api } from "@/lib/axios"

export interface AddAccountRequest {
  name: string
  type: "corrente" | "credito" | "poupanca"
  currentBalance: number
}

export interface AddAccountResponse {
  accountId: string
}

export async function addAccount({
  name,
  currentBalance,
  type,
}: AddAccountRequest) {
  const response = await api.post<AddAccountResponse>("/accounts", {
    name,
    currentBalance,
    type,
  })

  return response.data
}
