import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Get profile [GET] /profile", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get logged user profile", async () => {
    const { token, user } = await createAndAuthUser(app)

    const response = await request(app.server)
      .get("/profile")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: user.name,
      email: user.email,
    })
  })
})
