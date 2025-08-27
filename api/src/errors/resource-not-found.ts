import { ClientError } from "./client-error.ts"

export class ResourceNotFound extends ClientError {
  constructor() {
    super("Resource not found", 404)
  }
}
