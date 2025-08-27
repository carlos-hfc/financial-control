import { ClientError } from "./client-error.ts"

export class InvalidCredentials extends ClientError {
  constructor() {
    super("Invalid credentials", 400)
  }
}
