import express, { Express } from "express";
import helmet from "helmet";
import { UrlController } from "./url/url.controller";
import { UrlService } from "./url/url.service";
import { mongooseConnection } from "./core/mongoose/connection";
import { DatabaseConfig } from "./config/database.config";
import { urlModel } from "./url/url.schema";
import { Mongoose } from "mongoose";

export const getApp = async (
  databaseConfig: DatabaseConfig
): Promise<{
  app: Express;
  connection: Mongoose;
}> => {
  // database connection
  const connection = await mongooseConnection(databaseConfig);

  // basic setup
  const app: Express = express();
  app.use(express.json());

  // security
  app.disable("x-powered-by");
  app.use(helmet());

  // route registry
  const urlService = new UrlService(urlModel);
  const urlController = new UrlController(urlService);
  urlController.routing(app);

  // Error handler
  app.use((error, request, response, next) => {
    if (error) {
      return response.status(500).send({
        error: "something went wrong...",
      });
    }
    return next();
  });

  return {
    app,
    connection,
  };
};
