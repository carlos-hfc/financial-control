import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeUser } from "../../test/factories/make-user.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Update profile [PUT] /profile", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update logged user profile", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        name: "Jane Doe",
      })

    expect(response.status).toEqual(204)
  })

  it("should not be able to update logged user profile with the new password being equal to the current password", async () => {
    const { token } = await createAndAuthUser(app, {
      password: "12345678",
    })

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        password: "12345678",
        confirmPassword: "12345678",
      })

    expect(response.status).toEqual(400)
  })

  it("should not be able to update logged user profile with the confirm password not equal to the new password", async () => {
    const { token } = await createAndAuthUser(app, {
      password: "12345678",
    })

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        password: "12345678",
        confirmPassword: "123456789",
      })

    expect(response.status).toEqual(400)
  })

  it("should not be able to update logged user profile with an existent e-mail", async () => {
    const { user } = await makeUser()
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .put("/profile")
      .set("Cookie", token)
      .send({
        email: user.email,
      })

    expect(response.status).toEqual(409)
  })
})
