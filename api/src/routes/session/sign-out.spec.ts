import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"

describe("Sign out [POST] /session/sign-out", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register an user", async () => {
    const response = await request(app.server).post("/session/sign-out").send()

    expect(response.status).toEqual(200)
  })
})
