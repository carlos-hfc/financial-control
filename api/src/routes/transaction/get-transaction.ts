import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactionTypeRole } from "../../database/schema.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const getTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/transactions/:transactionId",
    {
      schema: {
        tags: ["transaction"],
        summary: "Get transacation",
        params: z.object({
          transactionId: z.uuid(),
        }),
        response: {
          200: z
            .object({
              transaction: z.object({
                id: z.uuid(),
                accountId: z.uuid(),
                categoryId: z.uuid(),
                userId: z.string(),
                date: z.string(),
                description: z.string(),
                type: z.enum(transactionTypeRole.enumValues),
                value: z.number(),
                createdAt: z.date(),
              }),
            })
            .describe("OK"),
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

      return reply.status(200).send({
        transaction: {
          ...transaction,
          value: Number(transaction.value),
        },
      })
    },
  )
}
