import {
  endOfMonth,
  format,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns"
import { and, desc, eq, gte, sql, sum } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getMonthExpenseRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/month-expense",
    {
      schema: {
        tags: ["metrics"],
        summary: "List monthly expense",
        response: {
          200: z
            .object({
              expense: z.number(),
              diffFromLastMonth: z.number(),
            })
            .describe("OK"),
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

      const today = startOfToday()
      const endOfCurrentMonth = endOfMonth(today)
      const startOfLastMonth = startOfMonth(subMonths(today, 1))
      const currentMonthWithYear = format(endOfCurrentMonth, "yyyy-MM")
      const lastMonthWithYear = format(
        subMonths(endOfCurrentMonth, 1),
        "yyyy-MM",
      )

      const result = await db
        .select({
          expense: sum(transactions.value).mapWith(Number),
          monthWithYear: sql<string>`to_char(${transactions.date}, 'YYYY-MM')`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.type, "expense"),
            gte(transactions.date, startOfLastMonth.toISOString()),
          ),
        )
        .groupBy(({ monthWithYear }) => monthWithYear)
        .orderBy(({ monthWithYear }) => desc(monthWithYear))
        .having(({ expense }) => gte(expense, 1))

      const currentMonthexpense = result.find(
        item => item.monthWithYear === currentMonthWithYear,
      )
      const lastMonthexpense = result.find(
        item => item.monthWithYear === lastMonthWithYear,
      )

      const diffFromLastMonth =
        lastMonthexpense && currentMonthexpense
          ? (currentMonthexpense.expense * 100) / lastMonthexpense.expense - 100
          : null

      return reply.status(200).send({
        diffFromLastMonth: diffFromLastMonth
          ? Number(diffFromLastMonth.toFixed(2))
          : 0,
        expense: Number(currentMonthexpense?.expense ?? 0),
      })
    },
  )
}
