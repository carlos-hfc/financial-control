import { relations } from "drizzle-orm"
import {
  date,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const userRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  accounts: many(accounts),
  transactions: many(transactions),
}))

export const categories = pgTable(
  "categories",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  table => [uniqueIndex().on(table.userId, table.name)],
)

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}))

export const accountTypeRole = pgEnum("accountTypeRoles", [
  "corrente",
  "poupanca",
  "credito",
])

export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  type: accountTypeRole().notNull().default("corrente"),
  initialBalance: numeric({ precision: 10, scale: 2 }).notNull().default("0"),
  currentBalance: numeric({ precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const accountRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}))

export const transactionTypeRole = pgEnum("transactionTypeRoles", [
  "income",
  "expense",
])

export const transactions = pgTable("transactions", {
  id: uuid().primaryKey().defaultRandom(),
  accountId: uuid()
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  categoryId: uuid()
    .notNull()
    .references(() => categories.id),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  value: numeric({ precision: 10, scale: 2 }).notNull(),
  type: transactionTypeRole().notNull(),
  description: text().notNull(),
  date: date().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}))
