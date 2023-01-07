import { HttpException } from "../../core/exception/http.exception";

export class UrlNotFoundException extends HttpException {
  constructor() {
    super("url not found", 404);
  }
}
