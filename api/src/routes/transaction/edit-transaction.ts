import { isAfter, startOfDay, startOfToday } from "date-fns"
import { and, eq } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
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

export const editTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/transactions/:transactionId",
    {
      schema: {
        tags: ["transaction"],
        summary: "Update transaction",
        params: z.object({
          transactionId: z.uuid(),
        }),
        body: z.object({
          categoryId: z.uuid().optional(),
          date: z.string().optional(),
          description: z.string().optional(),
          value: z.number().optional(),
          type: z
            .string()
            .toLowerCase()
            .pipe(z.enum(transactionTypeRole.enumValues))
            .optional(),
        }),
        response: {
          204: z.null().describe("No Content"),
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
      const { id: userId } = await request.getCurrentUser()
      const { transactionId } = request.params

      const existsTransaction = await db.query.transactions.findFirst({
        with: {
          account: {
            columns: {
              currentBalance: true,
            },
          },
        },
        where(fields, { and, eq }) {
          return and(eq(fields.id, transactionId), eq(fields.userId, userId))
        },
      })

      if (!existsTransaction) {
        throw new ResourceNotFound("Transaction")
      }

      const { value, type, categoryId, date, description } = request.body

      if (categoryId) {
        const existsCategory = await db.query.categories.findFirst({
          where(fields, { and, eq }) {
            return and(eq(fields.id, categoryId), eq(fields.userId, userId))
          },
        })

        if (!existsCategory) {
          throw new ResourceNotFound("Category")
        }
      }

      if (date) {
        const today = startOfToday()
        const dateIsAfterToday = isAfter(startOfDay(new Date(date)), today)

        if (dateIsAfterToday) {
          throw new NotAllowed(
            "The transaction date cannot be after the current date",
          )
        }
      }

      const newValue = value ?? Number(existsTransaction.value)
      const newType = type ?? existsTransaction.type
      const newBalance =
        Number(existsTransaction.account.currentBalance) +
        newValue * (newType === "despesa" ? -1 : 1)

      await db
        .update(transactions)
        .set({
          value: value?.toFixed(2) ?? undefined,
          type,
          categoryId,
          date,
          description,
        })
        .where(
          and(
            eq(transactions.id, transactionId),
            eq(transactions.userId, userId),
          ),
        )

      if (
        (value && value !== Number(existsTransaction.value)) ||
        (type && type !== existsTransaction.type)
      ) {
        await db
          .update(accounts)
          .set({
            currentBalance: newBalance.toFixed(2),
          })
          .where(
            and(
              eq(accounts.id, existsTransaction.accountId),
              eq(accounts.userId, userId),
            ),
          )
      }

      return reply.status(204).send()
    },
  )
}
