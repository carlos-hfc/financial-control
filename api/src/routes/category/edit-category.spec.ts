import { randomUUID } from "node:crypto"

import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeCategory } from "../../test/factories/make-category.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Edit category [PUT] /categories/:categoryId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update category", async () => {
    const { token, user } = await createAndAuthUser(app)

    const { category } = await makeCategory({ userId: user.id })

    const response = await request(app.server)
      .put(`/categories/${category.id}`)
      .set("Cookie", token)
      .send({
        name: faker.lorem.word(),
      })

    expect(response.status).toEqual(204)
  })

  it("should not be able to update category with inexistent id", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .put(`/categories/${randomUUID()}`)
      .set("Cookie", token)
      .send({
        name: faker.lorem.word(),
      })

    expect(response.status).toEqual(404)
  })
})
