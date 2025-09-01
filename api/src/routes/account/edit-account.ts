import { and, eq } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accounts, accountTypeRole } from "../../database/schema.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const editAccountRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/accounts/:accountId",
    {
      schema: {
        tags: ["account"],
        summary: "Update account",
        params: z.object({
          accountId: z.uuid(),
        }),
        body: z.object({
          name: z.string().optional(),
          type: z.enum(accountTypeRole.enumValues).optional(),
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
        throw new ResourceNotFound("Account")
      }

      const { name, type } = request.body

      await db
        .update(accounts)
        .set({
          name,
          type,
        })
        .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))

      return reply.status(204).send()
    },
  )
}
