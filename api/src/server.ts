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
import { authenticateRoute } from "./routes/session/authenticate.ts"
import { refreshRoute } from "./routes/session/refresh.ts"
import { registerRoute } from "./routes/session/register.ts"
import { signOutRoute } from "./routes/session/sign-out.ts"
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

if (env.NODE_ENV !== "test") {
  app
    .listen({ port: 3333, host: "0.0.0.0" })
    .then(() => console.log("HTTP Server running!"))
}
