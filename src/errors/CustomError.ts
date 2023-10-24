export class CustomError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // 设置原型链
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
