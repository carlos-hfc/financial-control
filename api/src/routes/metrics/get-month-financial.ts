import { and, desc, eq, gte, sql } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getMonthFinancialRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/month-financial",
    {
      schema: {
        tags: ["metrics"],
        summary: "List monthly financial",
        response: {
          200: z
            .object({
              income: z.object({
                value: z.number(),
                diffFromLastMonth: z.number(),
              }),
              expense: z.object({
                value: z.number(),
                diffFromLastMonth: z.number(),
              }),
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

      const result = await db
        .select({
          income:
            sql`sum(case when ${transactions.type} = 'income' then ${transactions.value} else 0 end)`.mapWith(
              Number,
            ),
          expense:
            sql`sum(case when ${transactions.type} = 'expense' then ${transactions.value} else 0 end)`.mapWith(
              Number,
            ),
          month: sql`to_char(${transactions.date}, 'YYYY-MM')`.mapWith(String),
          currentMonth:
            sql`to_char(date_trunc('month', now()), 'YYYY-MM') = to_char(${transactions.date}, 'YYYY-MM')`.mapWith(
              Boolean,
            ),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(
              transactions.date,
              sql`date_trunc('month', now()) - interval '1 month'`,
            ),
          ),
        )
        .groupBy(({ month }) => month)
        .orderBy(({ month }) => desc(month))

      const currentMonth = result.find(item => item.currentMonth)
      const lastMonth = result.find(item => !item.currentMonth)

      const income = {
        value: currentMonth?.income ?? 0,
        diffFromLastMonth: 0,
      }
      const expense = {
        value: currentMonth?.expense ?? 0,
        diffFromLastMonth: 0,
      }

      if (currentMonth && lastMonth) {
        income.diffFromLastMonth =
          ((currentMonth.income - lastMonth.income) / lastMonth.income) * 100
        expense.diffFromLastMonth =
          ((currentMonth.expense - lastMonth.expense) / lastMonth.expense) * 100
      }

      return reply.status(200).send({
        income,
        expense,
      })
    },
  )
}
