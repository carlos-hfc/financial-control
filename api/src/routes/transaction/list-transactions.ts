import { and, asc, count, desc, eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import {
  accounts,
  accountTypeRole,
  categories,
  transactions,
  transactionTypeRole,
} from "../../database/schema.ts"
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
          pageIndex: z.coerce.number().default(0),
        }),
        response: {
          200: z
            .object({
              meta: z.object({
                totalCount: z.number(),
                pageIndex: z.number(),
                perPage: z.number(),
              }),
              transactions: z.array(
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
              ),
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
        },
      },
    },
    async (request, reply) => {
      const { id: userId } = await request.getCurrentUser()
      const { category, type, pageIndex } = request.query

      const baseQuery = db
        .select({
          type: transactions.type,
          id: transactions.id,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
          userId: transactions.userId,
          value: transactions.value,
          description: transactions.description,
          date: transactions.date,
          createdAt: transactions.createdAt,
          category: {
            id: categories.id,
            userId: categories.userId,
            name: categories.name,
            createdAt: categories.createdAt,
          },
          account: {
            id: accounts.id,
            userId: accounts.userId,
            name: accounts.name,
            type: accounts.type,
            currentBalance: accounts.currentBalance,
            createdAt: accounts.createdAt,
          },
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            eq(transactions.userId, userId),
            type && eq(transactions.type, type),
            category ? eq(transactions.categoryId, category) : undefined,
          ),
        )

      const [transactionsCount] = await db
        .select({ count: count() })
        .from(baseQuery.as("baseQuery"))

      const allTransactions = await baseQuery
        .offset(pageIndex * 10)
        .limit(10)
        .orderBy(({ createdAt, date, description }) => [
          desc(date),
          desc(createdAt),
          asc(description),
        ])

      return reply.status(200).send({
        transactions: allTransactions.map(item => ({
          ...item,
          value: Number(item.value),
          account: {
            ...item.account,
            currentBalance: Number(item.account.currentBalance),
          },
        })),
        meta: {
          pageIndex,
          perPage: 10,
          totalCount: transactionsCount.count,
        },
      })
    },
  )
}
