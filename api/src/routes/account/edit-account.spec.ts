import { randomUUID } from "node:crypto"

import { faker } from "@faker-js/faker"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { accountTypeRole } from "../../database/schema.ts"
import { app } from "../../server.ts"
import { makeAccount } from "../../test/factories/make-account.ts"
import { createAndAuthUser } from "../../test/utils/create-and-auth-user.ts"

describe("Edit account [PUT] /accounts/:accountId", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to update account", async () => {
    const { token, user } = await createAndAuthUser(app)

    const [{ account }] = await Promise.all([makeAccount({ userId: user.id })])

    const response = await request(app.server)
      .put(`/accounts/${account.id}`)
      .set("Cookie", token)
      .send({
        name: faker.lorem.word(),
        type: faker.helpers.arrayElement(accountTypeRole.enumValues),
      })

    expect(response.status).toEqual(204)
  })

  it("should not be able to update account with inexistent id", async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .put(`/accounts/${randomUUID()}`)
      .set("Cookie", token)
      .send({
        name: faker.lorem.word(),
        type: faker.helpers.arrayElement(accountTypeRole.enumValues),
      })

    expect(response.status).toEqual(404)
  })
})
