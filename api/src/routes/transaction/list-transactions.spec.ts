import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("List transactions [GET] /transactions", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list transactions", async () => {
    const { token, user } = await createAndAuthUser(app)

    const [{ account }, { category }] = await Promise.all([
      makeAccount({ userId: user.id }),
      makeCategory({ userId: user.id }),
    ])

    await Promise.all([
      makeTransaction({
        userId: user.id,
        accountId: account.id,
        categoryId: category.id,
      }),
      makeTransaction({
        userId: user.id,
        accountId: account.id,
        categoryId: category.id,
      }),
    ])

    const response = await request(app.server)
      .get("/transactions")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          accountId: account.id,
          categoryId: category.id,
          userId: user.id,
          category: expect.objectContaining({
            id: category.id,
            userId: user.id,
          }),
          account: expect.objectContaining({
            id: account.id,
            userId: user.id,
          }),
        }),
      ]),
    )
  })
})
