import { getApp } from "./app";
import { DatabaseConfig } from "./config/database.config";

async function bootstrap() {
  const { app } = await getApp(new DatabaseConfig());
  const port = parseInt(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start with error", error);
  process.exit(1);
});
