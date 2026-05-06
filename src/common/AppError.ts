export class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    public errorCode: string,
    public reason: string,
    public data: any | null = null,
  ) {
    super(reason);
    this.name = "AppError";
  }
}
