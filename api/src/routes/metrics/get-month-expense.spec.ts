import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

let token: string[]

describe("List monthly expense [GET] /metrics/month-expense", () => {
  beforeAll(async () => {
    await app.ready()

    const createUser = await createAndAuthUser(app)

    token = createUser.token
    const user = createUser.user

    const { account } = await makeAccount({ userId: user.id })
    const { category } = await makeCategory({ userId: user.id })

    for (let index = 0; index < 20; index++) {
      await makeTransaction({
        userId: user.id,
        accountId: account.id,
        categoryId: category.id,
        date: faker.date.recent({ days: 10 }).toISOString(),
      })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list monthly expense", async () => {
    const response = await request(app.server)
      .get("/metrics/month-expense")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        diffFromLastMonth: expect.any(Number),
        expense: expect.any(Number),
      }),
    )
  })
})
