import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { env } from "../../env.ts"
import { auth } from "../../middlewares/auth.ts"

export const refreshRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).patch(
    "/session/refresh",
    {
      schema: {
        tag: ["session"],
        summary: "Refresh a token",
        response: {
          200: z.object({ token: z.string() }).describe("OK"),
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
      const token = await reply.jwtSign({ sub: id })
      const refreshToken = await reply.jwtSign(
        { sub: id },
        {
          sign: {
            expiresIn: "10m",
          },
        },
      )

      return reply
        .setCookie(env.COOKIE_NAME, refreshToken, {
          path: "/",
          httpOnly: true,
          sameSite: true,
          secure: true,
        })
        .send({ token })
    },
  )
}
