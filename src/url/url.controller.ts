import { UrlService } from "./url.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { Express, Request, Response } from "express";
import { validationGuard } from "../core/validation/validation.guard";
import { ValidationException } from "../core/validation/Validation.exception";
import { UrlNotFoundException } from "./exception/url-not-found.exception";

export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  routing(app: Express) {
    app.post(`/api/shorturl`, this.createUrl);
    app.get(`/api/shorturl/analytics`, this.analytics);
    app.get(`/api/shorturl/:id`, this.redirect);
  }

  createUrl = async (request: Request, response: Response) => {
    try {
      await validationGuard(request.body, CreateUrlDto);
    } catch (error: any) {
      if (error instanceof ValidationException) {
        return response.status(error.httpStatus).json({ error: error.message });
      } else {
        throw error;
      }
    }

    const url = await this.urlService.create(request.body);
    response.status(201).json(url);
  };

  redirect = async (request: Request, response: Response) => {
    try {
      const originalUrl = await this.urlService.findByShortUrl(
        request.params.id
      );
      response.redirect(originalUrl);
    } catch (error: any) {
      if (error instanceof UrlNotFoundException) {
        return response.status(error.httpStatus).json({
          error: error.message,
        });
      }
      throw error;
    }
  };

  analytics = async (request: Request, response: Response) => {
    response.status(200).json(await this.urlService.analytics());
  };
}
