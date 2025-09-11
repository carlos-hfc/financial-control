import { api } from "@/lib/axios"

export interface SignInRequest {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInRequest) {
  await api.post("/session/authenticate", {
    email,
    password,
  })
}
