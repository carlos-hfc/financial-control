import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("List categories [GET] /categories", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create category", async () => {
    const { token, user } = await createAndAuthUser(app)

    await Promise.all([
      makeCategory({ userId: user.id }),
      makeCategory({ userId: user.id }),
      makeCategory({ userId: user.id }),
      makeCategory({ userId: user.id }),
    ])

    const response = await request(app.server)
      .get("/categories")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      ]),
    )
  })
})
