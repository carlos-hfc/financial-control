import { and, desc, eq, gte, sql } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getYearFinancialRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/year-financial",
    {
      schema: {
        tags: ["metrics"],
        summary: "List yearly financial",
        response: {
          200: z
            .object({
              income: z.object({
                value: z.number(),
                diffFromLastYear: z.number(),
              }),
              expense: z.object({
                value: z.number(),
                diffFromLastYear: z.number(),
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
          year: sql`to_char(${transactions.date}, 'YYYY')`.mapWith(String),
          currentYear:
            sql`case when to_char(date_trunc('year', now()), 'YYYY') = to_char(${transactions.date}, 'YYYY') then true else false end`.mapWith(
              Boolean,
            ),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(
              transactions.date,
              sql`date_trunc('year', now()) - interval '1 year'`,
            ),
          ),
        )
        .groupBy(({ year }) => year)
        .orderBy(({ year }) => desc(year))

      const currentYear = result.find(item => item.currentYear)
      const lastYear = result.find(item => !item.currentYear)

      const income = {
        value: currentYear?.income ?? 0,
        diffFromLastYear: 0,
      }
      const expense = {
        value: currentYear?.expense ?? 0,
        diffFromLastYear: 0,
      }

      if (currentYear && lastYear) {
        income.diffFromLastYear =
          ((currentYear.income - lastYear.income) / lastYear.income) * 100
        expense.diffFromLastYear =
          ((currentYear.expense - lastYear.expense) / lastYear.expense) * 100
      }

      return reply.status(200).send({
        income,
        expense,
      })
    },
  )
}
