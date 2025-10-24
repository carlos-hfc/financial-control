import { count, sql } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getMonthAmountTransactionsRoute: FastifyPluginAsyncZod =
  async app => {
    app.register(auth).get(
      "/metrics/month-amount-transactions",
      {
        schema: {
          tags: ["metrics"],
          summary: "List monthly amount of transactions",
          response: {
            200: z
              .object({
                amount: z.number(),
                monthWithYear: z.string(),
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
            amount: count(),
            monthWithYear:
              sql`to_char(${transactions.date}, 'YYYY-MM')`.mapWith(String),
          })
          .from(transactions)
          .where(
            sql`${transactions.userId} = ${userId} and ${transactions.date} >= date_trunc('month', current_date)`,
          )
          .groupBy(({ monthWithYear }) => monthWithYear)

        return reply.status(200).send(result[0])
      },
    )
  }
