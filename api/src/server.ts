import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import fastifyApiReference from "@scalar/fastify-api-reference"
import fastify from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"

import { env } from "./env.ts"
import { errorHandler } from "./error-handler.ts"
import { createAccountRoute } from "./routes/account/create-account.ts"
import { deleteAccountRoute } from "./routes/account/delete-account.ts"
import { editAccountRoute } from "./routes/account/edit-account.ts"
import { getAccountByIdRoute } from "./routes/account/get-account-by-id.ts"
import { listAccountRoute } from "./routes/account/list-account.ts"
import { createCategoryRoute } from "./routes/category/create-category.ts"
import { listCategoriesRoute } from "./routes/category/list-categories.ts"
import { getDailyFinancialInPeriodRoute } from "./routes/metrics/get-daily-financial-in-period.ts"
import { getDailySavingInPeriodRoute } from "./routes/metrics/get-daily-saving-in-period.ts"
import { getDailySpendingInPeriodRoute } from "./routes/metrics/get-daily-spending-in-period.ts"
import { getPopularCategoriesRoute } from "./routes/metrics/get-popular-categories.ts"
import { authenticateRoute } from "./routes/session/authenticate.ts"
import { refreshRoute } from "./routes/session/refresh.ts"
import { registerRoute } from "./routes/session/register.ts"
import { signOutRoute } from "./routes/session/sign-out.ts"
import { createTransactionRoute } from "./routes/transaction/create-transaction.ts"
import { deleteTransactionRoute } from "./routes/transaction/delete-transaction.ts"
import { editTransactionRoute } from "./routes/transaction/edit-transaction.ts"
import { getTransactionRoute } from "./routes/transaction/get-transaction.ts"
import { listTransactionsRoute } from "./routes/transaction/list-transactions.ts"
import { editProfileRoute } from "./routes/user/edit-profile.ts"
import { getProfileRoute } from "./routes/user/get-profile.ts"

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Financial control",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifyApiReference, {
  routePrefix: "/docs",
  configuration: {
    theme: "kepler",
  },
})

app.register(fastifyCookie)
app.register(fastifyCors, {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
})
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: env.COOKIE_NAME,
    signed: false,
  },
  sign: {
    expiresIn: "5m",
  },
})

app.register(registerRoute)
app.register(authenticateRoute)
app.register(refreshRoute)
app.register(signOutRoute)

app.register(getProfileRoute)
app.register(editProfileRoute)

app.register(createCategoryRoute)
app.register(listCategoriesRoute)

app.register(createAccountRoute)
app.register(listAccountRoute)
app.register(getAccountByIdRoute)
app.register(editAccountRoute)
app.register(deleteAccountRoute)

app.register(createTransactionRoute)
app.register(listTransactionsRoute)
app.register(getTransactionRoute)
app.register(editTransactionRoute)
app.register(deleteTransactionRoute)

app.register(getPopularCategoriesRoute)
app.register(getDailySpendingInPeriodRoute)
app.register(getDailySavingInPeriodRoute)
app.register(getDailyFinancialInPeriodRoute)

if (env.NODE_ENV !== "test") {
  app
    .listen({ port: 3333, host: "0.0.0.0" })
    .then(() => console.log("HTTP Server running!"))
}
