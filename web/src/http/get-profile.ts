import { api } from "@/lib/axios"

export interface GetProfileResponse {
  id: string
  name: string
  email: string
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>("/profile")

  return response.data
}
