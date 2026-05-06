export class AppError extends Error {
  constructor(
    public errorCode: string,
    public reason: string,
    public statusCode: number = 500
  ) {
    super(reason);
    this.name = "AppError";
  }
}
