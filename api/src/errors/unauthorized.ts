import { ClientError } from "./client-error.ts"

export class Unauthorized extends ClientError {
  constructor() {
    super("Unauthorized", 401)
  }
}
