import {
  addDays,
  addWeeks,
  compareDesc,
  differenceInDays,
  eachDayOfInterval,
  format,
  startOfToday,
  subWeeks,
} from "date-fns"
import { and, between, desc, eq, sql } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactions } from "../../database/schema.ts"
import { NotAllowed } from "../../errors/not-allowed.ts"
import { auth } from "../../middlewares/auth.ts"

export const getDailyFinancialInPeriodRoute: FastifyPluginAsyncZod =
  async app => {
    app.register(auth).get(
      "/metrics/daily-financial-in-period",
      {
        schema: {
          tags: ["metrics"],
          summary: "List daily financial for period",
          querystring: z.object({
            from: z.string().optional(),
            to: z.string().optional(),
          }),
          response: {
            200: z
              .array(
                z.object({
                  date: z.string(),
                  receita: z.number(),
                  despesa: z.number(),
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

        const { from, to } = request.query

        const startDate = format(
          from ? addDays(from, 1) : subWeeks(startOfToday(), 1),
          "yyyy-MM-dd",
        )
        const endDate = format(
          to ? addDays(to, 1) : from ? addWeeks(startDate, 1) : startOfToday(),
          "yyyy-MM-dd",
        )

        if (differenceInDays(endDate, startDate) > 7) {
          throw new NotAllowed("The interval of dates cannot exceed 7 days")
        }

        const result = await db
          .select({
            receita:
              sql`sum(case when ${transactions.type} = 'receita' then ${transactions.value} else 0 end)`.mapWith(
                Number,
              ),
            despesa:
              sql`sum(case when ${transactions.type} = 'despesa' then ${transactions.value} else 0 end)`.mapWith(
                Number,
              ),
            date: transactions.date,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              between(transactions.date, startDate, endDate),
            ),
          )
          .groupBy(({ date }) => date)
          .orderBy(({ date }) => desc(date))

        const interval = {
          start: startDate,
          end: endDate,
        }

        for (const value of eachDayOfInterval(interval)) {
          const date = format(value, "yyyy-MM-dd")

          const exists = result.find(item => item.date === date)

          if (!exists) {
            result.push({
              date,
              despesa: 0,
              receita: 0,
            })
          }
        }

        result.sort((a, b) => compareDesc(a.date, b.date)).pop()

        return reply.status(200).send(result)
      },
    )
  }
