import { api } from "@/lib/axios"

export interface UpdateAccountRequest {
  accountId: string
  name: string
  type: string
}

export async function updateAccount({
  accountId,
  name,
  type,
}: UpdateAccountRequest) {
  const response = await api.put(`/accounts/${accountId}`, {
    name,
    type,
  })

  return response.data
}
