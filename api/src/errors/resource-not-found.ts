import { ClientError } from "./client-error.ts"

export class ResourceNotFound extends ClientError {
  constructor(resource?: string) {
    super(`${resource ?? "Resource"} not found`, 404)
  }
}
