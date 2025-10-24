import { api } from "@/lib/axios"

export interface GetPopularCategoriesResponse {
  category: string
  amount: number
}

export async function getPopularCategories() {
  const response = await api.get<GetPopularCategoriesResponse[]>(
    "/metrics/popular-categories",
  )

  return response.data
}
