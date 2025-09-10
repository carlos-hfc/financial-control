import { ilike } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { categories } from "../../database/schema.ts"
import { CategoryAlreadyExists } from "../../errors/category-already-exists.ts"
import { auth } from "../../middlewares/auth.ts"

export const createCategoryRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).post(
    "/categories",
    {
      schema: {
        tags: ["category"],
        summary: "Create category",
        body: z.object({
          name: z.string().toLowerCase(),
        }),
        response: {
          201: z.object({ categoryId: z.uuid() }).describe("Created"),
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
          409: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Conflict"),
        },
      },
    },
    async (request, reply) => {
      const { id: userId } = await request.getCurrentUser()

      const { name } = request.body

      const exists = await db
        .select()
        .from(categories)
        .where(ilike(categories.name, name))

      if (exists.length > 0) {
        throw new CategoryAlreadyExists()
      }

      const result = await db
        .insert(categories)
        .values({
          name,
          userId,
        })
        .returning()

      return reply.status(201).send({ categoryId: result[0].id })
    },
  )
}
