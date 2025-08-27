import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeUser } from "../../test/factories/make-user.ts"

describe("Register [POST] /session/authenticate", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to authenticate an user", async () => {
    const { user, passwordBeforeHash } = await makeUser()

    const response = await request(app.server)
      .post("/session/authenticate")
      .send({
        email: user.email,
        password: passwordBeforeHash,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get("Set-Cookie")).toEqual([expect.any(String)])
  })

  it("should not be to authenticate with wrong e-mail", async () => {
    const { passwordBeforeHash } = await makeUser()

    const response = await request(app.server)
      .post("/session/authenticate")
      .send({
        email: "email@email.com",
        password: passwordBeforeHash,
      })

    expect(response.status).toEqual(400)
  })

  it("should not be to authenticate with wrong password", async () => {
    const { user } = await makeUser()

    const response = await request(app.server)
      .post("/session/authenticate")
      .send({
        email: user.email,
        password: "passwordBeforeHash",
      })

    expect(response.status).toEqual(400)
  })
})
