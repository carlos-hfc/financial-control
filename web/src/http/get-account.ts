import { api } from "@/lib/axios"

export interface GetAccountRequest {
  accountId: string
}

export interface GetAccountResponse {
  id: string
  name: string
  type: string
  currentBalance: number
}

export async function getAccount({ accountId }: GetAccountRequest) {
  const response = await api.get<GetAccountResponse>(`/accounts/${accountId}`)

  return response.data
}
