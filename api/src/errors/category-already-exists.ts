import { ClientError } from "./client-error.ts"

export class CategoryAlreadyExists extends ClientError {
  constructor() {
    super("Category already exists", 409)
  }
}
