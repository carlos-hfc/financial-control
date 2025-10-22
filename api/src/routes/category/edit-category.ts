import { and, eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { categories } from "../../database/schema.ts"
import { ResourceNotFound } from "../../errors/resource-not-found.ts"
import { auth } from "../../middlewares/auth.ts"

export const editCategoryRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).put(
    "/categories/:categoryId",
    {
      schema: {
        tags: ["category"],
        summary: "Update category",
        params: z.object({
          categoryId: z.uuid(),
        }),
        body: z.object({
          name: z.string(),
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
        },
      },
    },
    async (request, reply) => {
      const { categoryId } = request.params
      const { id: userId } = await request.getCurrentUser()

      const category = await db.query.categories.findFirst({
        where(fields, { and, eq }) {
          return and(eq(fields.userId, userId), eq(fields.id, categoryId))
        },
      })

      if (!category) {
        throw new ResourceNotFound("Category")
      }

      const { name } = request.body

      await db
        .update(categories)
        .set({ name })
        .where(
          and(eq(categories.userId, userId), eq(categories.id, categoryId)),
        )

      return reply.status(204).send()
    },
  )
}
