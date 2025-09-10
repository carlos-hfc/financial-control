import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

import { env } from "../../env.ts"

export const signOutRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    "/session/sign-out",
    {
      schema: {
        tags: ["session"],
        summary: "Sign out user",
        response: {
          200: z.null().describe("OK"),
        },
      },
    },
    async (_, reply) => {
      return reply.clearCookie(env.COOKIE_NAME).send()
    },
  )
}
