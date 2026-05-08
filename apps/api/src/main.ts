import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // Global prefix for APIs
  app.setGlobalPrefix("api");

  // Enable CORS for web frontend client communication
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3009"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Perception Mapper AI NestJS Core API running on: http://localhost:${port}/api`);
}
bootstrap();
