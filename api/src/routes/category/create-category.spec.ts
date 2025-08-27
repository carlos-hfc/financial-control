import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Create category [POST] /categories", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create category", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post("/categories")
      .set("Cookie", token)
      .send({
        name: faker.word.noun(),
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      categoryId: expect.any(String),
    })
  })

  it("should not be able to create category with same name", async () => {
    const { token } = await createAndAuthUser(app)

    const name = faker.word.noun()

    await request(app.server).post("/categories").set("Cookie", token).send({
      name,
    })

    const response = await request(app.server)
      .post("/categories")
      .set("Cookie", token)
      .send({
        name,
      })

    expect(response.status).toEqual(409)
  })
})
