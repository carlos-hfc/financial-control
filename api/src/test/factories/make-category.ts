import { fakerPT_BR as faker } from "@faker-js/faker"
import { and, eq } from "drizzle-orm"

import { db } from "../../database/client.ts"
import { categories } from "../../database/schema.ts"
import { makeUser } from "./make-user.ts"

export interface MakeCategoryParams {
  name: string
  userId: string
}

export async function makeCategory(override: Partial<MakeCategoryParams> = {}) {
  const userId = override.userId ?? (await makeUser()).user.id
  const name = override.name ?? faker.word.adjective()

  const exists = await db
    .select()
    .from(categories)
    .where(and(eq(categories.name, name), eq(categories.userId, userId)))

  if (exists.length > 0) {
    return { category: exists[0] }
  }

  const result = await db
    .insert(categories)
    .values({
      name,
      userId,
    })
    .returning()

  return {
    category: result[0],
  }
}
