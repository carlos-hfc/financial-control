import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("List popular categories [GET] /metrics/popular-categories", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list popular categories", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { account } = await makeAccount({ userId: user.id })

    const categories: string[] = []

    for (let index = 0; index < 10; index++) {
      const { category } = await makeCategory({ userId: user.id })
      categories.push(category.id)
    }

    for (let index = 0; index < categories.length; index++) {
      await makeTransaction({
        userId: user.id,
        accountId: account.id,
        categoryId: faker.helpers.arrayElement(categories),
      })
    }

    const response = await request(app.server)
      .get("/metrics/popular-categories")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: expect.any(String),
          amount: expect.any(Number),
        }),
      ]),
    )
  })
})
