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
import { editCategoryRoute } from "./routes/category/edit-category.ts"
import { listCategoriesRoute } from "./routes/category/list-categories.ts"
import { getDailyFinancialInPeriodRoute } from "./routes/metrics/get-daily-financial-in-period.ts"
import { getMonthAmountTransactionsRoute } from "./routes/metrics/get-month-amount-transactions.ts"
import { getMonthExpenseRoute } from "./routes/metrics/get-month-expense.ts"
import { getMonthExpenseByCategoryRoute } from "./routes/metrics/get-month-expense-by-category.ts"
import { getMonthFinancialRoute } from "./routes/metrics/get-month-financial.ts"
import { getMonthIncomeRoute } from "./routes/metrics/get-month-income.ts"
import { getPopularCategoriesRoute } from "./routes/metrics/get-popular-categories.ts"
import { getYearFinancialRoute } from "./routes/metrics/get-year-financial.ts"
import { authenticateRoute } from "./routes/session/authenticate.ts"
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
  origin: ["http://localhost:5173"],
})
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: env.COOKIE_NAME,
    signed: false,
  },
  sign: {
    expiresIn: "1d",
  },
})

app.register(registerRoute)
app.register(authenticateRoute)
app.register(signOutRoute)

app.register(getProfileRoute)
app.register(editProfileRoute)

app.register(createCategoryRoute)
app.register(listCategoriesRoute)
app.register(editCategoryRoute)

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
app.register(getDailyFinancialInPeriodRoute)
app.register(getMonthIncomeRoute)
app.register(getMonthExpenseByCategoryRoute)
app.register(getMonthExpenseRoute)
app.register(getMonthAmountTransactionsRoute)
app.register(getYearFinancialRoute)
app.register(getMonthFinancialRoute)

if (env.NODE_ENV !== "test") {
  app
    .listen({ port: 3333, host: "0.0.0.0" })
    .then(() => console.log("HTTP Server running!"))
}
