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

      const result = await db
        .select({
          expense: sum(transactions.value).mapWith(Number),
          monthWithYear: sql`to_char(${transactions.date}, 'YYYY-MM')`.mapWith(
            String,
          ),
          currentMonth:
            sql`case when to_char(date_trunc('month', now()), 'YYYY-MM') = to_char(${transactions.date}, 'YYYY-MM') then true else false end`.mapWith(
              Boolean,
            ),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.type, "expense"),
            gte(
              transactions.date,
              sql`date_trunc('month', now()) - interval '1 month'`,
            ),
          ),
        )
        .groupBy(({ monthWithYear }) => monthWithYear)
        .orderBy(({ monthWithYear }) => desc(monthWithYear))

      const currentMonthExpense = result.find(item => item.currentMonth)
      const lastMonthExpense = result.find(item => !item.currentMonth)

      const diffFromLastMonth =
        lastMonthExpense && currentMonthExpense
          ? ((currentMonthExpense.expense - lastMonthExpense.expense) /
              lastMonthExpense.expense) *
            100
          : null

      return reply.status(200).send({
        diffFromLastMonth: diffFromLastMonth
          ? Number(diffFromLastMonth.toFixed(2))
          : 0,
        expense: Number(currentMonthExpense?.expense ?? 0),
      })
    },
  )
}
