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
          account: z.uuid().optional(),
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
      const { category, type, pageIndex, account } = request.query

      const baseQuery = db.$with("baseQuery").as(
        db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              type && eq(transactions.type, type),
              category ? eq(transactions.categoryId, category) : undefined,
              account ? eq(transactions.accountId, account) : undefined,
            ),
          ),
      )

      const allTransactions = await db
        .with(baseQuery)
        .select({
          id: baseQuery.id,
          type: baseQuery.type,
          accountId: baseQuery.accountId,
          categoryId: baseQuery.categoryId,
          userId: baseQuery.userId,
          value: baseQuery.value,
          description: baseQuery.description,
          date: baseQuery.date,
          createdAt: baseQuery.createdAt,
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
        .from(baseQuery)
        .innerJoin(accounts, eq(baseQuery.accountId, accounts.id))
        .innerJoin(categories, eq(baseQuery.categoryId, categories.id))
        .offset(pageIndex * 10)
        .limit(10)
        .orderBy(({ createdAt, date, description }) => [
          desc(date),
          desc(createdAt),
          asc(description),
        ])

      const [transactionsCount] = await db
        .with(baseQuery)
        .select({ count: count() })
        .from(baseQuery)

      return reply.status(200).send({
        transactions: allTransactions.map(item => ({
          ...item,
          value: Number(item.value),
          account: {
            ...item.account,
            currentBalance: Number(item.account?.currentBalance ?? 0),
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
