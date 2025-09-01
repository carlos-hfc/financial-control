import { and, eq } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import {
  accounts,
  categories,
  transactions,
  transactionTypeRole,
} from "../../database/schema.ts"
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
        db
          .select()
          .from(accounts)
          .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId))),
        db
          .select()
          .from(categories)
          .where(
            and(eq(categories.id, categoryId), eq(categories.userId, userId)),
          ),
      ])

      if (existsAccount.length <= 0 || existsCategory.length <= 0) {
        throw new ResourceNotFound()
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
        Number(existsAccount[0].currentBalance) +
        value * (type === "despesa" ? -1 : 1)

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
