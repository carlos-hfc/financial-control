import { ClientError } from "./client-error.ts"

export class UserAlreadyExists extends ClientError {
  constructor() {
    super("E-mail already exists", 409)
  }
}
