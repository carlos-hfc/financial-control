import { ClientError } from "./client-error.ts"

export class NotAllowed extends ClientError {
  constructor(message: string) {
    super(message, 400)
  }
}
