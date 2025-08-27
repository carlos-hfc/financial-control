import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeUser } from "../../test/factories/make-user.ts"

describe("Register [POST] /session/register", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register an user", async () => {
    const response = await request(app.server).post("/session/register").send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "12345678",
    })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      userId: expect.any(String),
    })
  })

  it("should not be to register an user with same e-mail", async () => {
    const email = faker.internet.email()

    await makeUser({ email })

    const response = await request(app.server).post("/session/register").send({
      name: faker.person.fullName(),
      email,
      password: "12345678",
    })

    expect(response.status).toEqual(409)
  })
})
