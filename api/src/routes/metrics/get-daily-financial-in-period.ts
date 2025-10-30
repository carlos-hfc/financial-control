import { UTCDate } from "@date-fns/utc"
import {
  addDays,
  addWeeks,
  compareDesc,
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
  startOfToday,
  subWeeks,
} from "date-fns"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
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

        const { from, to } = request.query

        const startDate = format(
          from ? parseISO(from) : addDays(subWeeks(startOfToday(), 2), 1),
          "yyyy-MM-dd",
        )
        const endDate = format(
          to ? parseISO(to) : from ? addWeeks(startDate, 2) : startOfToday(),
          "yyyy-MM-dd",
        )

        if (differenceInDays(endDate, startDate) >= 14) {
          throw new NotAllowed("The interval of dates cannot exceed 14 days")
        }

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
            date: transactions.date,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate),
            ),
          )
          .groupBy(({ date }) => date)
          .orderBy(({ date }) => desc(date))

        const interval = {
          start: new UTCDate(startDate),
          end: endDate,
        }

        for (const value of eachDayOfInterval(interval)) {
          const date = format(value, "yyyy-MM-dd")

          const exists = result.find(item => item.date === date)

          if (!exists) {
            result.push({
              date,
              expense: 0,
              income: 0,
            })
          }
        }

        result.sort((a, b) => compareDesc(a.date, b.date))

        return reply.status(200).send(result)
      },
    )
  }
