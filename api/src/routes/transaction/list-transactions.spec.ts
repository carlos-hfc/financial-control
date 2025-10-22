import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { makeTransaction } from "../../test/factories/make-transaction.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

let token: string[]
let accountId: string
let categoryId: string
let userId: string

describe("List transactions [GET] /transactions", () => {
  beforeAll(async () => {
    await app.ready()

    const user = await createAndAuthUser(app)

    token = user.token
    userId = user.user.id

    const [{ account }, { category }] = await Promise.all([
      makeAccount({ userId }),
      makeCategory({ userId }),
    ])

    accountId = account.id
    categoryId = category.id

    for (let index = 0; index < 3; index++) {
      await makeTransaction({
        userId,
        accountId,
        categoryId,
      })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list transactions", async () => {
    const response = await request(app.server)
      .get("/transactions")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            accountId,
            categoryId,
            userId,
            category: expect.objectContaining({
              id: categoryId,
              userId,
            }),
            account: expect.objectContaining({
              id: accountId,
              userId,
            }),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 3,
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list transactions filtering by type", async () => {
    const response = await request(app.server)
      .get("/transactions")
      .set("Cookie", token)
      .query({ type: "income" })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        transactions: expect.toBeOneOf([
          [],
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              accountId,
              categoryId,
              userId,
              type: "income",
              category: expect.objectContaining({
                id: categoryId,
                userId,
              }),
              account: expect.objectContaining({
                id: accountId,
                userId,
              }),
            }),
          ]),
        ]),
        meta: expect.objectContaining({
          totalCount: expect.any(Number),
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to list transactions filtering by category", async () => {
    const response = await request(app.server)
      .get("/transactions")
      .set("Cookie", token)
      .query({ category: categoryId })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        transactions: expect.toBeOneOf([
          [],
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              accountId,
              categoryId,
              userId,
              category: expect.objectContaining({
                id: categoryId,
                userId,
              }),
              account: expect.objectContaining({
                id: accountId,
                userId,
              }),
            }),
          ]),
        ]),
        meta: expect.objectContaining({
          totalCount: 3,
          pageIndex: 0,
          perPage: 10,
        }),
      }),
    )
  })

  it("should be able to paginated the transactions listing", async () => {
    for (let index = 0; index < 20; index++) {
      await makeTransaction({
        userId,
        accountId,
        categoryId,
      })
    }

    const response = await request(app.server)
      .get("/transactions")
      .set("Cookie", token)
      .query({ pageIndex: 1 })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            accountId,
            categoryId,
            userId,
            category: expect.objectContaining({
              id: categoryId,
              userId,
            }),
            account: expect.objectContaining({
              id: accountId,
              userId,
            }),
          }),
        ]),
        meta: expect.objectContaining({
          totalCount: 23,
          pageIndex: 1,
          perPage: 10,
        }),
      }),
    )
  })
})
