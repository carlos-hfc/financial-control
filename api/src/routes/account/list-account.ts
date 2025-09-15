import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accountTypeRole } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const listAccountRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/accounts",
    {
      schema: {
        tags: ["account"],
        summary: "List accounts by user",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                userId: z.uuid(),
                name: z.string(),
                type: z.enum(accountTypeRole.enumValues),
                currentBalance: z.number(),
              }),
            )
            .describe("OK"),
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

      const result = await db.query.accounts.findMany({
        orderBy(fields, { desc, asc }) {
          return [desc(fields.createdAt), asc(fields.name)]
        },
        where(fields, { eq }) {
          return eq(fields.userId, userId)
        },
      })

      return reply.send(
        result.map(item => ({
          ...item,
          currentBalance: Number(item.currentBalance),
        })),
      )
    },
  )
}
