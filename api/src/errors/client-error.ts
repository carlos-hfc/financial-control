export class ClientError extends Error {
  public statusCode: number

  constructor(message: string, statusCode?: number) {
    super(message)

    this.statusCode = statusCode ?? 400
  }
}
