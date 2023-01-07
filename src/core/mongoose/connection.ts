import { DatabaseConfig } from "../../config/database.config";
import * as mongoose from "mongoose";

export const mongooseConnection = async (config: DatabaseConfig) => {
  mongoose.set("strictQuery", true);
  const connection = await mongoose.connect(config.uri);
  console.log("Mongoose connection started");
  return connection;
};
