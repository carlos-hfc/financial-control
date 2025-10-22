import { api } from "@/lib/axios"

export interface UpdateCategoryRequest {
  categoryId: string
  name: string
}

export async function updateCategory({
  categoryId,
  name,
}: UpdateCategoryRequest) {
  const response = await api.put(`/categories/${categoryId}`, {
    name,
  })

  return response.data
}
