import { and, eq, sql } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accounts, transactions } from "../../database/schema.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const deleteTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).delete(
    "/transactions/:transactionId",
    {
      schema: {
        tags: ["transaction"],
        summary: "Delete transacation",
        params: z.object({
          transactionId: z.uuid(),
        }),
        response: {
          204: z.null().describe("No Content"),
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
      const { id: userId } = await request.getCurrentUser()
      const { transactionId } = request.params

      const transaction = await db.query.transactions.findFirst({
        where(fields, { and, eq }) {
          return and(eq(fields.id, transactionId), eq(fields.userId, userId))
        },
      })

      if (!transaction) {
        throw new ResourceNotFound("Transaction")
      }

      await db
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, transactionId),
            eq(transactions.userId, userId),
          ),
        )

      await db
        .update(accounts)
        .set({
          currentBalance: sql`${accounts.currentBalance} + ${Number(transaction.value) * (transaction.type === "expense" ? 1 : -1)}`,
        })
        .where(
          and(
            eq(accounts.id, transaction.accountId),
            eq(accounts.userId, userId),
          ),
        )

      return reply.status(204).send()
    },
  )
}
