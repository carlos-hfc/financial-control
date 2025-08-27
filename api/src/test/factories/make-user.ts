import { fakerPT_BR as faker } from "@faker-js/faker"
import { hash } from "argon2"

import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"

export interface MakeUserParams {
  name: string
  email: string
  password: string
}

export async function makeUser(override: Partial<MakeUserParams> = {}) {
  const passwordBeforeHash = override.password ?? faker.internet.password()

  const result = await db
    .insert(users)
    .values({
      name: override.name ?? faker.person.fullName(),
      email: override.email ?? faker.internet.email().toLowerCase(),
      password: await hash(passwordBeforeHash),
    })
    .returning()

  return {
    user: result[0],
    passwordBeforeHash,
  }
}
