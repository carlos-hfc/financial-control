import { fakerPT_BR as faker } from "@faker-js/faker"
import { and, eq } from "drizzle-orm"

import { db } from "../../database/client.ts"
import {
  accounts,
  transactions,
  transactionTypeRole,
} from "../../database/schema.ts"
import { makeAccount } from "./make-account.ts"
import { makeCategory } from "./make-category.ts"
import { makeUser } from "./make-user.ts"

export interface MakeTransactionParams {
  description: string
  categoryId: string
  accountId: string
  userId: string
  type: (typeof transactionTypeRole.enumValues)[number]
  value: number
  date: string
}

export async function makeTransaction(
  override: Partial<MakeTransactionParams> = {},
) {
  const userId = override.userId ?? (await makeUser()).user.id
  const categoryId =
    override.categoryId ?? (await makeCategory({ userId })).category.id
  const accountId =
    override.accountId ?? (await makeAccount({ userId })).account.id

  const data = {
    userId,
    accountId,
    categoryId,
    description: override.description ?? faker.lorem.words(2),
    value: String(
      override.value ?? faker.number.float({ max: 10, fractionDigits: 2 }),
    ),
    date: override.date ?? faker.date.past().toISOString(),
    type:
      override.type ??
      faker.helpers.arrayElement(transactionTypeRole.enumValues),
  }

  const result = await db.insert(transactions).values(data).returning()

  const [account] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.id, data.accountId), eq(accounts.userId, userId)))

  const newBalance =
    Number(account.currentBalance) +
    Number(Number(data.value) * (data.type === "expense" ? -1 : 1))

  await db
    .update(accounts)
    .set({
      currentBalance: newBalance.toFixed(2),
    })
    .where(and(eq(accounts.id, data.accountId), eq(accounts.userId, userId)))

  return {
    transaction: result[0],
  }
}
