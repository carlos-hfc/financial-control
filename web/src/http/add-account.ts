import { api } from "@/lib/axios"

export interface AddAccountRequest {
  name: string
  type: string
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
