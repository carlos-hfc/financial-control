import { asc, count, desc, eq, sql } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { categories, transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getMonthFinancialByCategoryRoute: FastifyPluginAsyncZod =
  async app => {
    app.register(auth).get(
      "/metrics/month-financial-by-category",
      {
        schema: {
          tags: ["metrics"],
          summary: "List monthly financial by category",
          response: {
            200: z
              .array(
                z.object({
                  amount: z.number(),
                  category: z.string().nullable(),
                  income: z.number(),
                  expense: z.number(),
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

        const result = await db
          .select({
            amount: count(categories.id),
            category: categories.name,
            income:
              sql`sum(case when ${transactions.type} = 'income' then ${transactions.value} else 0 end)`.mapWith(
                Number,
              ),
            expense:
              sql`sum(case when ${transactions.type} = 'expense' then ${transactions.value} else 0 end)`.mapWith(
                Number,
              ),
          })
          .from(transactions)
          .where(
            sql`${transactions.userId} = ${userId} and ${transactions.date} between date_trunc('month', current_date)::date and (date_trunc('month', current_date) + interval '1 month - 1 day')::date`,
          )
          .leftJoin(categories, eq(transactions.categoryId, categories.id))
          .groupBy(({ category }) => category)
          .orderBy(({ amount, category }) => [desc(amount), asc(category)])

        return reply.status(200).send(result)
      },
    )
  }
