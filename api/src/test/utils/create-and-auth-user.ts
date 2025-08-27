import { FastifyInstance } from "fastify"
import request from "supertest"

import { makeUser, MakeUserParams } from "../factories/make-user.ts"

export async function createAndAuthUser(
  app: FastifyInstance,
  override: Partial<MakeUserParams> = {},
) {
  const { user, passwordBeforeHash } = await makeUser(override)

  const response = await request(app.server)
    .post("/session/authenticate")
    .send({
      email: user.email,
      password: passwordBeforeHash,
    })

  const token = response.get("Set-Cookie") as string[]

  return { token, user }
}
