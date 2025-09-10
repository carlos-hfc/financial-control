import { hash, verify } from "argon2"
import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"
import { ClientError } from "../../errors/client-error.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { UserAlreadyExists } from "../../errors/user-already-exists.ts"
import { auth } from "../../middlewares/auth.ts"

export const editProfileRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/profile",
    {
      schema: {
        tags: ["profile"],
        summary: "Update logged user profile",
        body: z
          .object({
            name: z.string().optional(),
            email: z.email().optional(),
            password: z.string().optional(),
            confirmPassword: z.string().optional(),
          })
          .refine(data => data.password === data.confirmPassword, {
            message: "Password and confirm password don't match",
            path: ["confirmPassword"],
          }),
        response: {
          204: z.null().describe("No Content"),
          400: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Unauthorized"),
          404: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Not Found"),
          409: z
            .object({
              statusCode: z.number(),
              message: z.string(),
            })
            .describe("Conflict"),
        },
      },
    },
    async (request, reply) => {
      const { id } = await request.getCurrentUser()

      const result = await db.select().from(users).where(eq(users.id, id))

      if (result.length <= 0) {
        throw new ResourceNotFound("User not found")
      }

      const user = result[0]

      const { email, name, password } = request.body

      let passwordHash

      if (password) {
        if (await verify(user.password, password)) {
          throw new ClientError(
            "New password cannot be equal to the current password",
          )
        }

        passwordHash = await hash(password)
      }

      if (email) {
        const exists = await db
          .select()
          .from(users)
          .where(email ? eq(users.email, email) : undefined)

        if (exists.length > 0) {
          throw new UserAlreadyExists()
        }
      }

      await db
        .update(users)
        .set({
          name,
          email,
          password: passwordHash,
        })
        .where(eq(users.id, id))

      return reply.status(204).send()
    },
  )
}
