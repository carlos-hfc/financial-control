import { eq } from "drizzle-orm"
import fastifyPlugin from "fastify-plugin"

import { db } from "../database/client.ts"
import { users } from "../database/schema.ts"
import { env } from "../env.ts"
import { Unauthorized } from "../errors/unauthorized.ts"

export const auth = fastifyPlugin(async app => {
  app.addHook("preHandler", async (request, reply) => {
    request.getCurrentUser = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        const user = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, sub))

        if (user.length <= 0) {
          return reply.clearCookie(env.COOKIE_NAME).send()
        }

        return user[0]
      } catch (error) {
        throw new Unauthorized()
      }
    }
  })
})
