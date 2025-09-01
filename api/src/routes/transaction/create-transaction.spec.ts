import { randomUUID } from "node:crypto"

import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { transactionTypeRole } from "../../database/schema.ts"
import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Create transaction [POST] /transactions", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create an transaction", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })
    const { account } = await makeAccount({ userId: user.id })

    const response = await request(app.server)
      .post("/transactions")
      .set("Cookie", token)
      .send({
        accountId: account.id,
        categoryId: category.id,
        date: faker.date.past(),
        description: faker.lorem.words(5),
        type: faker.helpers.arrayElement(transactionTypeRole.enumValues),
        value: faker.number.float(),
        userId: user.id,
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      transactionId: expect.any(String),
    })
  })

  it("should not be able to create an transaction with inexistent category", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { account } = await makeAccount({ userId: user.id })

    const response = await request(app.server)
      .post("/transactions")
      .set("Cookie", token)
      .send({
        accountId: account.id,
        categoryId: randomUUID(),
        date: faker.date.past(),
        description: faker.lorem.words(5),
        type: faker.helpers.arrayElement(transactionTypeRole.enumValues),
        value: faker.number.float(),
        userId: user.id,
      })

    expect(response.status).toEqual(404)
  })

  it("should not be able to create an transaction with inexistent account", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })

    const response = await request(app.server)
      .post("/transactions")
      .set("Cookie", token)
      .send({
        accountId: randomUUID(),
        categoryId: category.id,
        date: faker.date.past(),
        description: faker.lorem.words(5),
        type: faker.helpers.arrayElement(transactionTypeRole.enumValues),
        value: faker.number.float(),
        userId: user.id,
      })

    expect(response.status).toEqual(404)
  })

  it("should not be able to create an transaction with date after today", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })
    const { account } = await makeAccount({ userId: user.id })

    const response = await request(app.server)
      .post("/transactions")
      .set("Cookie", token)
      .send({
        accountId: account.id,
        categoryId: category.id,
        date: faker.date.future(),
        description: faker.lorem.words(5),
        type: faker.helpers.arrayElement(transactionTypeRole.enumValues),
        value: faker.number.float(),
        userId: user.id,
      })

    expect(response.status).toEqual(400)
  })
})
