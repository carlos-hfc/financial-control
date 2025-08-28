import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  name: text().notNull().unique(),
})

export const accountTypeRole = pgEnum("accountTypeRoles", [
  "corrente",
  "poupanca",
  "credito",
])

export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  name: text().notNull(),
  type: accountTypeRole().notNull().default("corrente"),
  initialBalance: numeric({ precision: 10, scale: 2 }).notNull().default("0"),
  currentBalance: numeric({ precision: 10, scale: 2 }).notNull(),
})
