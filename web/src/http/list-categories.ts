import { api } from "@/lib/axios"

export type ListCategoriesResponse = {
  id: string
  name: string
}

export async function listCategories() {
  const response = await api.get<ListCategoriesResponse[]>("/categories")

  return response.data
}
