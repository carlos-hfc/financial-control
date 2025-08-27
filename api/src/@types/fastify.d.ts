import "fastify"

interface CurrentUser {
  id: string
  name: string
  email: string
}

declare module "fastify" {
  export interface FastifyRequest {
    getCurrentUser(): Promise<CurrentUser>
  }
}
