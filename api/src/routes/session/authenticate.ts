import { verify } from "argon2"
import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"
import { env } from "../../env.ts"
import { InvalidCredentials } from "../../errors/invalid-credentials.ts"

export const authenticateRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    "/session/authenticate",
    {
      schema: {
        tags: ["session"],
        summary: "Authenticate user",
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        response: {
          200: z.object({ token: z.string() }).describe("OK"),
          400: z
            .object({
              message: z.string(),
              statusCode: z.number(),
            })
            .describe("Bad Request"),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const result = await db.select().from(users).where(eq(users.email, email))

      if (result.length <= 0) {
        throw new InvalidCredentials()
      }

      const user = result[0]

      const doesPasswordsMatch = await verify(user.password, password)

      if (!doesPasswordsMatch) {
        throw new InvalidCredentials()
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        {
          sign: {
            expiresIn: "1d",
          },
        },
      )

      return reply
        .setCookie(env.COOKIE_NAME, token, {
          path: "/",
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 1 * 60 * 60 * 24, // 1 day,
        })
        .send({ token })
    },
  )
}
