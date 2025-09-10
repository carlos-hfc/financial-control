import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accounts, accountTypeRole } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const createAccountRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/accounts",
    {
      schema: {
        tags: ["account"],
        summary: "Create account",
        body: z.object({
          name: z.string(),
          currentBalance: z.number(),
          type: z
            .string()
            .toLowerCase()
            .pipe(z.enum(accountTypeRole.enumValues))
            .default("corrente"),
        }),
        response: {
          201: z.object({ accountId: z.uuid() }).describe("Created"),
          400: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Bad Request"),
          401: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Unauthorized"),
        },
      },
    },
    async (request, reply) => {
      const { id: userId } = await request.getCurrentUser()

      const { currentBalance, name, type } = request.body

      const result = await db
        .insert(accounts)
        .values({
          userId,
          currentBalance: String(currentBalance),
          name,
          type,
        })
        .returning()

      return reply.status(201).send({ accountId: result[0].id })
    },
  )
}
