import { and, count, desc, eq, gte } from "drizzle-orm"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { categories, transactions } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const getPopularCategoriesRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/metrics/popular-categories",
    {
      schema: {
        tags: ["metrics"],
        summary: "List popular categories",
        response: {
          200: z
            .array(
              z.object({
                category: z.string().nullable(),
                amount: z.number(),
              }),
            )
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
      const { id } = await request.getCurrentUser()

      const popularCategories = await db
        .select({
          category: categories.name,
          amount: count(transactions.id),
        })
        .from(transactions)
        .leftJoin(categories, eq(categories.id, transactions.categoryId))
        .where(and(eq(transactions.userId, id)))
        .groupBy(({ category }) => category)
        .orderBy(({ amount }) => desc(amount))
        .limit(5)
        .having(({ amount }) => gte(amount, 1))

      return reply.status(200).send(popularCategories)
    },
  )
}
