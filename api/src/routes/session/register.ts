import { hash } from "argon2"
import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"
import { UserAlreadyExists } from "../../errors/user-already-exists.ts"

export const registerRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    "/session/register",
    {
      schema: {
        tags: ["session"],
        summary: "Register user",
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
        }),
        response: {
          201: z
            .object({
              userId: z.uuid(),
            })
            .describe("Created"),
          409: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Conflict"),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body

      const userExists = await db
        .select({
          email: users.email,
        })
        .from(users)
        .where(eq(users.email, email))

      if (userExists.length > 0) {
        throw new UserAlreadyExists()
      }

      const passwordHash = await hash(password)

      const result = await db
        .insert(users)
        .values({
          email,
          name,
          password: passwordHash,
        })
        .returning()

      return reply.status(201).send({ userId: result[0].id })
    },
  )
}
