import { randomUUID } from "node:crypto"

import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Delete account [DELETE] /accounts/:accountId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to delete account", async () => {
    const { token, user } = await createAndAuthUser(app)

    const [{ account }] = await Promise.all([makeAccount({ userId: user.id })])

    const response = await request(app.server)
      .delete(`/accounts/${account.id}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(204)
  })

  it("should not be able to delete account with inexistent id", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .delete(`/accounts/${randomUUID()}`)
      .set("Cookie", token)
      .send()

    expect(response.status).toEqual(404)
  })
})
