import { desc, eq, sql, sum } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { categories, transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getMonthExpenseByCategoryRoute: FastifyPluginAsyncZod =
  async app => {
    app.register(auth).get(
      "/metrics/month-expense-by-category",
      {
        schema: {
          tags: ["metrics"],
          summary: "List monthly expense by category",
          response: {
            200: z
              .array(
                z.object({
                  category: z.string().nullable(),
                  total: z.number(),
                  percentage: z.number(),
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

        const where = sql`${transactions.userId} = ${userId} and ${transactions.date} between date_trunc('month', current_date)::date and (date_trunc('month', current_date) + interval '1 month - 1 day')::date and ${transactions.type} = 'expense'`

        const [{ total: totalExpenses }] = await db
          .select({
            total: sum(transactions.value).mapWith(Number),
          })
          .from(transactions)
          .where(where)

        if (!totalExpenses) {
          return []
        }

        const result = await db
          .select({
            category: categories.name,
            total: sum(transactions.value).mapWith(Number),
            percentage:
              sql`(sum(${transactions.value}) * 100 / ${totalExpenses})`.mapWith(
                Number,
              ),
          })
          .from(transactions)
          .where(where)
          .leftJoin(categories, eq(transactions.categoryId, categories.id))
          .groupBy(({ category }) => category)
          .orderBy(fields => [desc(fields.percentage), desc(fields.total)])
          .limit(5)

        return reply.status(200).send(result)
      },
    )
  }
