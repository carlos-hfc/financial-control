import { fakerPT_BR as faker } from "@faker-js/faker"

import { db } from "../../database/client.ts"
import { accounts, accountTypeRole } from "../../database/schema.ts"
import { makeUser } from "./make-user.ts"

export interface MakeAccountParams {
  name: string
  userId: string
  type: (typeof accountTypeRole.enumValues)[number]
  initialBalance: number
  currentBalance: number
}

export async function makeAccount(override: Partial<MakeAccountParams> = {}) {
  const userId = override.userId ?? (await makeUser()).user.id

  const data = {
    userId,
    name: override.name ?? faker.lorem.word(),
    initialBalance: String(
      override.initialBalance ?? faker.number.float({ max: 10 }),
    ),
    currentBalance: String(
      override.currentBalance ?? faker.number.float({ max: 100 }),
    ),
    type:
      override.type ?? faker.helpers.arrayElement(accountTypeRole.enumValues),
  }

  const result = await db.insert(accounts).values(data).returning()

  return {
    account: result[0],
  }
}
