import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { accountTypeRole } from "../../database/schema.ts"
import { app } from "../../server.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Create account [POST] /accounts", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create an account", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/accounts")
      .set("Cookie", token)
      .send({
        name: faker.lorem.word(),
        initialBalance: faker.number.float({ max: 10 }),
        currentBalance: faker.number.float({ max: 100 }),
        type: faker.helpers.arrayElement(accountTypeRole.enumValues),
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      accountId: expect.any(String),
    })
  })

  it("should be able to create an account without initial balance", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/accounts")
      .set("Cookie", token)
      .send({
        name: faker.lorem.word(),
        currentBalance: faker.number.float({ max: 100 }).toString(),
        type: faker.helpers.arrayElement(accountTypeRole.enumValues),
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      accountId: expect.any(String),
    })
  })
})
