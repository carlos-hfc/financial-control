import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Register [PATCH] /session/refresh", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to refresh a token", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .patch("/session/refresh")
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get("Set-Cookie")).toEqual([expect.any(String)])
  })

  it("should not be able to refresh a token without the old token", async () => {
    const response = await request(app.server).patch("/session/refresh").send()

    expect(response.status).toEqual(401)
  })
})
