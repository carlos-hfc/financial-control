import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

let token: string[]

describe("List daily financial by period [GET] /metrics/month-financial-by-category", () => {
  beforeAll(async () => {
    vi.setSystemTime(new Date(2025, 8, 30, 10, 0, 0))

    await app.ready()

    const createUser = await createAndAuthUser(app)

    token = createUser.token
    const user = createUser.user

    const { account } = await makeAccount({ userId: user.id })
    const categoriesIds: string[] = []

    for (let index = 0; index < 5; index++) {
      const { category } = await makeCategory({ userId: user.id })

      categoriesIds.push(category.id)
    }

    for (let index = 0; index < 20; index++) {
      await makeTransaction({
        userId: user.id,
        accountId: account.id,
        categoryId: faker.helpers.arrayElement(categoriesIds),
        date: faker.date.recent({ days: 25 }).toISOString(),
      })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list daily financial by period", async () => {
    const response = await request(app.server)
      .get("/metrics/month-financial-by-category")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amount: expect.any(Number),
          category: expect.any(String),
          expense: expect.any(Number),
          income: expect.any(Number),
        }),
      ]),
    )
  })
})
