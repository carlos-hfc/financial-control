import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("List accounts [GET] /accounts", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list accounts", async () => {
    const { token, user } = await createAndAuthUser(app)

    await Promise.all([
      makeAccount({ userId: user.id }),
      makeAccount({ userId: user.id }),
      makeAccount({ userId: user.id }),
      makeAccount({ userId: user.id }),
    ])

    const response = await request(app.server)
      .get("/accounts")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          userId: user.id,
          name: expect.any(String),
          type: expect.any(String),
          initialBalance: expect.any(Number),
          currentBalance: expect.any(Number),
        }),
      ]),
    )
  })
})
