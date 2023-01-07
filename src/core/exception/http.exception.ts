export class HttpException extends Error {
  constructor(message: string, public readonly httpStatus: number = 500) {
    super(message);
  }
}
