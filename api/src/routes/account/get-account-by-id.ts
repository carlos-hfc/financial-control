import { and, eq } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accounts, accountTypeRole } from "../../database/schema.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const getAccountByIdRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/accounts/:accountId",
    {
      schema: {
        tags: ["account"],
        summary: "Get account by id",
        params: z.object({
          accountId: z.uuid(),
        }),
        response: {
          200: z
            .object({
              id: z.uuid(),
              userId: z.uuid(),
              name: z.string(),
              type: z.enum(accountTypeRole.enumValues),
              initialBalance: z.number(),
              currentBalance: z.number(),
            })
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

      const result = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.userId, userId), eq(accounts.id, accountId)))

      if (result.length <= 0) {
        throw new ResourceNotFound("Account")
      }

      const account = result[0]

      return reply.status(200).send({
        ...account,
        initialBalance: Number(account.initialBalance),
        currentBalance: Number(account.currentBalance),
      })
    },
  )
}
