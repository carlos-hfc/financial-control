import { type FastifyInstance } from "fastify"
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod"

import { ClientError } from "./errors/client-error.ts"

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ClientError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Invalid input",
      statusCode: 400,
      errors: error.validation,
    })
  }

  console.log(error)

  return reply.status(500).send({
    message: "Internal Server Error",
    error: JSON.stringify(error),
    statusCode: 500,
  })
}
