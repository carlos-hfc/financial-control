import { api } from "@/lib/axios"

export interface GetPopularCategoriesRequest {
  period: string
}

export interface GetPopularCategoriesResponse {
  category: string
  amount: number
}

export async function getPopularCategories({
  period,
}: GetPopularCategoriesRequest) {
  const response = await api.get<GetPopularCategoriesResponse[]>(
    "/metrics/popular-categories",
    {
      params: {
        period,
      },
    },
  )

  return response.data
}
