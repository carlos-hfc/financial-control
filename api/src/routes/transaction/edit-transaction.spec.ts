import { randomUUID } from "node:crypto"

import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { transactionTypeRole } from "../../database/schema.ts"
import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Create transaction [PUT] /transactions/:transactionId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update an transaction", async () => {
    const { token, user } = await createAndAuthUser(app)

    const [{ category }, { category: category2 }] = await Promise.all([
      makeCategory({ userId: user.id }),
      makeCategory({ userId: user.id }),
    ])

    const { account } = await makeAccount({ userId: user.id })
    const { transaction } = await makeTransaction({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
    })

    const response = await request(app.server)
      .put(`/transactions/${transaction.id}`)
      .set("Cookie", token)
      .send({
        categoryId: category2.id,
        date: faker.date.past(),
        description: faker.lorem.words(5),
        type: faker.helpers.arrayElement(transactionTypeRole.enumValues),
        value: faker.number.float(),
      })

    expect(response.status).toEqual(204)
  })

  it("should not be able to update an inexistent transaction", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .put(`/transactions/${randomUUID()}`)
      .set("Cookie", token)
      .send({
        value: faker.number.float(),
      })

    expect(response.status).toEqual(404)
  })

  it("should not be able to update an transaction with inexistent category", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })
    const { account } = await makeAccount({ userId: user.id })
    const { transaction } = await makeTransaction({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
    })

    const response = await request(app.server)
      .put(`/transactions/${transaction.id}`)
      .set("Cookie", token)
      .send({
        categoryId: randomUUID(),
      })

    expect(response.status).toEqual(404)
  })

  it("should not be able to update an transaction with date after today", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })

    const { account } = await makeAccount({ userId: user.id })
    const { transaction } = await makeTransaction({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
    })

    const response = await request(app.server)
      .put(`/transactions/${transaction.id}`)
      .set("Cookie", token)
      .send({
        date: faker.date.future(),
      })

    expect(response.status).toEqual(400)
  })
})
