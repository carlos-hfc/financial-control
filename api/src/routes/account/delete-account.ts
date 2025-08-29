import { and, eq } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accounts } from "../../database/schema.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const deleteAccountRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).delete(
    "/accounts/:accountId",
    {
      schema: {
        tags: ["account"],
        summary: "Delete account",
        params: z.object({
          accountId: z.uuid(),
        }),
        response: {
          204: z.null().describe("No Content"),
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
          404: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Not Found"),
        },
      },
    },
    async (request, reply) => {
      const { accountId } = request.params
      const { id: userId } = await request.getCurrentUser()

      const exists = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))

      if (exists.length <= 0) {
        throw new ResourceNotFound()
      }

      await db
        .delete(accounts)
        .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))

      return reply.status(204).send()
    },
  )
}
