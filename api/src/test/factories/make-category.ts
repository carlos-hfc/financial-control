import { fakerPT_BR as faker } from "@faker-js/faker"

import { db } from "../../database/client.ts"
import { categories } from "../../database/schema.ts"
import { makeUser } from "./make-user.ts"

export interface MakeCategoryParams {
  name: string
  userId: string
}

export async function makeCategory(override: Partial<MakeCategoryParams> = {}) {
  const userId = override.userId ?? (await makeUser()).user.id

  const result = await db
    .insert(categories)
    .values({
      name: override.name ?? faker.word.adjective(),
      userId,
    })
    .onConflictDoNothing({ target: categories.name })
    .returning()

  return {
    category: result[0],
  }
}
