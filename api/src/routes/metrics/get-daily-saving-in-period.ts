import {
  addDays,
  addWeeks,
  differenceInDays,
  eachDayOfInterval,
  format,
  startOfToday,
  subWeeks,
} from "date-fns"
import { and, between, desc, eq, gte, sql, sum } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactions } from "../../database/schema.ts"
import { NotAllowed } from "../../errors/not-allowed.ts"
import { auth } from "../../middlewares/auth.ts"

export const getDailySavingInPeriodRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/daily-saving-in-period",
    {
      schema: {
        tags: ["metrics"],
        summary: "List daily saving for period",
        querystring: z.object({
          from: z.string().optional(),
          to: z.string().optional(),
        }),
        response: {
          200: z
            .array(
              z.object({
                date: z.string(),
                saving: z.number(),
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
        from ? addDays(from, 1) : subWeeks(addDays(startOfToday(), 1), 1),
        "yyyy-MM-dd",
      )
      const endDate = format(
        to
          ? addDays(to, 1)
          : from
            ? addWeeks(addDays(startOfToday(), 1), 1)
            : addDays(startOfToday(), 1),
        "yyyy-MM-dd",
      )

      if (differenceInDays(endDate, startDate) > 7) {
        throw new NotAllowed("The interval of dates cannot exceed 7 days")
      }

      const savingPerDay = await db
        .select({
          saving: sum(transactions.value).mapWith(Number),
          date: sql<string>`TO_CHAR(${transactions.date}, 'DD/MM')`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.type, "receita"),
            between(transactions.date, startDate, endDate),
          ),
        )
        .groupBy(({ date }) => date)
        .orderBy(({ date }) => desc(date))
        .having(({ saving }) => gte(saving, 1))

      const interval = {
        start: startDate,
        end: endDate,
      }

      for (const value of eachDayOfInterval(interval)) {
        const exists = savingPerDay.find(
          item => item.date === format(value, "dd/MM"),
        )

        if (!exists) {
          savingPerDay.push({
            date: format(value, "dd/MM"),
            saving: 0,
          })
        }
      }

      const savings = savingPerDay.sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number)
        const [dayB, monthB] = b.date.split("/").map(Number)

        if (monthA === monthB) {
          return dayB - dayA
        } else {
          const dateA = new Date(new Date().getFullYear(), monthA - 1)
          const dateB = new Date(new Date().getFullYear(), monthB - 1)

          return dateB.getTime() - dateA.getTime()
        }
      })

      savings.pop()

      return reply.status(200).send(savings)
    },
  )
}
