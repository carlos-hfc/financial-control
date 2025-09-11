import { api } from "@/lib/axios"

export interface EditProfileRequest {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export async function editProfile({
  email,
  name,
  confirmPassword,
  password,
}: EditProfileRequest) {
  await api.put("/profile", {
    email,
    name,
    confirmPassword,
    password,
  })
}
