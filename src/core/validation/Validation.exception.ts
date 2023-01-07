import { HttpException } from "../exception/http.exception";

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}
