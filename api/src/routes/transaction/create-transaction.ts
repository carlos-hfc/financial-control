import { isAfter, startOfDay, startOfToday } from "date-fns"
import { and, eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import {
  accounts,
  transactions,
  transactionTypeRole,
} from "../../database/schema.ts"
import { NotAllowed } from "../../errors/not-allowed.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const createTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/transactions",
    {
      schema: {
        tags: ["transaction"],
        summary: "Create transaction",
        body: z.object({
          accountId: z.uuid(),
          categoryId: z.uuid(),
          date: z.string(),
          description: z.string(),
          value: z.number(),
          type: z
            .string()
            .toLowerCase()
            .pipe(z.enum(transactionTypeRole.enumValues)),
        }),
        response: {
          201: z.object({ transactionId: z.uuid() }).describe("Created"),
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
          404: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Not Found"),
        },
      },
    },
    async (request, reply) => {
      const { accountId, categoryId, date, description, type, value } =
        request.body
      const { id: userId } = await request.getCurrentUser()

      const [existsAccount, existsCategory] = await Promise.all([
        db.query.accounts.findFirst({
          where(fields, { and, eq }) {
            return and(eq(fields.id, accountId), eq(fields.userId, userId))
          },
        }),
        db.query.categories.findFirst({
          where(fields, { and, eq }) {
            return and(eq(fields.id, categoryId), eq(fields.userId, userId))
          },
        }),
      ])

      if (!existsAccount || !existsCategory) {
        throw new ResourceNotFound()
      }

      const today = startOfToday()
      const dateIsAfterToday = isAfter(startOfDay(new Date(date)), today)

      if (dateIsAfterToday) {
        throw new NotAllowed(
          "The transaction date cannot be after the current date",
        )
      }

      const result = await db
        .insert(transactions)
        .values({
          accountId,
          categoryId,
          date,
          description,
          type,
          value: String(value),
          userId,
        })
        .returning()

      const newBalance =
        Number(existsAccount.currentBalance) +
        value * (type === "expense" ? -1 : 1)

      await db
        .update(accounts)
        .set({
          currentBalance: newBalance.toFixed(2),
        })
        .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))

      return reply.status(201).send({ transactionId: result[0].id })
    },
  )
}
