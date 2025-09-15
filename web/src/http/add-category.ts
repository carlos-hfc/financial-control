import { api } from "@/lib/axios"

export interface AddCategoryRequest {
  name: string
}

export interface AddCategoryResponse {
  categoryId: string
}

export async function addCategory({ name }: AddCategoryRequest) {
  const response = await api.post<AddCategoryResponse>("/categories", { name })

  return response.data
}
