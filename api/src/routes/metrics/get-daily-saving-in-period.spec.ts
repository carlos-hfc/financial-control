import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

let token: string[]

describe("List daily saving by period [GET] /metrics/daily-saving-in-period", () => {
  beforeAll(async () => {
    vi.setSystemTime(new Date(2025, 8, 1, 10, 0, 0))

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

  it("should be able to list daily saving by period", async () => {
    const response = await request(app.server)
      .get("/metrics/daily-saving-in-period")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          saving: expect.any(Number),
        }),
      ]),
    )
  })

  it("should be able to list daily saving by period filtering date interval", async () => {
    const response = await request(app.server)
      .get("/metrics/daily-saving-in-period")
      .set("Cookie", token)
      .query({
        from: "2025-08-24",
        to: "2025-08-30",
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          saving: expect.any(Number),
        }),
      ]),
    )
  })
})
