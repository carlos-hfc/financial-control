import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Get account by id [GET] /accounts/:accountId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get account by id", async () => {
    const { token, user } = await createAndAuthUser(app)

    const [{ account }] = await Promise.all([
      makeAccount({ userId: user.id }),
      makeAccount({ userId: user.id }),
      makeAccount({ userId: user.id }),
      makeAccount({ userId: user.id }),
    ])

    const response = await request(app.server)
      .get(`/accounts/${account.id}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: user.id,
        name: expect.any(String),
        type: expect.any(String),
        currentBalance: expect.any(Number),
      }),
    )
  })

  it("should not be able to get account by id with inexistent id", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .get(`/accounts/${randomUUID()}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(404)
  })
})
