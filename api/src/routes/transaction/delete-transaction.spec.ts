import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Delete transaction [DELETE] /transactions/:transactionId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to delete transaction", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })
    const { account } = await makeAccount({ userId: user.id })
    const { transaction } = await makeTransaction({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
    })

    const response = await request(app.server)
      .delete(`/transactions/${transaction.id}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(204)
  })

  it("should not be able to delete an inexistent transaction", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .delete(`/transactions/${randomUUID()}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(404)
  })
})
