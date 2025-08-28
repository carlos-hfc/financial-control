import { fakerPT_BR as faker } from "@faker-js/faker"

import { db } from "../../database/client.ts"
import { accounts, accountTypeRole } from "../../database/schema.ts"
import { makeUser } from "./make-user.ts"

export interface MakeAccountParams {
  name: string
  userId: string
  type: (typeof accountTypeRole.enumValues)[number]
  initialBalance: string
  currentBalance: string
}

export async function makeAccount(override: Partial<MakeAccountParams> = {}) {
  const userId = override.userId ?? (await makeUser()).user.id

  const obj = {
    name: faker.lorem.word(),
    initialBalance: faker.number.float({ max: 10 }).toString(),
    currentBalance: faker.number.float({ max: 100 }).toString(),
    type: faker.helpers.arrayElement(accountTypeRole.enumValues),
    ...override,
  }

  const result = await db
    .insert(accounts)
    .values({
      ...obj,
      userId,
    })
    .returning()

  return {
    account: result[0],
  }
}
