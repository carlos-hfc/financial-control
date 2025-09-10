import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { categories } from "../../database/schema.ts"
import { auth } from "../../middlewares/auth.ts"

export const listCategoriesRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    "/categories",
    {
      schema: {
        tags: ["category"],
        summary: "List categories",
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                name: z.string(),
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
      const { id: userId } = await request.getCurrentUser()

      const result = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.userId, userId))

      return reply.send(result)
    },
  )
}
