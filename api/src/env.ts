import z from "zod"

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  JWT_SECRET: z.string(),
  COOKIE_NAME: z.string(),
  ALLOWED_ORIGINS: z.string(),
})

export const env = envSchema.parse(process.env)
