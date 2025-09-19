import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { accountTypeRole, transactionTypeRole } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const listTransactionsRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/transactions",
    {
      schema: {
        tags: ["transaction"],
        summary: "List transactions",
        querystring: z.object({
          type: z.enum(transactionTypeRole.enumValues).optional(),
          category: z.uuid().optional(),
        }),
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                accountId: z.uuid(),
                categoryId: z.uuid(),
                userId: z.uuid(),
                value: z.number(),
                type: z.enum(transactionTypeRole.enumValues),
                description: z.string(),
                date: z.string(),
                createdAt: z.date(),
                category: z.object({
                  id: z.uuid(),
                  userId: z.uuid(),
                  name: z.string(),
                  createdAt: z.date(),
                }),
                account: z.object({
                  id: z.uuid(),
                  userId: z.uuid(),
                  name: z.string(),
                  type: z.enum(accountTypeRole.enumValues),
                  currentBalance: z.number(),
                  createdAt: z.date(),
                }),
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
      const { category, type } = request.query

      const result = await db.query.transactions.findMany({
        with: {
          account: true,
          category: true,
        },
        where(fields, { eq, and }) {
          return and(
            eq(fields.userId, userId),
            type && eq(fields.type, type),
            category ? eq(fields.categoryId, category) : undefined,
          )
        },
        orderBy(fields, { asc, desc }) {
          return [
            desc(fields.date),
            desc(fields.createdAt),
            asc(fields.description),
          ]
        },
      })

      return reply.status(200).send(
        result.map(item => ({
          ...item,
          value: Number(item.value),
          account: {
            ...item.account,
            currentBalance: Number(item.account.currentBalance),
          },
        })),
      )
    },
  )
}
