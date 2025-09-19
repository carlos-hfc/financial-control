import { faker } from "@faker-js/faker"
import { hash } from "argon2"
import { addHours } from "date-fns"
import { and, eq } from "drizzle-orm"

import { db } from "./client.ts"
import {
  accounts,
  categories,
  transactions,
  transactionTypeRole,
  users,
} from "./schema.ts"

await db.delete(transactions)
await db.delete(accounts)
await db.delete(categories)
await db.delete(users)

const password = await hash("123456")

const [user1, user2] = await db
  .insert(users)
  .values([
    {
      name: "John Doe",
      email: "john.doe@email.com",
      password,
    },
    {
      name: "Jane Doe",
      email: "jane.doe@email.com",
      password,
    },
  ])
  .returning()

const resultCategories = await db
  .insert(categories)
  .values([
    { userId: user1.id, name: faker.word.adjective() },
    { userId: user1.id, name: faker.word.adjective() },
    { userId: user1.id, name: faker.word.adjective() },
    { userId: user2.id, name: faker.word.adjective() },
    { userId: user2.id, name: faker.word.adjective() },
    { userId: user2.id, name: faker.word.adjective() },
  ])
  .returning()

const resultAccounts = await db
  .insert(accounts)
  .values([
    {
      userId: user1.id,
      name: "Bradesco",
      currentBalance: "0",
      type: "corrente",
    },
    {
      userId: user1.id,
      name: "Nubank",
      currentBalance: "0",
      type: "poupanca",
    },
    {
      userId: user2.id,
      name: "Itaú",
      currentBalance: "0",
      type: "corrente",
    },
  ])
  .returning()

for (let index = 0; index < 20; index++) {
  const userId = faker.helpers.arrayElement([user1.id, user2.id])
  const account = resultAccounts.filter(account => account.userId === userId)
  const category = resultCategories.filter(
    category => category.userId === userId,
  )
  const type = faker.helpers.arrayElement(transactionTypeRole.enumValues)

  const selectedAccount = faker.helpers.arrayElement(account)

  const data = {
    userId,
    type,
    accountId: selectedAccount.id,
    categoryId: faker.helpers.arrayElement(category).id,
    date: addHours(faker.date.recent({ days: 10 }), 3).toISOString(),
    description: faker.lorem.words(2),
    value: faker.number
      .float({ min: 0, max: type === "income" ? 5000 : 250 })
      .toString(),
  }

  await db.insert(transactions).values(data)

  const newBalance =
    Number(selectedAccount.currentBalance) +
    Number(Number(data.value) * (data.type === "expense" ? -1 : 1))

  await db
    .update(accounts)
    .set({
      currentBalance: newBalance.toFixed(2),
    })
    .where(and(eq(accounts.id, data.accountId), eq(accounts.userId, userId)))
}

console.log("Database seeded successfully!")

process.exit()
